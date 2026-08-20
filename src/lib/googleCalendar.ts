/**
 * The Google Calendar half of the booking pipeline.
 *
 * ── Why this file exists ─────────────────────────────────────────────────
 * It is the whole of our booking integration with Google. When a visitor claims
 * a slot on /book, `createBookingEvent` puts the call on the founder's calendar
 * and mints its Google Meet link in the same request; the reminder job later
 * reads that calendar back to notice anything changed by hand.
 *
 * This used to be a read-only client. TidyCal owned the booking and wrote the
 * event, and everything here existed to observe a calendar somebody else was
 * filling in. Dropping TidyCal moved the write side to us — which is a smaller
 * change than it sounds, because the Meet link was already being created here
 * (auto-creation was a paid TidyCal feature; the link belongs to the event, not
 * to them, so `ensureMeetLink` was always ours).
 *
 * ── No googleapis dependency ─────────────────────────────────────────────
 * The official client is a large tree pulled in for four HTTP calls: a list, an
 * insert and two patches. All are plain REST, so they are written out here.
 * Token handling — the one thing the library would genuinely have absorbed —
 * lives in googleAuth.ts, shared with the Gmail sender.
 */

import { googleAccessToken, googleReady } from './googleAuth'

const API = 'https://www.googleapis.com/calendar/v3'

/** Which calendar the bookings land on. `primary` is right for a personal account. */
export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary'

export const calendarReady = googleReady

async function call(path: string, init: RequestInit = {}) {
  const token = await googleAccessToken()
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(15_000),
  })
  const raw = await res.text()
  if (!res.ok) throw new Error(`Google Calendar ${res.status} on ${path}: ${raw.slice(0, 300)}`)
  return raw ? JSON.parse(raw) : {}
}

export type CalendarEvent = {
  id: string
  status?: string
  summary?: string
  description?: string
  location?: string
  hangoutLink?: string
  htmlLink?: string
  created?: string
  start?: { dateTime?: string; date?: string; timeZone?: string }
  end?: { dateTime?: string; date?: string; timeZone?: string }
  organizer?: { email?: string; self?: boolean }
  creator?: { email?: string; self?: boolean }
  attendees?: { email?: string; displayName?: string; organizer?: boolean; self?: boolean; responseStatus?: string }[]
  conferenceData?: {
    entryPoints?: { entryPointType?: string; uri?: string }[]
    createRequest?: { status?: { statusCode?: string } }
  }
}

/**
 * Upcoming events on the connected calendar.
 *
 * `singleEvents` expands recurrence into individual instances — a booking is
 * always a single occurrence, but the host's own recurring standups are not, and
 * without expansion those arrive as one master event with no usable start time.
 *
 * `showDeleted` is on so that a cancelled booking still appears, with
 * `status: 'cancelled'`. Without it a cancellation is indistinguishable from an
 * event that has scrolled out of the window, and we would keep reminding someone
 * about a call that is not happening.
 *
 * The window starts slightly in the past so a booking made for "in ten minutes"
 * is not missed between two runs.
 */
export async function listUpcomingEvents({ daysAhead = 45 }: { daysAhead?: number } = {}) {
  const timeMin = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const timeMax = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString()

  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: 'true',
    showDeleted: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  })

  const body = (await call(`/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`)) as {
    items?: CalendarEvent[]
  }
  return body.items || []
}

/** The joining link on an event, wherever Google happens to have put it. */
export function meetLinkOf(event: CalendarEvent): string {
  if (event.hangoutLink) return event.hangoutLink
  const video = event.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')
  return video?.uri || ''
}

/**
 * Give an event a Google Meet link, if it has not got one.
 *
 * ── Why sendUpdates=none ─────────────────────────────────────────────────
 * Patching an event with attendees makes Google email them about the change, and
 * that email carries the Meet link. The requirement is that the link goes out an
 * hour before the call and not before, so letting Google announce it at booking
 * time would quietly break the thing this pipeline exists to do. Silence here;
 * the link is delivered by the hour-before WhatsApp message.
 *
 * ── Why the link may not come back immediately ───────────────────────────
 * Conference creation is asynchronous: Google accepts the request and reports
 * `pending`, and the link appears a moment later. Rather than polling in-process,
 * this returns '' and lets the next scheduled run pick it up — the poller is
 * already idempotent and runs every few minutes, so waiting is free, whereas a
 * retry loop here would hold the job open for no reason.
 */
export async function ensureMeetLink(event: CalendarEvent): Promise<string> {
  const existing = meetLinkOf(event)
  if (existing) return existing

  // requestId must be stable per attempt but unique per conference. The event id
  // is both, and reusing it means a retried patch cannot create a second
  // conference on the same event.
  const updated = (await call(
    `/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${encodeURIComponent(event.id)}?conferenceDataVersion=1&sendUpdates=none`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        conferenceData: {
          createRequest: {
            requestId: `sirah-${event.id}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      }),
    },
  )) as CalendarEvent

  return meetLinkOf(updated)
}

/**
 * Create the calendar event for a booking.
 *
 * ── This is the call that replaces TidyCal ───────────────────────────────
 * Everything else in this file already existed to *read* a calendar somebody
 * else wrote to. This writes it. The event it creates is the same artefact the
 * old pipeline waited to discover by polling — except it now exists the instant
 * the visitor confirms, carries the id we chose to key the booking on, and
 * needs no heuristic to recognise, because we are the ones who made it.
 *
 * ── conferenceDataVersion=1 ──────────────────────────────────────────────
 * Without that query parameter Google silently drops the `conferenceData` in the
 * body — no error, no link, just an event with nothing attached. With it, the
 * Meet link is usually created inline and comes back on the response, which is
 * what makes `ensureMeetLink` a fallback here rather than the main path.
 *
 * ── sendUpdates=none, and what it costs ──────────────────────────────────
 * Google would otherwise email the invitee an invitation carrying the Meet link
 * the moment this runs. That directly contradicts the rule the rest of this
 * pipeline is built around: the joining link goes out an hour before the call
 * and not before, so it cannot be buried in a week-old thread. Silence here, and
 * the WhatsApp confirmation is what tells them the booking landed.
 *
 * The cost is real and worth naming: the invitee gets no calendar invitation, so
 * the call does not appear in *their* calendar. If that turns out to matter more
 * than link timing, this is the one flag to change — and the hour-before message
 * then becomes a reminder rather than a delivery.
 */
export async function createBookingEvent({
  summary,
  description,
  startAt,
  endAt,
  timeZone,
  attendeeEmail,
  attendeeName,
}: {
  summary: string
  description?: string
  startAt: string
  endAt: string
  timeZone: string
  attendeeEmail: string
  attendeeName?: string
}): Promise<CalendarEvent> {
  // requestId must be unique per conference. There is no event id yet — it is
  // being created — so the instant plus the invitee is the stable key, which
  // also means a retried create cannot spawn two conferences for one booking.
  const requestId = `sirah-${Date.parse(startAt)}-${attendeeEmail.replace(/[^a-z0-9]/gi, '').slice(0, 20)}`

  return (await call(
    `/calendars/${encodeURIComponent(CALENDAR_ID)}/events?conferenceDataVersion=1&sendUpdates=none`,
    {
      method: 'POST',
      body: JSON.stringify({
        summary,
        description,
        start: { dateTime: startAt, timeZone },
        end: { dateTime: endAt, timeZone },
        attendees: [{ email: attendeeEmail, displayName: attendeeName || undefined }],
        conferenceData: {
          createRequest: {
            requestId,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        /*
         * Google's own reminder emails are off. Ours go out on WhatsApp on a
         * schedule the team controls and can edit in the CMS; leaving Google's
         * defaults on would mean two reminder systems disagreeing about a call,
         * and the one nobody can edit would be the louder of the two.
         */
        reminders: { useDefault: false, overrides: [] },
      }),
    },
  )) as CalendarEvent
}

/**
 * Withdraw a booking from the calendar.
 *
 * Cancelled rather than deleted, mirroring how `bookings` and `slots` treat the
 * same event: a deleted event vanishes from the calendar read entirely, which is
 * indistinguishable from one that scrolled out of the window — and the poller
 * would then have no way to tell "called off" from "not in range".
 *
 * `sendUpdates=all` here, unlike everywhere else in this file. The reason the
 * link is withheld at booking time does not apply to a cancellation: there is no
 * link to leak, and someone who has set aside an hour is owed the news by every
 * channel available, not only the one that depends on us having a phone number.
 */
export async function cancelBookingEvent(eventId: string): Promise<void> {
  await call(
    `/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    },
  )
}
