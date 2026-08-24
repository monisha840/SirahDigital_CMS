/**
 * {{token}} substitution for the booking messages.
 *
 * Small on purpose. This renders outbound copy an editor wrote in the admin, so
 * the interesting decisions are all about what happens when that copy and the
 * data disagree — not about template syntax.
 */

export type TemplateVars = {
  firstName: string
  fullName: string
  email: string
  phone: string
  date: string
  time: string
  dateTime: string
  meetLink: string
  /*
   * The three below come from the lead, not the booking.
   *
   * A booking row knows only what the calendar carries: a name, an email and a
   * time. Everything the person actually told us — what they want built, which
   * products they named, who they work for — was typed into the form and lives
   * on the lead. Without these the team email announces that someone booked a
   * call and says nothing about why, which is the half that decides how to
   * prepare for it.
   */
  company: string
  message: string
  interests: string
  /*
   * Where the invitee moves their own call. Empty when the booking may no
   * longer be moved — inside 24 hours of the start, or already moved twice —
   * and `isSendable`'s requiresRescheduleLink is what stops a message going out
   * with a dangling "Reschedule here:" once it is.
   */
  rescheduleLink: string
  /*
   * The time this call was at before the most recent move, for the team email.
   * Empty on a booking that has never moved, which is why the reschedule email
   * is a separate template rather than an optional line in the ordinary one —
   * see messageTemplates.ts.
   */
  previousDateTime: string
}

const TOKEN = /\{\{\s*(\w+)\s*\}\}/g

/*
 * ── The reschedule policy, and why it lives here ─────────────────────────
 * Two rules: not inside 12 hours of the call, and not more than twice.
 *
 * They are enforced in the endpoint, which is the only place that can enforce
 * anything — but they also have to be known here, because a link printed into a
 * message that the endpoint will then refuse is worse than no link at all. The
 * invitee taps it, is told no, and the message has cost us trust rather than
 * saved a phone call. One definition, read by both.
 *
 * ── Why 12 and not 24 ────────────────────────────────────────────────────
 * 24 was the intent and it is self-defeating. The reschedule offer lives in the
 * day-before message, and that message becomes due the moment the call is under
 * 24 hours away — which is the same moment a 24-hour cutoff expires the link.
 * The two conditions are exact complements: every day-before message would have
 * rendered with an empty {{rescheduleLink}} and been held back by isSendable,
 * so the reminder would have stopped sending altogether and the feature would
 * never once have appeared in front of a person.
 *
 * 12 leaves the link valid for the whole of the day-before window and still
 * refuses a move on the morning of the call. DAY_BEFORE_CLOSES is pinned to this
 * value for the same reason — see bookingNotify.ts.
 *
 * Measured from the *current* start time, so a booking that has already moved
 * still gets a working link on its new day-before message.
 */
export const RESCHEDULE_CUTOFF_MS = 12 * 60 * 60 * 1000
export const RESCHEDULE_MAX = 2

export function rescheduleAllowed(
  booking: { startAt: string | Date; rescheduleCount?: number | null; status?: string | null },
  now = Date.now(),
): { ok: boolean; reason: string } {
  if (booking.status && booking.status !== 'confirmed') {
    return { ok: false, reason: 'This booking is no longer active.' }
  }
  const startsIn = new Date(booking.startAt).getTime() - now
  if (startsIn <= 0) return { ok: false, reason: 'This call has already started.' }
  if (startsIn < RESCHEDULE_CUTOFF_MS) {
    return {
      ok: false,
      reason: 'This call is less than 12 hours away, so it can no longer be moved from here.',
    }
  }
  if ((booking.rescheduleCount || 0) >= RESCHEDULE_MAX) {
    return { ok: false, reason: `This call has already been moved ${RESCHEDULE_MAX} times.` }
  }
  return { ok: true, reason: '' }
}

/** The link itself. Empty whenever the policy above says no. */
export function rescheduleLinkFor(
  booking: {
    startAt: string | Date
    rescheduleToken?: string | null
    rescheduleCount?: number | null
    status?: string | null
  },
  siteUrl: string,
  now = Date.now(),
): string {
  if (!booking.rescheduleToken) return ''
  if (!rescheduleAllowed(booking, now).ok) return ''
  return `${siteUrl.replace(/\/$/, '')}/book?r=${encodeURIComponent(booking.rescheduleToken)}`
}

/**
 * Substitute known tokens; drop unknown ones.
 *
 * An unrecognised token is a typo in the admin ({{frstName}}), and there are
 * only two things to do with it: pass it through or remove it. Passing it
 * through delivers template source to a prospect's WhatsApp, which reads as
 * broken software and is far more damaging than the missing word. So it is
 * removed, and returned in `unknown` so the caller can log it loudly — the edit
 * still needs fixing, it just should not be fixed in front of the customer.
 */
export function render(template: string, vars: TemplateVars) {
  const unknown: string[] = []
  const text = String(template || '').replace(TOKEN, (_match, key: string) => {
    if (key in vars) return String(vars[key as keyof TemplateVars] ?? '')
    unknown.push(key)
    return ''
  })
  return { text, unknown }
}

/**
 * Format a booking's start time for a human, in the booking's own timezone.
 *
 * Intl rather than a date library: the CMS ships no formatter and one is not
 * worth adding for this. `timeZone` is passed explicitly on every call — the
 * server's own zone is an accident of where it is hosted, and a reminder that
 * says 4:30 pm to someone whose call is at 10:00 am IST is worse than no
 * reminder.
 */
export function formatWhen(startAt: string | Date, timeZone = 'Asia/Kolkata') {
  const d = startAt instanceof Date ? startAt : new Date(startAt)

  const date = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(d)

  /*
   * The zone label is appended by hand rather than via `timeZoneName`.
   *
   * Intl's 'short' renders Asia/Kolkata as "GMT+5:30", which is correct and
   * reads like a server log. Verified against a real booking, the message came
   * out as "1:30 pm GMT+5:30" — for an audience booking Indian business hours,
   * "1:30 pm IST" is what a person would actually write. Anything outside the
   * table falls back to Intl's own label, so a booking in another zone is
   * still unambiguous rather than silently unlabelled.
   */
  const clock = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(d)

  const FRIENDLY: Record<string, string> = { 'Asia/Kolkata': 'IST' }
  const label =
    FRIENDLY[timeZone] ||
    new Intl.DateTimeFormat('en-GB', { timeZone, timeZoneName: 'short' })
      .formatToParts(d)
      .find((p) => p.type === 'timeZoneName')?.value ||
    ''

  const time = label ? `${clock} ${label}` : clock

  return { date, time, dateTime: `${date} at ${time}` }
}

/**
 * Whether a rendered message is safe to send.
 *
 * One rule, and it is the reason this function exists rather than being inlined:
 * the hour-before message is the delivery mechanism for the joining link. If the
 * link is missing, sending it anyway produces "Join here:" followed by nothing —
 * a message that actively misleads someone into waiting for a call they cannot
 * reach. Holding it back leaves the team a visible failure to fix instead.
 */
export function isSendable({
  text,
  requiresLink,
  meetLink,
  requiresRescheduleLink,
  rescheduleLink,
}: {
  text: string
  requiresLink: boolean
  meetLink: string
  requiresRescheduleLink?: boolean
  rescheduleLink?: string
}) {
  if (!text.trim()) return { ok: false, reason: 'Template rendered empty.' }
  if (requiresLink && !meetLink.trim()) {
    return { ok: false, reason: 'No meeting link on the booking yet — message held back.' }
  }
  /*
   * Same argument as the line above, one step weaker in consequence and
   * identical in kind: the day-before body invites the reader to move the call,
   * so rendering it with an empty {{rescheduleLink}} produces "Reschedule here:"
   * followed by nothing. Held back rather than sent broken.
   *
   * This should be rare by construction — the link is only empty when the
   * booking is inside the 24-hour cutoff, and the day-before message fires
   * before that. It happens when a call is booked for tomorrow morning, where
   * the reminder and the cutoff overlap, which is exactly the case nobody
   * thinks to test.
   */
  if (requiresRescheduleLink && !(rescheduleLink || '').trim()) {
    return { ok: false, reason: 'Reschedule link is unavailable for this booking — message held back.' }
  }
  return { ok: true, reason: '' }
}

/**
 * Build the substitution set from a booking and the lead it was matched to.
 *
 * `lead` is optional because a booking can exist without one — somebody who
 * booked straight from the TidyCal link rather than through our form. In that
 * case the enquiry fields render empty rather than breaking, and the team email
 * still carries the name, time and joining link.
 */
export function varsFor(
  booking: {
    inviteeName?: string | null
    inviteeEmail?: string | null
    inviteePhone?: string | null
    startAt: string | Date
    timezone?: string | null
    meetLink?: string | null
    rescheduleToken?: string | null
    rescheduleCount?: number | null
    rescheduledFrom?: string | Date | null
    status?: string | null
  },
  lead?: {
    company?: string | null
    message?: string | null
    interests?: (string | null)[] | null
  } | null,
): TemplateVars {
  const fullName = (booking.inviteeName || '').trim()
  const { date, time, dateTime } = formatWhen(booking.startAt, booking.timezone || 'Asia/Kolkata')
  return {
    firstName: fullName.split(/\s+/)[0] || 'there',
    fullName: fullName || 'there',
    email: booking.inviteeEmail || '',
    phone: booking.inviteePhone || '',
    date,
    time,
    dateTime,
    meetLink: booking.meetLink || '',
    company: lead?.company || '',
    message: (lead?.message || '').trim(),
    interests: (lead?.interests || []).filter(Boolean).join(', '),
    /*
     * SITE_URL, not CMS_URL. In production the two are the same host and it
     * makes no difference; in dev they are 3000 and 3001, and a link to 3001
     * lands on the admin panel rather than the booking page.
     */
    rescheduleLink: rescheduleLinkFor(booking, process.env.SITE_URL || 'http://localhost:3000'),
    previousDateTime: booking.rescheduledFrom
      ? formatWhen(booking.rescheduledFrom, booking.timezone || 'Asia/Kolkata').dateTime
      : '',
  }
}
