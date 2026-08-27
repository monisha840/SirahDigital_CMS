/**
 * What does the booking pipeline actually see on Google Calendar?
 *
 *   npm run calendar:check                     identity, calendars, next 7 days
 *   npm run calendar:check -- --days 14        a wider window
 *   npm run calendar:check -- --date 2026-08-29  one day, slot by slot
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * Availability is decided by three things that are configured separately and
 * fail quietly when they disagree: which Google account the refresh token
 * belongs to, which calendars BOOKING_BUSY_CALENDAR_IDS names, and which slots
 * the admin has generated. Every mismatch between them looks the same from the
 * outside — a website offering an hour that is already gone — and none of them
 * announces itself in a log.
 *
 * The one this is most worth running for: the token can be for a different
 * Google account than the person whose diary matters. `primary` then resolves to
 * an empty calendar, free/busy comes back clean, and the site cheerfully offers
 * every hour of a week that is fully booked. That is invisible until someone is
 * double-booked, and obvious in the first line of output here.
 */

import 'dotenv/config'
import { googleAccessToken, googleReady } from '../src/lib/googleAuth'
import { busyIntervals, CALENDAR_ID } from '../src/lib/googleCalendar'

const ZONE = process.env.BOOKING_TIMEZONE || 'Asia/Kolkata'
const LEAD_MINUTES = Number(process.env.BOOKING_MIN_LEAD_MINUTES || 90)

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

const clock = (ms: number) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(ms))

const stamp = (ms: number) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE, weekday: 'short', day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(ms))

const ymd = (ms: number) => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date(ms))

async function api(path: string) {
  const token = await googleAccessToken()
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(15_000),
  })
  const raw = await res.text()
  if (!res.ok) throw new Error(`${res.status} on ${path}: ${raw.slice(0, 300)}`)
  return raw ? JSON.parse(raw) : {}
}

async function main() {
  if (!googleReady) {
    console.error('Google is not configured — GOOGLE_CLIENT_ID / _SECRET / _REFRESH_TOKEN missing.')
    process.exit(1)
  }

  /* ── 1. Whose calendar is this token for? ─────────────────────────────── */
  const primary = (await api('/calendars/primary')) as { id?: string; summary?: string }
  console.log('\n━━ CONNECTED ACCOUNT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  the refresh token belongs to : ${primary.id}`)
  console.log(`  GOOGLE_CALENDAR_ID           : ${CALENDAR_ID}`)
  console.log(`  timezone                     : ${ZONE}`)
  console.log(`  minimum lead time            : ${LEAD_MINUTES} min`)

  /* ── 2. Every calendar that account can see ───────────────────────────── */
  const list = (await api('/users/me/calendarList?minAccessRole=reader&maxResults=250')) as {
    items?: { id: string; summary?: string; primary?: boolean; accessRole?: string; selected?: boolean }[]
  }

  const busyIds = (process.env.BOOKING_BUSY_CALENDAR_IDS || CALENDAR_ID)
    .split(',').map((s) => s.trim()).filter(Boolean)

  // `primary` is an alias, so a calendar can be counted via its own address too.
  const counted = (id: string, isPrimary?: boolean) =>
    busyIds.includes(id) || (isPrimary === true && busyIds.includes('primary'))

  console.log('\n━━ CALENDARS VISIBLE TO IT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  (✓ = its events block bookings, ✗ = its events are ignored)\n')
  for (const c of list.items || []) {
    const mark = counted(c.id, c.primary) ? '✓' : '✗'
    console.log(`  ${mark}  ${c.summary || '(no name)'}`)
    console.log(`      ${c.id}${c.primary ? '   [primary]' : ''}  ${c.accessRole}`)
  }

  const ignored = (list.items || []).filter((c) => !counted(c.id, c.primary))
  if (ignored.length) {
    console.log(`\n  ⚠  ${ignored.length} calendar(s) marked ✗ do NOT block bookings.`)
    console.log('     If any of them holds real commitments, add it to')
    console.log('     BOOKING_BUSY_CALENDAR_IDS (comma-separated) or the site will')
    console.log('     offer those hours as free.')
  }

  /* ── 3. What is busy ──────────────────────────────────────────────────── */
  const oneDay = arg('date')
  const days = Number(arg('days') || (oneDay ? 1 : 7))

  const from = oneDay ? Date.parse(`${oneDay}T00:00:00${offsetFor(oneDay)}`) : Date.now()
  const to = from + days * 86400000

  const busy = await busyIntervals({
    timeMin: new Date(from).toISOString(),
    timeMax: new Date(to).toISOString(),
  })

  console.log(`\n━━ BUSY, per free/busy on ${busyIds.join(', ')} ━━━━━━━━━━━━━━━━`)
  if (!busy.length) {
    console.log('  nothing busy in this window.')
    console.log('  ⚠  If that looks wrong, the token is probably for the wrong account.')
  }
  for (const b of busy) console.log(`  ${stamp(b.start)}  ->  ${clock(b.end)}`)

  /* ── 4. Slot-by-slot, for one day ─────────────────────────────────────── */
  if (oneDay) {
    console.log(`\n━━ WHAT /book WOULD OFFER ON ${oneDay} ━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log('  (the usual 10:00-19:00 hourly, 45-minute grid)\n')

    const earliest = Date.now() + LEAD_MINUTES * 60_000
    for (let h = 10; h <= 19; h++) {
      const start = Date.parse(`${oneDay}T${String(h).padStart(2, '0')}:00:00${offsetFor(oneDay)}`)
      const end = start + 45 * 60_000
      const clash = busy.find((b) => start < b.end && end > b.start)

      let verdict: string
      if (start < earliest) verdict = 'hidden  — inside the lead time'
      else if (clash) verdict = `BLOCKED — clashes with ${clock(clash.start)}-${clock(clash.end)}`
      else verdict = 'free'

      console.log(`  ${clock(start)}-${clock(end)}   ${verdict}`)
    }
  }

  console.log('')
}

/**
 * The zone's UTC offset on a given date, as "+05:30".
 *
 * Derived per date rather than hard-coded: India does not observe DST so the
 * constant would be correct today, and silently wrong the moment this is
 * pointed at a zone that does.
 */
function offsetFor(date: string): string {
  const noon = new Date(`${date}T12:00:00Z`)
  const tz = new Intl.DateTimeFormat('en', { timeZone: ZONE, timeZoneName: 'longOffset' })
    .formatToParts(noon).find((p) => p.type === 'timeZoneName')?.value || 'GMT+00:00'
  const m = tz.match(/GMT([+-]\d{2}:\d{2})/)
  return m ? m[1]! : '+00:00'
}

main().catch((err) => {
  console.error('\nFAILED:', err.message)
  process.exit(1)
})
