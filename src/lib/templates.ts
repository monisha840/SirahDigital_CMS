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
}

const TOKEN = /\{\{\s*(\w+)\s*\}\}/g

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
}: {
  text: string
  requiresLink: boolean
  meetLink: string
}) {
  if (!text.trim()) return { ok: false, reason: 'Template rendered empty.' }
  if (requiresLink && !meetLink.trim()) {
    return { ok: false, reason: 'No meeting link on the booking yet — message held back.' }
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
  }
}
