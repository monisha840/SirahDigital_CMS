/**
 * One Google OAuth grant, shared by everything that needs it.
 *
 * Two features run off Google: the booking calendar — written when someone books
 * and read back by the reminder job — and the booking notification email sent to
 * the team. Both were going to refresh their
 * own access token, which meant two caches, two sets of the same error handling,
 * and two places to discover that a refresh token had been revoked. They share
 * this instead.
 *
 * ── Scopes ───────────────────────────────────────────────────────────────
 *   https://www.googleapis.com/auth/calendar     read bookings, create Meet links
 *   https://www.googleapis.com/auth/gmail.send   send the notification email
 *
 * The refresh token must have been granted BOTH. Adding a scope later does not
 * extend an existing token — it has to be re-consented, which is what
 * `npm run google:auth` is for.
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token'

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.send',
]

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN

export const googleReady = Boolean(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN)

/*
 * Access tokens last an hour; the sync runs every five minutes. Refreshing per
 * run would be a dozen pointless round trips an hour against a rate-limited
 * endpoint, so the token is cached in module scope — per process, which is the
 * right lifetime: it is not state worth persisting, and a cold start just fetches
 * another.
 *
 * The 60s margin covers a token that passes this check and expires mid-request.
 */
let cached: { token: string; expiresAt: number } | null = null

export async function googleAccessToken(): Promise<string> {
  if (!googleReady) throw new Error('Google is not configured (GOOGLE_CLIENT_ID / _SECRET / _REFRESH_TOKEN).')
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.token

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      refresh_token: REFRESH_TOKEN as string,
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(10_000),
  })

  const raw = await res.text()
  if (!res.ok) {
    /*
     * `invalid_grant` is by far the most common failure in this whole pipeline and
     * it has an unhelpful name, so it gets spelled out. The usual cause is an
     * OAuth consent screen left in "Testing", where Google expires refresh tokens
     * after seven days — the pipeline then works for a week and dies quietly.
     */
    throw new Error(
      `Google token refresh ${res.status}: ${raw.slice(0, 200)}${
        raw.includes('invalid_grant')
          ? ' — invalid_grant means the refresh token was revoked or expired. If the OAuth consent screen is still in "Testing", publish it, then re-run `npm run google:auth`.'
          : ''
      }`,
    )
  }

  const body = JSON.parse(raw) as { access_token: string; expires_in: number }
  cached = { token: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 }
  return cached.token
}
