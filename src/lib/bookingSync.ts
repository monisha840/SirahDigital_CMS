import type { Payload } from 'payload'
import {
  listUpcomingEvents,
  ensureMeetLink,
  meetLinkOf,
  calendarReady,
  type CalendarEvent,
} from './googleCalendar'
import { normalise } from './whatsapp'

/**
 * Keeping `bookings` in step with the calendar.
 *
 * ── What this file used to be, and why it is not that any more ───────────
 * It used to be the *source* of bookings. TidyCal wrote events to a calendar we
 * could read but not query, so this file read every event in a 45-day window and
 * tried to work out which ones were bookings — matching "tidycal" in the body,
 * falling back to a configurable regex over the title, then hunting the attendee
 * list for someone who was neither the host nor a Meet room. Its own header
 * admitted the central assumption was unverified.
 *
 * None of that is needed now. /book claims a slot and creates the calendar event
 * itself, so a booking row exists before the event does and carries the id we
 * were given for it. There is nothing left to recognise.
 *
 * ── So what is left ──────────────────────────────────────────────────────
 * Only what genuinely originates on the Google side, where nothing tells us:
 *
 *   1. The host cancelled or moved the call in their own calendar. A person
 *      dragging an event in Google Calendar is a real thing that happens, and it
 *      is the only edit path we cannot intercept.
 *   2. The Meet link arrived late. `conferenceDataVersion=1` usually mints it
 *      inline, but Google may answer `pending` and attach it a moment later.
 *   3. A phone number turned up after the fact — someone who booked, then filled
 *      in the contact form.
 *
 * ── The direction of the loop is the whole design ────────────────────────
 * It iterates OUR rows and looks each one up in the calendar, rather than
 * iterating the calendar and asking what each event is. That inversion is what
 * removes the false-positive risk the old version carried: an event we did not
 * create is not examined, cannot be parsed, and can never become a WhatsApp
 * message to a stranger about a call that does not exist. The host's own
 * meetings are simply invisible here.
 */

export type SyncResult = {
  scanned: number
  created: number
  updated: number
  cancelled: number
  rescheduled: number
  skipped: number
  errors: string[]
}

/**
 * Find the enquiry this booking belongs to, for the phone number.
 *
 * Matched on email, most recent first. No match means no WhatsApp for this
 * booking — handled by skipping the messages, never by guessing a number.
 */
async function matchLead(payload: Payload, email: string) {
  const res = await payload.find({
    collection: 'leads',
    where: { email: { equals: email } },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return res.docs[0] || null
}

type BookingRow = {
  id: number | string
  calendarEventId: string
  inviteeEmail?: string | null
  inviteeName?: string | null
  inviteePhone?: string | null
  startAt: string
  endAt?: string | null
  meetLink?: string | null
  status?: string | null
  slot?: unknown
  notifications?: Record<string, unknown> | null
}

/** Release the slot behind a call that is no longer happening. */
async function reopenSlot(payload: Payload, booking: BookingRow, errors: string[]) {
  if (!booking.slot) return
  const slotId = typeof booking.slot === 'object' ? (booking.slot as { id: number }).id : (booking.slot as number)

  try {
    /*
     * Cancelled, not reopened. The host called this off in their own calendar,
     * which is a statement about that hour of their day — handing the same time
     * straight back to the next visitor would re-book them into a slot they had
     * just cleared. Offering it again is a deliberate act, done from the
     * availability screen.
     */
    await payload.update({
      collection: 'slots',
      id: slotId,
      data: { status: 'cancelled' },
      overrideAccess: true,
      context: { skipRevalidate: true },
    })
  } catch (err) {
    errors.push(`slot ${slotId} for booking ${booking.id}: ${(err as Error).message}`)
  }
}

/**
 * Reconcile every upcoming booking against the calendar.
 *
 * Safe to run as often as you like: it writes only when a row and its event
 * actually disagree, so a second run over unchanged data does nothing.
 */
export async function syncBookings(payload: Payload): Promise<SyncResult> {
  const result: SyncResult = {
    scanned: 0,
    created: 0,
    updated: 0,
    cancelled: 0,
    rescheduled: 0,
    skipped: 0,
    errors: [],
  }

  if (!calendarReady) {
    result.errors.push('Google Calendar is not configured.')
    return result
  }

  /*
   * One calendar read for the whole pass, indexed by id.
   *
   * The alternative — a GET per booking — is the same information at one request
   * per row against a quota-limited API, and this job runs 288 times a day.
   */
  let events: Map<string, CalendarEvent>
  try {
    const list = await listUpcomingEvents()
    events = new Map(list.map((e) => [e.id, e]))
  } catch (err) {
    result.errors.push(`calendar read: ${(err as Error).message}`)
    return result
  }

  /*
   * Bookings from an hour ago onwards. The past is excluded because nothing can
   * be done about it and re-examining every historical row would make this job
   * slower every week; the hour of slack means a call that has just started is
   * still reconciled if the host cancels it at the last minute.
   */
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const rows = await payload.find({
    collection: 'bookings',
    where: { startAt: { greater_than: since } },
    sort: 'startAt',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  result.scanned = rows.docs.length

  for (const raw of rows.docs) {
    const booking = raw as unknown as BookingRow

    try {
      const event = events.get(booking.calendarEventId)

      /*
       * Not in the window is not the same as gone.
       *
       * The read covers 45 days; a booking further out than that is absent for
       * an entirely innocent reason. Treating absence as deletion would cancel
       * every call made more than six weeks ahead, and send the invitee nothing
       * to say so — a silent failure that only shows up as an empty diary.
       */
      if (!event) {
        result.skipped += 1
        continue
      }

      if (event.status === 'cancelled') {
        if (booking.status !== 'cancelled') {
          await payload.update({
            collection: 'bookings',
            id: booking.id as number,
            data: { status: 'cancelled' },
            overrideAccess: true,
            context: { skipRevalidate: true },
          })
          await reopenSlot(payload, booking, result.errors)
          result.cancelled += 1
        } else {
          result.skipped += 1
        }
        continue
      }

      // A cancelled booking whose event is live again — the host un-deleted it.
      // Rare, but the row would otherwise stay cancelled and silently send nothing.
      const data: Record<string, unknown> = {}
      if (booking.status === 'cancelled') data.status = 'confirmed'

      const eventStart = event.start?.dateTime
      if (eventStart) {
        const moved = new Date(eventStart).getTime() !== new Date(booking.startAt).getTime()
        if (moved) {
          data.startAt = new Date(eventStart).toISOString()
          if (event.end?.dateTime) data.endAt = new Date(event.end.dateTime).toISOString()

          /*
           * Reminders already sent were about the old time, so their stamps have
           * to be cleared or nobody is ever reminded about the new one — the row
           * would look fully notified while being entirely wrong. `bookedSentAt`
           * is left alone: they know they have a booking, and re-confirming it
           * is noise.
           */
          data.notifications = {
            ...(booking.notifications || {}),
            dayBeforeSentAt: null,
            hourBeforeSentAt: null,
          }
          result.rescheduled += 1
        }
      }

      // The link Google promised but had not finished making at booking time.
      if (!booking.meetLink) {
        let link = meetLinkOf(event)
        if (!link) {
          try {
            link = await ensureMeetLink(event)
          } catch (err) {
            // Not fatal: the booking is real and worth keeping. Only the
            // hour-before message depends on the link, and it holds itself back.
            result.errors.push(`meet link for ${event.id}: ${(err as Error).message}`)
          }
        }
        if (link) data.meetLink = link
      }

      // A number that arrived after the booking — someone who booked first and
      // submitted the contact form afterwards.
      if (!booking.inviteePhone && booking.inviteeEmail) {
        const lead = await matchLead(payload, booking.inviteeEmail)
        if (lead?.phone) {
          data.inviteePhone = normalise(lead.phone)
          data.lead = lead.id
        }
      }

      if (Object.keys(data).length === 0) {
        result.skipped += 1
        continue
      }

      await payload.update({
        collection: 'bookings',
        id: booking.id as number,
        data,
        overrideAccess: true,
        context: { skipRevalidate: true },
      })
      result.updated += 1
    } catch (err) {
      result.errors.push(`booking ${booking.id}: ${(err as Error).message}`)
    }
  }

  return result
}
