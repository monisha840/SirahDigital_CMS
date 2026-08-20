/**
 * WhatsApp sending, CMS side.
 *
 * Deliberately a near-copy of the site's src/lib/whatsapp.js rather than a
 * shared package. The two apps deploy separately and have no build-time link, so
 * the alternatives were a published package or a symlink — both heavier than one
 * small file that changes about once a year. What must stay in step is the
 * gateway contract and `normalise`; the message bodies do not, because the site
 * formats contact-form replies in code while booking messages come from the CMS
 * templates an editor controls.
 *
 * Gateway contract, same as the site's:
 *   POST {BASE}/send/text   headers: { apikey }   body: { number, text }
 */

const BASE = (process.env.WHATSAPP_API_URL || '').replace(/\/$/, '')
const KEY = process.env.WHATSAPP_API_KEY
const INSTANCE = process.env.WHATSAPP_INSTANCE || 'default'
const DEFAULT_CC = (process.env.WHATSAPP_DEFAULT_CC || '91').replace(/[^\d]/g, '')

/** Can we message anyone at all? */
export const whatsappReady = Boolean(BASE && KEY)

/**
 * Digits only — gateways reject +, spaces and dashes. Handles a leading trunk
 * zero and a bare national number, because the numbers reaching here were typed
 * by hand into the booking form.
 */
export function normalise(input: unknown): string {
  let n = String(input || '').replace(/[^\d]/g, '')
  if (!n) return ''
  n = n.replace(/^0+/, '')
  if (n.length <= 10 && DEFAULT_CC) n = DEFAULT_CC + n
  return n
}

export async function sendWhatsAppText({ to, text }: { to: string; text: string }) {
  if (!whatsappReady) throw new Error('WhatsApp gateway is not configured.')
  const number = normalise(to)
  if (!number) throw new Error('No usable WhatsApp number.')

  const res = await fetch(`${BASE}/send/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: KEY as string },
    body: JSON.stringify({ number, text }),
    signal: AbortSignal.timeout(10_000),
  })

  const raw = await res.text()
  if (!res.ok) {
    throw new Error(`WhatsApp gateway ${res.status} on instance "${INSTANCE}": ${raw.slice(0, 200)}`)
  }
  try {
    return JSON.parse(raw)
  } catch {
    return { raw }
  }
}
