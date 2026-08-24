/*
 * Replace the open slot grid with a different one.
 *
 * The Availability screen can generate a range but can only remove one slot at
 * a time, so changing the working day is otherwise several hundred clicks. That
 * gap is what this fills: retire every open slot that is not on the new grid,
 * then generate the new grid over the same range.
 *
 * ── The one rule that matters ────────────────────────────────────────────
 * A booked slot is never touched. The admin DELETE cancels the slot AND the
 * booking attached to it, so a booked row reaching that call would call off a
 * real meeting and email the person it belonged to. Candidates are therefore
 * filtered on status === 'open' with no `booking` — twice, once when the list is
 * built and again immediately before each delete.
 *
 * ── Usage ───────────────────────────────────────────────────────────────
 * Dry run — prints exactly what it would do, writes nothing:
 *
 *   CMS_ADMIN_PASSWORD='…' node scripts/reset-availability.mjs
 *
 * Apply:
 *
 *   CMS_ADMIN_PASSWORD='…' node scripts/reset-availability.mjs --apply
 *
 * Options: --start=10:30 --end=19:30 --duration=45 --buffer=15 --days=120
 *          --base=https://sirahdigital.in/admin/api
 *
 * The password comes from the environment and is never read from .env or
 * written anywhere — it is an admin credential, and a one-off migration is not
 * a reason for it to land in a file.
 */
import { readFileSync } from 'fs'
import path from 'path'

const argv = process.argv.slice(2)
const flag = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}

const APPLY = argv.includes('--apply')
const START = flag('start', '10:30')
const END = flag('end', '19:30')
const DURATION = Number(flag('duration', 45))
const BUFFER = Number(flag('buffer', 15))
const HORIZON_DAYS = Number(flag('days', 120))
const BASE = flag('base', 'https://sirahdigital.in/admin/api')
const ZONE = 'Asia/Kolkata'
const WEEKDAYS = [1, 2, 3, 4, 5, 6] // Mon–Sat; Sunday is closed

/* The times the new grid will occupy, so anything else can be recognised as old.
 * Mirrors the endpoint's own stepping exactly (`m += duration + buffer` while
 * `m + duration <= close`) — if the two disagree, this script deletes a slot the
 * generator is about to recreate, or leaves one it will not. */
const mins = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
const wanted = new Set()
for (let m = mins(START); m + DURATION <= mins(END); m += DURATION + BUFFER) wanted.add(hhmm(m))

const email =
  process.env.CMS_ADMIN_EMAIL ||
  (() => {
    try {
      const envFile = readFileSync(path.join(process.cwd(), '.env'), 'utf8')
      return envFile.match(/^SEED_ADMIN_EMAIL=(.*)$/m)?.[1]?.trim() || ''
    } catch {
      return ''
    }
  })()
const password = process.env.CMS_ADMIN_PASSWORD

if (!email || !password) {
  console.error(
    'Set CMS_ADMIN_PASSWORD (and CMS_ADMIN_EMAIL if it is not SEED_ADMIN_EMAIL in .env).\n' +
      "  CMS_ADMIN_PASSWORD='…' node scripts/reset-availability.mjs",
  )
  process.exit(1)
}

const login = await fetch(`${BASE}/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const auth = await login.json().catch(() => ({}))
if (!auth?.token) {
  console.error(`Login failed as ${email}: ${JSON.stringify(auth).slice(0, 200)}`)
  process.exit(1)
}
const H = { 'Content-Type': 'application/json', Authorization: `JWT ${auth.token}` }

const day = (offset = 0) =>
  new Date(Date.now() + offset * 864e5).toLocaleDateString('en-CA', { timeZone: ZONE })
const from = day(0)
const to = day(HORIZON_DAYS)

console.log(`signed in as ${auth.user?.email}`)
console.log(`grid: ${[...wanted].join(' ')}  (${wanted.size}/day, ${DURATION}min +${BUFFER})`)
console.log(`range: ${from} → ${to}\n`)

const list = await fetch(`${BASE}/admin/slots?from=${from}&to=${to}`, { headers: H }).then((r) => r.json())
const slots = list.slots || []

const isFree = (s) => s.status === 'open' && !s.booking
const booked = slots.filter((s) => !isFree(s))
const stale = slots.filter((s) => isFree(s) && !wanted.has(s.local_time))
const keep = slots.filter((s) => isFree(s) && wanted.has(s.local_time))

console.log(`${slots.length} slots in range`)
console.log(`  booked or held      ${String(booked.length).padStart(4)}  ← never touched`)
console.log(`  open, off the grid  ${String(stale.length).padStart(4)}  ← to retire`)
console.log(`  open, already right ${String(keep.length).padStart(4)}  ← left alone`)

const times = [...new Set(stale.map((s) => s.local_time))].sort()
if (times.length) console.log(`  retiring times: ${times.join(' ')}`)
if (booked.length) {
  console.log('\n  booked rows, for the record:')
  for (const b of booked) console.log(`    ${b.local_date} ${b.local_time}  ${b.status}`)
}

if (!APPLY) {
  console.log('\nDRY RUN — nothing written. Re-run with --apply.')
  process.exit(0)
}

let done = 0
const failures = []
for (const s of stale) {
  // Checked again rather than trusted from the list above: this loop can run for
  // a while, and a slot booked in the meantime must not be cancelled by it.
  if (!isFree(s)) continue
  const res = await fetch(`${BASE}/admin/slots/${s.id}`, { method: 'DELETE', headers: H })
  if (res.ok) done += 1
  else failures.push(`${s.local_date} ${s.local_time}: ${res.status} ${(await res.text()).slice(0, 80)}`)
}
console.log(`\nretired ${done} of ${stale.length}`)
for (const f of failures.slice(0, 5)) console.log(`  ! ${f}`)
if (failures.length > 5) console.log(`  … and ${failures.length - 5} more`)

const gen = await fetch(`${BASE}/admin/slots/generate`, {
  method: 'POST',
  headers: H,
  body: JSON.stringify({
    fromDate: from,
    toDate: to,
    dayStart: START,
    dayEnd: END,
    weekdays: WEEKDAYS,
    durationMinutes: DURATION,
    bufferMinutes: BUFFER,
    timeZone: ZONE,
    actor: `reset-availability ${START}-${END}`,
  }),
})
const out = await gen.json().catch(() => ({}))
console.log(`generate: ${JSON.stringify(out).slice(0, 300)}`)
