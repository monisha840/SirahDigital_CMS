import { googleAccessToken, googleReady } from './googleAuth'

/**
 * The booking notification email.
 *
 * ── Why Gmail is the default, and Resend only a fallback ─────────────────
 * The original plan was Resend, which ARCHITECTURE.md names. It was demoted for a
 * practical reason: using it means creating an account, holding another API key,
 * and — the real cost — verifying a sending domain by adding DNS records to
 * sirahdigital.in. That is a chunk of setup, some of it at a registrar, for one
 * plain-text message a day.
 *
 * Gmail needs none of it. The booking pipeline already requires a Google OAuth
 * grant to read the calendar, so adding the `gmail.send` scope to that same grant
 * buys email with no second service, no second credential and no DNS at all. It
 * also sends from a real mailbox rather than a no-reply address, so the message
 * threads properly and a reply reaches a person.
 *
 * Resend is kept as a fallback for the case where booking mail should not come
 * from the calendar owner's mailbox — a shared inbox, a departure, a separate
 * sending identity. Set RESEND_API_KEY and it takes precedence.
 *
 * ── No nodemailer, no MIME library ───────────────────────────────────────
 * Gmail's API takes a base64url-encoded RFC 2822 message. For a plain-text email
 * with four headers that is a template string, so a MIME dependency would be
 * carrying a library to do string concatenation. UTF-8 subjects are the one part
 * that genuinely needs care, and they are handled explicitly below.
 */

const RESEND_KEY = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM

/** Either path works. Gmail needs no EMAIL_FROM — it sends as the authorised account. */
export const emailReady = Boolean(googleReady || (RESEND_KEY && FROM))

/** Which path is in use, for the job's own report. */
export const emailTransport = () => {
  if (RESEND_KEY && FROM) return 'resend'
  if (googleReady) return 'gmail'
  return 'none'
}

/**
 * RFC 2047 encoding for the Subject header.
 *
 * A raw non-ASCII subject is not legal in a header and arrives as mojibake — and
 * these subjects interpolate a person's name, so "Booking — Ananya Krishnan" is
 * exactly the ordinary case, not an edge one.
 */
const encodeHeader = (value: string) =>
  /^[\x20-\x7E]*$/.test(value)
    ? value
    : `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`

/** base64url — Gmail rejects standard base64's +, / and = padding. */
const base64url = (input: string) =>
  Buffer.from(input, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

async function sendViaGmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string
  subject: string
  text: string
  replyTo?: string
}) {
  const token = await googleAccessToken()

  const headers = [
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
    // `From` is deliberately omitted: Gmail stamps the authorised account, and a
    // From it has not verified is either rejected or silently rewritten.
  ]

  const raw = base64url(`${headers.join('\r\n')}\r\n\r\n${text}`)

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
    signal: AbortSignal.timeout(15_000),
  })

  const body = await res.text()
  if (!res.ok) {
    throw new Error(
      `Gmail send ${res.status}: ${body.slice(0, 250)}${
        body.includes('insufficient') || body.includes('ACCESS_TOKEN_SCOPE')
          ? ' — the refresh token lacks the gmail.send scope. Re-run `npm run google:auth` to re-consent with both scopes.'
          : ''
      }`,
    )
  }
  return JSON.parse(body || '{}')
}

async function sendViaResend({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string
  subject: string
  text: string
  replyTo?: string
}) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  })

  const body = await res.text()
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body.slice(0, 250)}`)
  try {
    return JSON.parse(body)
  } catch {
    return { raw: body }
  }
}

export async function sendEmail(args: { to: string; subject: string; text: string; replyTo?: string }) {
  if (!args.to) throw new Error('No email recipient.')

  const transport = emailTransport()
  if (transport === 'resend') return sendViaResend(args)
  if (transport === 'gmail') return sendViaGmail(args)

  throw new Error(
    'Email is not configured. Either complete the Google OAuth setup (`npm run google:auth`, which also covers the calendar) or set RESEND_API_KEY and EMAIL_FROM.',
  )
}
