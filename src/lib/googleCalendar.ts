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
 * ── No attendees, either ─────────────────────────────────────────────────
 * The invitee used to be added as an attendee with the invitation suppressed.
 * That is now gone, and the reason is stronger than link timing: an attendee is
 * the one handle by which Google can mail somebody regardless of what this file
 * asks for. Drag the event an inch in the Calendar UI and every attendee is
 * notified — our `sendUpdates=none` has no say in it, because that edit is not
 * our request. The requirement is that the person who booked never receives
 * email from us, and an attendee list is a standing exception to it.
 *
 * The team loses nothing: `description` already carries the name, the email and
 * the WhatsApp number, which is what anyone opening the event actually reads.
 *
 * The cost is real and worth naming: the call appears on nobody's calendar but
 * ours, so WhatsApp is the only place the invitee holds the time and the link.
 * That is the trade that was chosen — three messages they will actually see,
 * against a calendar entry that arrives with an email nobody wanted.
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
  /*
   * Accepted and unused since the attendee list was removed. Kept so the two
   * call sites do not have to change shape, and because a display name is the
   * first thing wanted back if attendees ever return.
   */
  attendeeName?: string
}): Promise<CalendarEvent> {
  // requestId must be unique per conference. There is no event id yet — it is
  // being created — so the instant plus the invitee is the stable key, which
  // also means a retried create cannot spawn two conferences for one booking.
  //
  // attendeeEmail survives in the signature for exactly this, and for the
  // description the caller builds. It is no longer an attendee.
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
 * Move an existing booking to a new time.
 *
 * ── Patched, not recreated ───────────────────────────────────────────────
 * The obvious alternative is to cancel the event and create a fresh one at the
 * new time. That would work and it would cost the Meet link: a new event mints a
 * new conference, Google often reports it as `pending`, and the link arrives
 * some seconds later. The hour-before message is the delivery mechanism for that
 * link and is held back entirely when it is missing, so a reschedule made an
 * hour and ten minutes before the call could leave the invitee with no way in.
 *
 * Patching keeps the event id and the conference attached to it, which means the
 * link on the booking row stays valid and nothing downstream has to wait.
 *
 * sendUpdates=none, like everything else here. There are no attendees to notify
 * any more, so this is belt and braces rather than the load-bearing part — but
 * if attendees are ever restored, a reschedule is precisely the change Google
 * would email about, and it should still not.
 */
export async function moveBookingEvent(
  eventId: string,
  { startAt, endAt, timeZone }: { startAt: string; endAt: string; timeZone: string },
): Promise<CalendarEvent> {
  return (await call(
    `/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        start: { dateTime: startAt, timeZone },
        end: { dateTime: endAt, timeZone },
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
 * `sendUpdates=none`, like everywhere else in this file.
 *
 * This used to be `all`, on the reasoning that someone who has set aside an hour
 * is owed the news by every channel available. That is a fair argument and it
 * was overruled deliberately: the client is not to receive email from us at any
 * point, and a Google cancellation notice is email from us. WhatsApp carries the
 * news instead — the same channel that confirmed the booking and would have
 * delivered the link.
 *
 * The cost is named rather than hidden: if we hold no working phone number, a
 * cancelled call now reaches the invitee through no channel at all. Whoever
 * cancels is the one who has to tell them.
 */
export async function cancelBookingEvent(eventId: string): Promise<void> {
  await call(
    `/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    },
  )
}

/* ════════════════════════════════════════════════════════════════════════
 * Free/busy — what the calendar says is already spoken for
 * ════════════════════════════════════════════════════════════════════════ */

/**
 * Which calendars count as "the founder is not free".
 *
 * Defaults to the one bookings land on, which is the common case. It is a list
 * because "busy" and "where bookings go" are not the same question: build slots,
 * a shared team calendar or a personal one all make an hour unofferable without
 * being the calendar we write to. Comma-separated in
 * BOOKING_BUSY_CALENDAR_IDS — and note that a calendar the connected account
 * cannot see is an error below, not silently empty.
 */
const BUSY_CALENDAR_IDS = (process.env.BOOKING_BUSY_CALENDAR_IDS || CALENDAR_ID)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

/** A span the calendar is not free, as epoch milliseconds. */
export type BusyInterval = { start: number; end: number }

/*
 * freeBusy takes a window rather than a page cursor, and Google rejects very
 * long ones. 60 days is comfortably inside what it accepts and divides our
 * 45-day default into a single request, so the loop below is usually one pass.
 */
const FREEBUSY_CHUNK_DAYS = 60

/**
 * Merge overlapping spans so a slot can be tested against a short, sorted list.
 *
 * Two calendars holding the same meeting, or a build slot sitting inside a
 * longer block, would otherwise be two entries that each have to be checked.
 */
export function mergeIntervals(list: BusyInterval[]): BusyInterval[] {
  const sorted = [...list].sort((a, b) => a.start - b.start)
  const out: BusyInterval[] = []

  for (const iv of sorted) {
    const last = out[out.length - 1]
    if (last && iv.start <= last.end) last.end = Math.max(last.end, iv.end)
    else out.push({ ...iv })
  }

  return out
}

/**
 * Does [startMs, endMs) run into anything busy?
 *
 * Half-open on both sides, which is the whole of the back-to-back rule: a
 * 15:00–15:45 slot against a 15:45 meeting is not a clash, and offering it is
 * correct. Strict `<` and `>` are what say that — `<=` would quietly delete the
 * slot before every meeting.
 */
export function overlapsBusy(startMs: number, endMs: number, busy: BusyInterval[]): boolean {
  return busy.some((b) => startMs < b.end && endMs > b.start)
}

/**
 * Everything the calendar is already committed to, between two instants.
 *
 * ── Why freeBusy and not events.list ─────────────────────────────────────
 * events.list caps at 250 per page and this calendar runs to a dozen entries a
 * day, so a 45-day read would truncate — and a truncated read means the tail of
 * the window looks completely free. Silently offering a fortnight that is
 * already full is a worse failure than any amount of extra code. freeBusy
 * answers with merged blocks instead of events, so there is no page to fall off
 * the end of.
 *
 * It also gets two judgements right for free. An event marked "Free" (Google's
 * `transparent`) is not returned, so a placeholder or an FYI does not block
 * bookings. A declined invitation is not returned either.
 *
 * ── Errors are thrown, never swallowed ───────────────────────────────────
 * Google reports a calendar it could not read *inside* a 200 response, in
 * `calendars[id].errors` — a wrong id or a revoked share comes back as HTTP OK
 * with an empty busy array. Read casually, that is indistinguishable from a
 * clear diary, and the caller would offer every hour of it. So a per-calendar
 * error is raised as a failure of the whole query, and the caller decides what
 * an unverifiable calendar means. It must never mean "free".
 */
export async function busyIntervals({
  timeMin,
  timeMax,
}: {
  timeMin: string
  timeMax: string
}): Promise<BusyInterval[]> {
  const from = Date.parse(timeMin)
  const to = Date.parse(timeMax)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return []

  const chunk = FREEBUSY_CHUNK_DAYS * 24 * 60 * 60 * 1000
  const collected: BusyInterval[] = []

  for (let cursor = from; cursor < to; cursor += chunk) {
    const windowEnd = Math.min(cursor + chunk, to)

    const body = (await call('/freeBusy', {
      method: 'POST',
      body: JSON.stringify({
        timeMin: new Date(cursor).toISOString(),
        timeMax: new Date(windowEnd).toISOString(),
        items: BUSY_CALENDAR_IDS.map((id) => ({ id })),
      }),
    })) as {
      calendars?: Record<string, { busy?: { start: string; end: string }[]; errors?: { reason?: string }[] }>
    }

    for (const id of BUSY_CALENDAR_IDS) {
      const entry = body.calendars?.[id]

      // Absent is as bad as errored: we asked about this calendar and got no
      // answer, so we do not know that it is free.
      if (!entry) throw new Error(`freeBusy returned nothing for calendar ${id}`)
      if (entry.errors?.length) {
        const reasons = entry.errors.map((e) => e.reason || 'unknown').join(', ')
        throw new Error(`freeBusy could not read calendar ${id}: ${reasons}`)
      }

      for (const span of entry.busy || []) {
        const start = Date.parse(span.start)
        const end = Date.parse(span.end)
        if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
          collected.push({ start, end })
        }
      }
    }
  }

  return mergeIntervals(collected)
}
