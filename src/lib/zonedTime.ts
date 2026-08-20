/**
 * Wall-clock time in a named zone, converted correctly.
 *
 * ── Why this file exists rather than a `new Date()` here and there ───────
 * A slot is a *civil* fact: "10:30 on the 4th of March, in Asia/Kolkata". The
 * database stores an *absolute* fact: an instant in UTC. Converting between the
 * two is the single place this whole feature can go quietly wrong, so it is done
 * once, here, and nowhere else.
 *
 * The failure it prevents is the one the SlotCalendar readme warns about twice.
 * `new Date('2026-03-04')` parses as UTC midnight; ask the resulting object for
 * its date in a zone east of Greenwich and you get the 4th, ask west of it and
 * you get the 3rd. Every slot near the ends of a day lands on the wrong one, the
 * calendar renders them under the wrong heading, and the bug is invisible from
 * the machine that generated the data because that machine is usually in the
 * same zone as the calendar.
 *
 * ── Why Intl and not a date library ──────────────────────────────────────
 * `Intl.DateTimeFormat` carries the IANA database the runtime already ships,
 * which means DST transitions are correct without a dependency that needs its
 * own updates when a government moves the clocks. India has no DST, so none of
 * this matters today — it matters the first time a slot is generated for a
 * client in a zone that does, which is exactly when nobody will be looking.
 */

/**
 * How far the named zone is from UTC at a given instant, in milliseconds.
 *
 * Derived rather than looked up: format the instant into the zone's own wall
 * clock, then read those numbers back as if they were UTC. The difference
 * between that and the real instant *is* the offset. It costs one format call
 * and is correct across every DST rule Intl knows about.
 */
function offsetMsAt(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant)

  const at = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0')

  // `hour12: false` renders midnight as "24" on some ICU versions rather than
  // "00". Left unhandled it throws the offset out by a full day, once a day.
  const hour = at('hour') % 24

  const asIfUtc = Date.UTC(at('year'), at('month') - 1, at('day'), hour, at('minute'), at('second'))
  return asIfUtc - instant.getTime()
}

/**
 * "2026-03-04" + "10:30" in Asia/Kolkata → the exact instant that is.
 *
 * ── Why the offset is applied twice ──────────────────────────────────────
 * The offset depends on the instant, and the instant is what we are trying to
 * find — so the first pass uses the offset at roughly the right moment and the
 * second corrects it. The two differ only across a DST boundary, which is
 * precisely the case a single pass gets wrong: subtracting summer's offset from
 * a winter wall-clock time lands an hour out.
 *
 * Times that do not exist (the hour a spring-forward skips) resolve to the
 * instant the clock jumped to, and ambiguous times (the repeated autumn hour)
 * resolve to the first occurrence. Neither is reachable from a slot generator
 * that steps in whole minutes through a business day, but both are defined
 * rather than accidental.
 */
export function zonedToInstant(localDate: string, localTime: string, timeZone: string): Date {
  const [year, month, day] = localDate.split('-').map(Number)
  const [hour, minute] = localTime.split(':').map(Number)

  const naive = Date.UTC(year, month - 1, day, hour, minute, 0, 0)
  const firstPass = naive - offsetMsAt(new Date(naive), timeZone)
  const secondPass = naive - offsetMsAt(new Date(firstPass), timeZone)

  return new Date(secondPass)
}

/**
 * The reverse: an instant → the wall clock a person in that zone would read.
 *
 * This is what the readme means by "server-computed `local_date` / `local_time`".
 * Both are stored on the row so that listing slots for a month is a string
 * comparison against an indexed column, not a per-row timezone conversion — and
 * so that the browser is never handed the job of working out which day a slot
 * belongs to.
 */
export function instantToZoned(
  instant: Date,
  timeZone: string,
): { localDate: string; localTime: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(instant)

  const at = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const hour = String(Number(at('hour')) % 24).padStart(2, '0')

  return {
    localDate: `${at('year')}-${at('month')}-${at('day')}`,
    localTime: `${hour}:${at('minute')}`,
  }
}

/** `YYYY-MM-DD`, and a real date — rejects "2026-02-31" rather than rolling it. */
export function isCivilDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const probe = new Date(Date.UTC(y, m - 1, d))
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d
}

/** `HH:mm`, 24-hour. */
export function isCivilTime(value: unknown): value is string {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

/** Minutes since midnight, for comparing `dayEnd > dayStart` without dates. */
export function minutesOfDay(localTime: string): number {
  const [h, m] = localTime.split(':').map(Number)
  return h * 60 + m
}

/** Minutes since midnight → `HH:mm`. */
export function timeOfMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Step a civil date forward by whole days.
 *
 * Done in UTC on purpose. A civil date has no zone — the 5th follows the 4th
 * everywhere — so converting into a zone to add a day would only introduce the
 * chance of landing back on the same date across a DST boundary.
 */
export function addDays(localDate: string, days: number): string {
  const [y, m, d] = localDate.split('-').map(Number)
  const next = new Date(Date.UTC(y, m - 1, d + days))
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-${String(
    next.getUTCDate(),
  ).padStart(2, '0')}`
}

/** Day of week for a civil date, 0 = Sunday. Zone-independent, same reason. */
export function weekdayOf(localDate: string): number {
  const [y, m, d] = localDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** Whole days between two civil dates, inclusive of both ends. */
export function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split('-').map(Number)
  const [ty, tm, td] = to.split('-').map(Number)
  const ms = Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)
  return Math.floor(ms / 86_400_000) + 1
}
