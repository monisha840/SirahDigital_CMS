import type { Payload } from 'payload'
import { render, varsFor, isSendable, RESCHEDULE_CUTOFF_MS, type TemplateVars } from './templates'
import { sendWhatsAppText, whatsappReady } from './whatsapp'
import { sendEmail, emailReady } from './email'

/**
 * Sending the booking messages, and deciding when each is due.
 *
 * Three WhatsApp messages and one email, all driven off timestamps on the
 * booking row:
 *
 *   bookedSentAt      as soon as the booking is seen
 *   teamEmailSentAt   likewise, to support@sirahdigital.in
 *   dayBeforeSentAt   24 hours before the call
 *   hourBeforeSentAt  1 hour before — the only one carrying the joining link
 *
 * An empty stamp means "not yet", a value means "done". That is the whole
 * scheduling model, and it is what makes this safe to run on a one-minute cron:
 * the second run of a minute finds every stamp already set and does nothing.
 */

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

/**
 * How late a reminder may still be sent.
 *
 * A cron can be delayed — a deploy, a cold start, a machine asleep. The question
 * is whether a late message is better than none, and for these two the answers
 * differ:
 *
 * The day-before reminder is useful right up until the joining link goes out;
 * after that the hour-before message supersedes it, and sending both together
 * would be two notifications in one minute saying nearly the same thing.
 *
 * The hour-before message is useful until the call actually starts, because its
 * job is delivering the link. One minute late still helps someone; one minute
 * after the call has begun does not, and would read as an apology for being
 * missing rather than a reminder.
 */
/*
 * Exported because the reschedule endpoint has to suppress the day-before
 * message when a call is moved to within this window. Importing the constant
 * rather than writing 24 hours again is what keeps the two in step: widen the
 * reminder window and the suppression widens with it, instead of silently
 * leaving a gap where the message fires and says the wrong day.
 */
export const DAY_BEFORE_OPENS = 24 * HOUR
/*
 * Pinned to the reschedule cutoff, not to 90 minutes as it was.
 *
 * This message now carries the reschedule link, and isSendable holds the whole
 * message back when that link is unavailable — which it is, by definition, once
 * the call is inside the cutoff. Closing the window at the same moment means the
 * message can only ever become due while the link still works, so that guard is
 * belt-and-braces rather than something that fires in normal operation.
 *
 * It also fixes a smaller lie that predates rescheduling: at 90 minutes, a
 * booking made three hours in advance got a "your consultation is tomorrow"
 * reminder about a call happening the same afternoon. Now it gets the booking
 * confirmation and the hour-before message, which is the honest set.
 */
const DAY_BEFORE_CLOSES = RESCHEDULE_CUTOFF_MS
const HOUR_BEFORE_OPENS = 65 * MINUTE // a little early, so a delayed run still lands

type BookingRow = {
  id: number | string
  inviteeName?: string | null
  inviteeEmail?: string | null
  inviteePhone?: string | null
  startAt: string
  timezone?: string | null
  meetLink?: string | null
  status?: string | null
  rescheduleToken?: string | null
  rescheduleCount?: number | null
  rescheduledFrom?: string | null
  lead?: unknown
  notifications?: {
    bookedSentAt?: string | null
    teamEmailSentAt?: string | null
    dayBeforeSentAt?: string | null
    hourBeforeSentAt?: string | null
    lastError?: string | null
  } | null
}

type Templates = {
  bookedEnabled?: boolean | null
  bookedBody?: string | null
  dayBeforeEnabled?: boolean | null
  dayBeforeBody?: string | null
  hourBeforeEnabled?: boolean | null
  hourBeforeBody?: string | null
  teamEmailEnabled?: boolean | null
  teamEmailTo?: string | null
  teamEmailSubject?: string | null
  teamEmailBody?: string | null
  teamRescheduleSubject?: string | null
  teamRescheduleBody?: string | null
}

export type NotifyResult = {
  considered: number
  booked: number
  teamEmail: number
  dayBefore: number
  hourBefore: number
  held: string[]
  errors: string[]
}

/**
 * Stamp one notification timestamp without disturbing its siblings.
 *
 * ── Why the in-memory row is updated too ─────────────────────────────────
 * `notifications` is a group field, so Payload writes it whole — which means
 * every stamp has to resend the sibling timestamps or they are lost. Those
 * siblings come from `booking.notifications`, read once before the sends begin.
 *
 * That read is the trap. A booking triggers up to four messages in a single
 * pass, and the second stamp would spread the *stale* object captured before the
 * first stamp ran, silently erasing the timestamp just written. Caught in
 * testing: a real booking sent its confirmation and its team email, and came out
 * with `teamEmailSentAt` set and `bookedSentAt` still null — so the next run,
 * five minutes later, would have judged the confirmation unsent and sent it
 * again. And again, every five minutes, to a customer.
 *
 * Writing the merged object back onto the row keeps the in-memory copy in step
 * with the database, so the next stamp in the same pass builds on it.
 */
async function stamp(
  payload: Payload,
  booking: BookingRow,
  key: 'bookedSentAt' | 'teamEmailSentAt' | 'dayBeforeSentAt' | 'hourBeforeSentAt',
  error?: string,
) {
  const next = {
    ...(booking.notifications || {}),
    ...(error ? { lastError: error } : { [key]: new Date().toISOString(), lastError: null }),
  }

  await payload.update({
    collection: 'bookings',
    id: booking.id as number,
    data: { notifications: next },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })

  booking.notifications = next
}

/**
 * Render a template and send it on WhatsApp.
 *
 * Returns `held` rather than throwing when the message is not fit to send — a
 * missing joining link is an expected state a few minutes after booking, not an
 * error, and treating it as one would fill the log with noise that hides real
 * failures.
 */
async function sendWhatsApp({
  body,
  vars,
  phone,
  requiresLink,
  requiresRescheduleLink,
}: {
  body: string
  vars: TemplateVars
  phone: string
  requiresLink: boolean
  /*
   * Set by the day-before message only, and only when its body actually asks
   * for the link. Passing it unconditionally would hold back a day-before
   * message that an editor had deliberately rewritten without the reschedule
   * offer — the guard is there to stop a broken sentence, not to mandate a
   * sentence.
   */
  requiresRescheduleLink?: boolean
}): Promise<{ sent: boolean; held?: string }> {
  if (!whatsappReady) return { sent: false, held: 'WhatsApp gateway not configured.' }
  if (!phone) return { sent: false, held: 'No WhatsApp number on this booking (no matching lead).' }

  const { text, unknown } = render(body, vars)
  if (unknown.length) {
    // Surfaced, not silently dropped: the message still goes out with the bad
    // token removed, but somebody needs to fix the template.
    console.error(`[booking] unknown template placeholder(s): ${unknown.join(', ')}`)
  }

  const check = isSendable({
    text,
    requiresLink,
    meetLink: vars.meetLink,
    requiresRescheduleLink,
    rescheduleLink: vars.rescheduleLink,
  })
  if (!check.ok) return { sent: false, held: check.reason }

  await sendWhatsAppText({ to: phone, text })
  return { sent: true }
}

type Lead = {
  company?: string | null
  message?: string | null
  interests?: (string | null)[] | null
} | null

/**
 * The two messages that are due the instant a booking exists: the visitor's
 * WhatsApp confirmation, and the team email.
 *
 * ── Why this is a function and not two blocks in the loop below ──────────
 * Because it now has two callers. It used to have one — the five-minute job —
 * which was correct when a booking was *discovered* by polling a calendar
 * TidyCal wrote to: we genuinely did not know a booking existed until a poll
 * found it, so the poller was the only place that could send anything.
 *
 * That stopped being true when /book started creating the booking itself. The
 * row now exists the moment someone presses Confirm, and leaving the
 * confirmation to the next tick meant a measured 251 and 282 second wait — a
 * visitor pressing Confirm, checking WhatsApp, finding nothing, and reasonably
 * concluding it had failed. The booking endpoint calls this directly now; the
 * job below still calls it as the retry path for anything that did not get out.
 *
 * Both halves are guarded independently, and each stamps only on success — so
 * whichever of the two callers sends a message, the other finds the stamp set
 * and does nothing.
 */
async function sendImmediate(
  payload: Payload,
  booking: BookingRow,
  lead: Lead,
  templates: Templates,
  out: NotifyResult,
) {
  const n = booking.notifications || {}
  const vars = varsFor(booking, lead)
  const phone = booking.inviteePhone || ''

  // ── The visitor's confirmation ─────────────────────────────────────
  if (!n.bookedSentAt && templates.bookedEnabled !== false) {
    try {
      const r = await sendWhatsApp({
        body: templates.bookedBody || '',
        vars,
        phone,
        requiresLink: false,
      })
      if (r.sent) {
        await stamp(payload, booking, 'bookedSentAt')
        out.booked += 1
      } else if (r.held) {
        out.held.push(`booking ${booking.id} confirmation: ${r.held}`)
      }
    } catch (err) {
      const msg = `booking ${booking.id} confirmation: ${(err as Error).message}`
      out.errors.push(msg)
      await stamp(payload, booking, 'bookedSentAt', msg)
    }
  }

  // ── The team email ─────────────────────────────────────────────────
  if (!booking.notifications?.teamEmailSentAt && templates.teamEmailEnabled !== false) {
    try {
      if (!emailReady) {
        out.held.push(`booking ${booking.id} team email: email not configured.`)
      } else {
        /*
         * A moved call gets its own subject and body.
         *
         * The team needs the same enquiry details either way — what somebody
         * said on the form is exactly as relevant the second time — but the
         * subject has to say MOVED, because the alternative is two near-identical
         * "New consultation booked" emails for one person and whoever reads the
         * inbox deciding which one is true. `previousDateTime` carries the old
         * time so the change is legible without cross-referencing.
         *
         * Falls back to the booking pair when the reschedule fields are blank,
         * which is every global saved before those fields existed.
         */
        const moved = (booking.rescheduleCount || 0) > 0 && Boolean(booking.rescheduledFrom)
        const subjectTemplate =
          (moved ? templates.teamRescheduleSubject : templates.teamEmailSubject) ||
          templates.teamEmailSubject ||
          (moved ? 'Consultation moved' : 'New consultation booked')
        const bodyTemplate =
          (moved ? templates.teamRescheduleBody : templates.teamEmailBody) || templates.teamEmailBody || ''

        const subject = render(subjectTemplate, vars).text
        const body = render(bodyTemplate, vars).text
        await sendEmail({
          to: templates.teamEmailTo || 'support@sirahdigital.in',
          subject,
          text: body,
          // So replying in the team inbox reaches the person who booked.
          replyTo: booking.inviteeEmail || undefined,
        })
        await stamp(payload, booking, 'teamEmailSentAt')
        out.teamEmail += 1
      }
    } catch (err) {
      const msg = `booking ${booking.id} team email: ${(err as Error).message}`
      out.errors.push(msg)
      await stamp(payload, booking, 'teamEmailSentAt', msg)
    }
  }
}

const emptyResult = (): NotifyResult => ({
  considered: 0,
  booked: 0,
  teamEmail: 0,
  dayBefore: 0,
  hourBefore: 0,
  held: [],
  errors: [],
})

/**
 * Send one new booking's confirmation now, rather than up to five minutes later.
 *
 * Called by POST /api/public/book the moment the row is written. It must never
 * be allowed to fail the booking — the call is real whether or not WhatsApp is
 * reachable — so the caller swallows what this throws, and the five-minute job
 * picks up anything unstamped on its next pass.
 */
export async function notifyNewBooking(payload: Payload, bookingId: number | string): Promise<NotifyResult> {
  const out = emptyResult()

  const templates = (await payload.findGlobal({
    slug: 'message-templates',
    overrideAccess: true,
    depth: 0,
  })) as Templates

  // depth 1 populates `lead`, which the team email is written from — the
  // enquiry's message, company and named products.
  const doc = (await payload.findByID({
    collection: 'bookings',
    id: bookingId as number,
    depth: 1,
    overrideAccess: true,
  })) as unknown as BookingRow

  if (!doc) return out
  out.considered = 1

  const lead = (doc.lead && typeof doc.lead === 'object' ? doc.lead : null) as Lead
  await sendImmediate(payload, doc, lead, templates, out)
  return out
}

/**
 * Work through every booking that has an outstanding message.
 *
 * ── Concurrency ──────────────────────────────────────────────────────────
 * Stamps are written after a successful send, so two overlapping runs could in
 * principle both send the same message. That is accepted rather than solved with
 * a lock: the driver is a single cron, and the alternative — stamping first —
 * would silently swallow a genuine failure, which is the worse outcome for a
 * message someone is waiting on.
 *
 * Since the booking endpoint sends the first two messages itself, the common
 * case here is that both stamps are already set and this pass only considers the
 * two reminders. It remains the retry path for a booking whose inline send
 * failed, which is why the immediate messages are still checked at all.
 */
export async function runBookingNotifications(payload: Payload): Promise<NotifyResult> {
  const out: NotifyResult = {
    considered: 0,
    booked: 0,
    teamEmail: 0,
    dayBefore: 0,
    hourBefore: 0,
    held: [],
    errors: [],
  }

  const templates = (await payload.findGlobal({
    slug: 'message-templates',
    overrideAccess: true,
    depth: 0,
  })) as Templates

  /*
   * Only confirmed bookings that have not started. A cancelled call needs no
   * reminders, and a finished one needs nothing at all — leaving past bookings in
   * the query would mean re-examining every row forever as the table grows.
   */
  const now = Date.now()
  const due = await payload.find({
    collection: 'bookings',
    where: {
      and: [{ status: { equals: 'confirmed' } }, { startAt: { greater_than: new Date(now).toISOString() } }],
    },
    limit: 200,
    sort: 'startAt',
    // depth 1 populates `lead`, which is where the enquiry details live — the
    // message, the products named, the company. The team email is written from
    // those, so fetching them here saves a query per booking.
    depth: 1,
    overrideAccess: true,
  })

  out.considered = due.docs.length

  for (const raw of due.docs) {
    const booking = raw as unknown as BookingRow
    const n = booking.notifications || {}
    const startsIn = new Date(booking.startAt).getTime() - now
    // Populated by depth: 1 above. Still guarded — a booking made directly on the
    // TidyCal link, rather than through our form, has no lead at all.
    const lead = (booking.lead && typeof booking.lead === 'object' ? booking.lead : null) as Lead
    const vars = varsFor(booking, lead)
    const phone = booking.inviteePhone || ''

    /*
     * The confirmation and team email, for anything the booking endpoint did
     * not manage to send. Normally a no-op — both stamps are already set by the
     * time this runs — but it is what makes a WhatsApp outage at booking time
     * recoverable instead of permanent.
     */
    await sendImmediate(payload, booking, lead, templates, out)

    // ── 24 hours before ────────────────────────────────────────────────
    const dayBeforeDue = startsIn <= DAY_BEFORE_OPENS && startsIn > DAY_BEFORE_CLOSES
    if (dayBeforeDue && !n.dayBeforeSentAt && templates.dayBeforeEnabled !== false) {
      try {
        const r = await sendWhatsApp({
          body: templates.dayBeforeBody || '',
          vars,
          phone,
          requiresLink: false,
          /*
           * Only when the body actually asks for the link. An editor who
           * rewrites this message without the reschedule offer should still get
           * their message delivered — the guard exists to stop "Pick another
           * time here:" followed by nothing, not to require the sentence.
           */
          requiresRescheduleLink: (templates.dayBeforeBody || '').includes('{{rescheduleLink}}'),
        })
        if (r.sent) {
          await stamp(payload, booking, 'dayBeforeSentAt')
          out.dayBefore += 1
        } else if (r.held) {
          out.held.push(`booking ${booking.id} day-before: ${r.held}`)
        }
      } catch (err) {
        const msg = `booking ${booking.id} day-before: ${(err as Error).message}`
        out.errors.push(msg)
        await stamp(payload, booking, 'dayBeforeSentAt', msg)
      }
    }

    // ── 1 hour before, with the link ───────────────────────────────────
    const hourBeforeDue = startsIn <= HOUR_BEFORE_OPENS && startsIn > 0
    if (hourBeforeDue && !n.hourBeforeSentAt && templates.hourBeforeEnabled !== false) {
      try {
        const r = await sendWhatsApp({
          body: templates.hourBeforeBody || '',
          vars,
          phone,
          // The whole purpose of this message. Held back rather than sent
          // linkless — see isSendable().
          requiresLink: true,
        })
        if (r.sent) {
          await stamp(payload, booking, 'hourBeforeSentAt')
          out.hourBefore += 1
        } else if (r.held) {
          out.held.push(`booking ${booking.id} hour-before: ${r.held}`)
        }
      } catch (err) {
        const msg = `booking ${booking.id} hour-before: ${(err as Error).message}`
        out.errors.push(msg)
        await stamp(payload, booking, 'hourBeforeSentAt', msg)
      }
    }
  }

  return out
}
