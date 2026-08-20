/**
 * Gets the Google refresh token the booking pipeline needs.
 *
 *   npm run google:auth              print the token
 *   npm run google:auth -- --write   print it and write it into .env
 *
 * ── What this replaces ───────────────────────────────────────────────────
 * The manual version of this is: build a consent URL by hand with the right
 * scopes and `access_type=offline`, paste it into a browser, copy the `code` out
 * of the redirect before it expires, then POST it to the token endpoint with curl
 * to exchange it. Every step is a chance to get `prompt` or `access_type` wrong
 * and receive an access token with no refresh token — which appears to work and
 * then stops an hour later. This does all of it and asks you only to click Allow.
 *
 * ── What still has to be done by hand, and why ───────────────────────────
 * Creating the OAuth client in Google Cloud Console. That is an action inside
 * your Google account, and there is no API for "create me an OAuth client" —
 * bootstrapping one would itself need credentials. So:
 *
 *   1. console.cloud.google.com -> create or pick a project
 *   2. APIs & Services -> Library -> enable "Google Calendar API" and "Gmail API"
 *   3. APIs & Services -> OAuth consent screen -> External. Add yourself as a
 *      test user. IMPORTANT: while it is in "Testing", Google expires refresh
 *      tokens after 7 days — click "Publish app" to avoid a weekly outage.
 *   4. Credentials -> Create credentials -> OAuth client ID -> "Web application"
 *      Authorised redirect URI:  http://localhost:5599/callback
 *   5. Put the client ID and secret in .env, then run this.
 */
import 'dotenv/config'
import http from 'node:http'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { GOOGLE_SCOPES } from '../src/lib/googleAuth'

const PORT = 5599
const REDIRECT = `http://localhost:${PORT}/callback`

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const WRITE = process.argv.includes('--write')

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '\nGOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be in .env first.\n' +
      'See the header of this script for the five Console steps that produce them.\n',
  )
  process.exit(1)
}

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '),
    // Without offline there is no refresh token at all, and `consent` forces one
    // to be reissued even if this client was authorised before — otherwise a
    // second run returns nothing and looks broken.
    access_type: 'offline',
    prompt: 'consent',
  })

/** Swap the one-time code for tokens. The code expires in about a minute. */
async function exchange(code: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      redirect_uri: REDIRECT,
      grant_type: 'authorization_code',
    }),
  })
  const raw = await res.text()
  if (!res.ok) throw new Error(`Token exchange ${res.status}: ${raw}`)
  return JSON.parse(raw) as { refresh_token?: string; access_token?: string; scope?: string }
}

/**
 * Replace GOOGLE_REFRESH_TOKEN in .env, or append it if absent.
 *
 * Line-wise on purpose. A regex across the whole file, or a rewrite from parsed
 * key/values, would strip the comments that explain every other variable in
 * there — and .env is the most heavily commented file in this project.
 */
function writeEnv(token: string) {
  const path = resolve(process.cwd(), '.env')
  const lines = readFileSync(path, 'utf8').split(/\r?\n/)
  const i = lines.findIndex((l) => /^\s*GOOGLE_REFRESH_TOKEN\s*=/.test(l))
  if (i >= 0) lines[i] = `GOOGLE_REFRESH_TOKEN=${token}`
  else lines.push(`GOOGLE_REFRESH_TOKEN=${token}`)
  writeFileSync(path, lines.join('\n'), 'utf8')
  console.log(`\n✓ Written to ${path}`)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`)
  if (url.pathname !== '/callback') {
    res.writeHead(404).end('Not here.')
    return
  }

  const error = url.searchParams.get('error')
  const code = url.searchParams.get('code')

  if (error || !code) {
    res.writeHead(400, { 'Content-Type': 'text/html' }).end(`<p>Authorisation failed: ${error || 'no code'}</p>`)
    console.error(`\nAuthorisation failed: ${error || 'no code returned'}`)
    server.close()
    process.exit(1)
  }

  try {
    const tokens = await exchange(code)

    if (!tokens.refresh_token) {
      // Almost always a client that was already authorised without prompt=consent.
      res.writeHead(200, { 'Content-Type': 'text/html' }).end('<p>No refresh token returned. See the terminal.</p>')
      console.error(
        '\nGoogle returned no refresh_token.\n' +
          'Revoke this app at https://myaccount.google.com/permissions and run this again.\n',
      )
      server.close()
      process.exit(1)
    }

    // Checked rather than assumed: a grant missing gmail.send fails later, at the
    // first booking, in a job nobody is watching.
    const granted = (tokens.scope || '').split(' ')
    const missing = GOOGLE_SCOPES.filter((s) => !granted.includes(s))

    res
      .writeHead(200, { 'Content-Type': 'text/html' })
      .end('<p style="font:16px system-ui">Done — you can close this tab and return to the terminal.</p>')

    console.log('\n──────────────────────────────────────────────────────────')
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token)
    console.log('──────────────────────────────────────────────────────────')
    if (missing.length) {
      console.warn(`\n⚠ Scopes NOT granted: ${missing.join(', ')}`)
      console.warn('  Enable the matching API in the Console and run this again.')
    } else {
      console.log('\n✓ Both scopes granted (calendar + gmail.send).')
    }

    if (WRITE) writeEnv(tokens.refresh_token)
    else console.log('\nPaste that line into sirah-cms/.env (or re-run with --write).')

    server.close()
    process.exit(0)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/html' }).end('<p>Exchange failed. See the terminal.</p>')
    console.error(`\n${(err as Error).message}`)
    server.close()
    process.exit(1)
  }
})

server.listen(PORT, () => {
  console.log('\nOpen this URL, sign in as the calendar owner, and click Allow:\n')
  console.log(authUrl)
  console.log(`\nWaiting for the redirect on ${REDIRECT} …`)
})
