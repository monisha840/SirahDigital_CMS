import type { Endpoint, PayloadRequest } from 'payload'
import { MAX_GENERATE_DAYS, MAX_GENERATE_SLOTS } from '../collections/Slots'
import { normalise } from '../lib/whatsapp'
import {
  addDays,
  daysBetween,
  instantToZoned,
  isCivilDate,
  isCivilTime,
  minutesOfDay,
  timeOfMinutes,
  weekdayOf,
  zonedToInstant,
} from '../lib/zonedTime'

/**
 * The slots API — the four admin routes SlotCalendar talks to, plus the two
 * public ones /book uses.
 *
 * ── Why the error key is `message` and not `error` ───────────────────────
 * Every other endpoint in this codebase answers with `{ error }`. These answer
 * with `{ message }` because SlotCalendar's built-in fetch client reads
 * `body.message ?? body` — send it `{ error }` and the admin sees the entire
 * JSON blob rendered inside its error banner instead of the sentence written for
 * them. The contract belongs to the component; this file matches it rather than
 * making the component match the house style.
 *
 * ── Two audiences, two doors ─────────────────────────────────────────────
 *   /api/admin/*   staff only, session-cookie authenticated, full read/write.
 *   /api/public/*  the website. Open times and a booking door, nothing else.
 *
 * They are separate paths rather than one path with a branch because the shapes
 * genuinely differ: the admin needs to know who booked each slot, and the public
 * response must not carry that under any circumstances. A single handler with a
 * `if (user)` inside it is one edit away from leaking a customer list.
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const fail = (message: string, status = 400) => json({ message }, status)

/** Staff gate. Mirrors `canPublish` — admins and editors, nobody else. */
function staff(req: PayloadRequest): boolean {
  return Boolean(req.user && ['admin', 'editor'].includes((req.user as { role?: string }).role || ''))
}

/** Is this a zone the runtime's IANA database actually knows? */
function knownZone(value: unknown): value is string {
  if (typeof value !== 'string' || !value) return false
  try {
    new Intl.DateTimeFormat('en', { timeZone: value })
    return true
  } catch {
    return false
  }
}

const DEFAULT_ZONE = process.env.BOOKING_TIMEZONE || 'Asia/Kolkata'

type SlotDoc = {
  id: number | string
  localDate: string
  localTime: string
  startAt: string
  endAt: string
  durationMinutes: number
  timeZone: string
  status: 'open' | 'booked' | 'cancelled'
  bookedName?: string | null
  bookedAt?: string | null
  booking?: unknown
}

/**
 * A row, in the shape SlotCalendar's `Slot` interface declares.
 *
 * Snake_case on the wire, camelCase in the database. The component was ported
 * from an app whose API spoke snake_case and its type is written against that;
 * renaming the fields inside the component would mean re-doing that edit every
 * time it is re-ported, so the translation happens here, once, at the boundary.
 *
 * `duration_minutes` is typed `string` there but read through
 * `Math.round(Number(...))`, so a JSON number satisfies it and is the more
 * honest thing to put on the wire.
 */
function toWire(doc: SlotDoc) {
  const booking = doc.booking
  const bookingId =
    booking && typeof booking === 'object' ? (booking as { id?: unknown }).id : booking

  return {
    id: String(doc.id),
    starts_at: doc.startAt,
    ends_at: doc.endAt,
    status: doc.status,
    booked_name: doc.bookedName || null,
    booked_at: doc.bookedAt || null,
    submission_id: bookingId != null ? String(bookingId) : null,
    local_date: doc.localDate,
    local_time: doc.localTime,
    duration_minutes: doc.durationMinutes,
  }
}

/** The civil fields + the instant, derived together so they cannot disagree. */
function buildSlot(date: string, time: string, durationMinutes: number, timeZone: string) {
  const start = zonedToInstant(date, time, timeZone)
  const end = new Date(start.getTime() + durationMinutes * 60_000)

  /*
   * Re-derived from the instant rather than reusing the `date`/`time` arguments.
   * They are almost always identical — but "almost" is the point: a time inside
   * a spring-forward gap does not exist, `zonedToInstant` resolves it to the
   * instant the clock jumped to, and storing the requested wall-clock next to a
   * different actual instant would put a row in the database that says two
   * contradictory things. Whatever the instant really is, that is what is shown.
   */
  const local = instantToZoned(start, timeZone)

  return {
    localDate: local.localDate,
    localTime: local.localTime,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    durationMinutes,
    timeZone,
  }
}

/**
 * Instants already spoken for in a date range.
 *
 * Cancelled rows are deliberately absent: withdrawing 15:00 and then offering it
 * again is a normal thing to do, and treating the cancelled row as an occupant
 * would make that time permanently unofferable with no way to tell why.
 */
async function takenInstants(req: PayloadRequest, from: string, to: string): Promise<Set<number>> {
  const existing = await req.payload.find({
    collection: 'slots',
    where: {
      and: [
        { localDate: { greater_than_equal: from } },
        { localDate: { less_than_equal: to } },
        { status: { in: ['open', 'booked'] } },
      ],
    },
    /*
     * Deliberately far above MAX_GENERATE_SLOTS.
     *
     * This is not the ceiling on what may be created — it is the ceiling on what
     * is *read back to check against*, and the two are not the same number. A
     * 92-day range that has been generated over twice already holds well past
     * 600 rows, and a limit that truncated the read would silently drop known
     * instants out of the set, so the second generate would create duplicates
     * at times that already exist. Reading wide is cheap; a duplicated slot is
     * two people booked into one hour.
     */
    limit: 5000,
    depth: 0,
    overrideAccess: true,
    req,
  })

  return new Set(existing.docs.map((d) => Date.parse((d as unknown as SlotDoc).startAt)))
}

/* ════════════════════════════════════════════════════════════════════════
 * Admin
 * ════════════════════════════════════════════════════════════════════════ */

/** GET /api/admin/slots?from=YYYY-MM-DD&to=YYYY-MM-DD&timeZone=... */
export const listSlots: Endpoint = {
  path: '/admin/slots',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    if (!staff(req)) return fail('Not signed in.', 401)

    const from = req.searchParams?.get('from') || ''
    const to = req.searchParams?.get('to') || ''
    if (!isCivilDate(from) || !isCivilDate(to)) return fail('from and to must be YYYY-MM-DD dates.', 422)
    if (from > to) return fail('from is after to.', 422)

    try {
      /*
       * Filtered on `localDate`, not on `startAt`, exactly as the readme
       * specifies — "slots whose local_date falls in [from, to]". Those are not
       * the same query: a 00:30 slot in Asia/Kolkata is the previous day in UTC,
       * so a startAt range would pull it under the wrong month heading and the
       * first day of every month would be missing a row that the last day of the
       * previous one gained.
       */
      const res = await req.payload.find({
        collection: 'slots',
        where: {
          and: [
            { localDate: { greater_than_equal: from } },
            { localDate: { less_than_equal: to } },
            // Cancelled rows are withheld rather than shown greyed out: the
            // component's own Slot type has no third status, so anything else
            // would render as if it were open and be bookable-looking.
            { status: { in: ['open', 'booked'] } },
          ],
        },
        sort: 'startAt',
        limit: 1500,
        depth: 0,
        overrideAccess: true,
        req,
      })

      return json({ slots: res.docs.map((d) => toWire(d as unknown as SlotDoc)) })
    } catch (err) {
      req.payload.logger.error(`admin/slots list failed: ${(err as Error).message}`)
      return fail('Could not load slots.', 500)
    }
  },
}

/**
 * POST /api/admin/slots — add one or more times to a single day.
 *
 * Answers `{ created: [...], skipped: n }` with `created` as an ARRAY, because
 * the component counts it with `result.created?.length`. `/slots/generate` below
 * answers with `created` as a NUMBER, because there it reads `res.created`
 * directly. The asymmetry is inherited from the original API and is load-bearing
 * on both ends — returning the wrong one of the two reports "0 added" after a
 * successful write.
 */
export const createSlots: Endpoint = {
  path: '/admin/slots',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!staff(req)) return fail('Not signed in.', 401)

    let body: Record<string, unknown>
    try {
      body = (await req.json?.()) as Record<string, unknown>
    } catch {
      return fail('Malformed request.', 400)
    }

    const date = String(body.date || '')
    const times = Array.isArray(body.times) ? body.times.map(String) : []
    const durationMinutes = Number(body.durationMinutes)
    const timeZone = knownZone(body.timeZone) ? body.timeZone : DEFAULT_ZONE
    const actor = String(body.actor || 'console').slice(0, 200)

    if (!isCivilDate(date)) return fail('date must be a YYYY-MM-DD date.', 422)
    if (!times.length) return fail('No times given.', 422)
    if (times.length > 48) return fail('Too many times in one request.', 422)
    if (!times.every(isCivilTime)) return fail('Times must be HH:mm, 24-hour.', 422)
    if (!Number.isFinite(durationMinutes) || durationMinutes < 5 || durationMinutes > 480) {
      return fail('durationMinutes must be between 5 and 480.', 422)
    }

    try {
      const taken = await takenInstants(req, date, date)
      const created: unknown[] = []
      let skipped = 0

      for (const time of times) {
        const slot = buildSlot(date, time, durationMinutes, timeZone)
        const key = Date.parse(slot.startAt)

        // Both the stored rows and the times inside this one request, so a body
        // asking for 10:00 twice creates one slot rather than a duplicate pair.
        if (taken.has(key)) {
          skipped += 1
          continue
        }
        taken.add(key)

        const doc = await req.payload.create({
          collection: 'slots',
          data: { ...slot, status: 'open', actor },
          overrideAccess: true,
          context: { skipRevalidate: true },
          req,
        })
        created.push(toWire(doc as unknown as SlotDoc))
      }

      return json({ created, skipped })
    } catch (err) {
      req.payload.logger.error(`admin/slots create failed: ${(err as Error).message}`)
      return fail('Could not add those slots.', 500)
    }
  },
}

/**
 * DELETE /api/admin/slots/:id — withdraw one slot.
 *
 * Cancel, not delete, per the semantics the component's own comment describes.
 * A booked slot carries someone's expectation and a calendar event; deleting the
 * row would strand both. So the row is marked `cancelled`, and if a call was
 * arranged on it the booking and the Google event are called off too — in that
 * order, so that a failure to reach Google still leaves the database honest.
 */
export const cancelSlot: Endpoint = {
  path: '/admin/slots/:id',
  method: 'delete',
  handler: async (req: PayloadRequest) => {
    if (!staff(req)) return fail('Not signed in.', 401)

    const raw = (req.routeParams?.id ?? '') as string
    const id = Number(raw)
    if (!Number.isInteger(id) || id <= 0) return fail('Bad slot id.', 422)

    try {
      const slot = (await req.payload.findByID({
        collection: 'slots',
        id,
        depth: 0,
        overrideAccess: true,
        req,
      })) as unknown as SlotDoc

      if (slot.status === 'cancelled') return json({})

      await req.payload.update({
        collection: 'slots',
        id,
        data: { status: 'cancelled' },
        overrideAccess: true,
        context: { skipRevalidate: true },
        req,
      })

      if (slot.booking) {
        const bookingId = typeof slot.booking === 'object'
          ? (slot.booking as { id: number }).id
          : (slot.booking as number)

        const booking = (await req.payload.findByID({
          collection: 'bookings',
          id: bookingId,
          depth: 0,
          overrideAccess: true,
          req,
        })) as unknown as { calendarEventId?: string; status?: string }

        await req.payload.update({
          collection: 'bookings',
          id: bookingId,
          data: { status: 'cancelled' },
          overrideAccess: true,
          context: { skipRevalidate: true },
          req,
        })

        /*
         * Last, and allowed to fail. The two rows above are what every other
         * part of this system reads; an unreachable Google leaves one stale
         * event on a calendar a human is looking at anyway, whereas letting the
         * throw escape would have cancelled nothing at all and returned an error
         * to an admin who then tries again on an already-cancelled slot.
         */
        if (booking?.calendarEventId) {
          try {
            const { cancelBookingEvent } = await import('../lib/googleCalendar')
            await cancelBookingEvent(booking.calendarEventId)
          } catch (err) {
            req.payload.logger.error(
              `slot ${id} cancelled, but its calendar event was not: ${(err as Error).message}`,
            )
          }
        }
      }

      return json({})
    } catch (err) {
      req.payload.logger.error(`admin/slots cancel failed: ${(err as Error).message}`)
      return fail('Could not cancel that slot.', 500)
    }
  },
}

/**
 * POST /api/admin/slots/generate — bulk availability across a date range.
 *
 * ── Why every rule the component checks is checked again here ────────────
 * The readme is blunt about this and it is worth repeating: the preview in the
 * generator is a courtesy estimate, not a security boundary. It runs in a
 * browser, on numbers a browser supplied, and the only thing standing between a
 * hand-written POST and six hundred thousand rows is this handler. The ceilings
 * below are the same ones the original API enforced.
 */
export const generateSlots: Endpoint = {
  path: '/admin/slots/generate',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!staff(req)) return fail('Not signed in.', 401)

    let body: Record<string, unknown>
    try {
      body = (await req.json?.()) as Record<string, unknown>
    } catch {
      return fail('Malformed request.', 400)
    }

    const fromDate = String(body.fromDate || '')
    const toDate = String(body.toDate || '')
    const dayStart = String(body.dayStart || '')
    const dayEnd = String(body.dayEnd || '')
    const durationMinutes = Number(body.durationMinutes)
    const bufferMinutes = Number(body.bufferMinutes)
    const timeZone = knownZone(body.timeZone) ? body.timeZone : DEFAULT_ZONE
    const actor = String(body.actor || 'console').slice(0, 200)

    const weekdays = (Array.isArray(body.weekdays) ? body.weekdays : [])
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6)

    if (!isCivilDate(fromDate) || !isCivilDate(toDate)) {
      return fail('fromDate and toDate must be YYYY-MM-DD dates.', 422)
    }
    if (fromDate > toDate) return fail('fromDate is after toDate.', 422)
    if (!isCivilTime(dayStart) || !isCivilTime(dayEnd)) {
      return fail('dayStart and dayEnd must be HH:mm, 24-hour.', 422)
    }
    if (!weekdays.length) return fail('Select at least one day of the week.', 422)
    if (!Number.isFinite(durationMinutes) || durationMinutes < 5 || durationMinutes > 480) {
      return fail('durationMinutes must be between 5 and 480.', 422)
    }
    if (!Number.isFinite(bufferMinutes) || bufferMinutes < 0 || bufferMinutes > 240) {
      return fail('bufferMinutes must be between 0 and 240.', 422)
    }

    const span = daysBetween(fromDate, toDate)
    if (span > MAX_GENERATE_DAYS) {
      return fail(`That range is ${span} days. The most that can be generated at once is ${MAX_GENERATE_DAYS}.`, 422)
    }

    const open = minutesOfDay(dayStart)
    const close = minutesOfDay(dayEnd)
    if (close <= open) {
      return fail(
        `Day ends (${dayEnd}) is not after day starts (${dayStart}). These are 24-hour times, so 4pm is 16:00.`,
        422,
      )
    }
    if (close - open < durationMinutes) {
      return fail(
        `A ${durationMinutes}-minute meeting does not fit between ${dayStart} and ${dayEnd} — that window is ${close - open} minutes.`,
        422,
      )
    }

    /*
     * The whole candidate list is built before anything is written, so the
     * ceiling below rejects an over-large request outright rather than writing
     * six hundred rows and then stopping — which would leave a half-generated
     * range that looks like a successful run.
     *
     * Stepping matches the component's preview exactly (`m += duration + buffer`
     * while `m + duration <= close`). If one of the two ever changes, the count
     * shown before the click stops matching the count after it, and the first
     * symptom is a bug report about slots that "did not all get created".
     */
    const candidates: { date: string; time: string }[] = []
    for (let date = fromDate; date <= toDate; date = addDays(date, 1)) {
      if (!weekdays.includes(weekdayOf(date))) continue
      for (let m = open; m + durationMinutes <= close; m += durationMinutes + bufferMinutes) {
        candidates.push({ date, time: timeOfMinutes(m) })
      }
    }

    if (candidates.length > MAX_GENERATE_SLOTS) {
      return fail(
        `That would create ${candidates.length} slots. The most in one go is ${MAX_GENERATE_SLOTS} — narrow the date range or the hours.`,
        422,
      )
    }

    try {
      const taken = await takenInstants(req, fromDate, toDate)
      const now = Date.now()
      let created = 0
      let skipped = 0

      for (const c of candidates) {
        const slot = buildSlot(c.date, c.time, durationMinutes, timeZone)
        const key = Date.parse(slot.startAt)

        // A slot in the past cannot be booked, and generating a range that
        // starts today would otherwise fill the morning with dead rows that
        // clutter the admin calendar and every availability query behind it.
        if (taken.has(key) || key <= now) {
          skipped += 1
          continue
        }
        taken.add(key)

        await req.payload.create({
          collection: 'slots',
          data: { ...slot, status: 'open', actor },
          overrideAccess: true,
          context: { skipRevalidate: true },
          req,
        })
        created += 1
      }

      return json({ created, requested: candidates.length, skipped })
    } catch (err) {
      req.payload.logger.error(`admin/slots generate failed: ${(err as Error).message}`)
      return fail('Could not generate those slots.', 500)
    }
  },
}

/* ════════════════════════════════════════════════════════════════════════
 * Public
 * ════════════════════════════════════════════════════════════════════════ */

/**
 * GET /api/public/slots?days=30 — what the website may offer.
 *
 * Unauthenticated, and shaped so that being unauthenticated is uninteresting:
 * an id, a date, a time and a length. No name, no booking id, no cancelled row,
 * nothing about who took the ones that are gone. Booked slots are not returned
 * at all — a visitor has no use for them, and a list of when the founder is busy
 * is not information this endpoint needs to be handing out.
 */
export const publicSlots: Endpoint = {
  path: '/public/slots',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const days = Math.min(Math.max(Number(req.searchParams?.get('days')) || 45, 1), 120)

    try {
      /*
       * Bounded by instant, not by local date, and starting from now rather than
       * the start of today — a slot at 10:00 must stop being offered at 10:00,
       * not at midnight. The lead time keeps someone from booking a call that
       * begins in ninety seconds, which nobody on either end can make.
       */
      const leadMinutes = Number(process.env.BOOKING_MIN_LEAD_MINUTES || 90)
      const from = new Date(Date.now() + leadMinutes * 60_000).toISOString()
      const to = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

      const res = await req.payload.find({
        collection: 'slots',
        where: {
          and: [
            { status: { equals: 'open' } },
            { startAt: { greater_than: from } },
            { startAt: { less_than: to } },
          ],
        },
        sort: 'startAt',
        limit: 1500,
        depth: 0,
        overrideAccess: true,
        req,
      })

      const slots = res.docs.map((d) => {
        const doc = d as unknown as SlotDoc
        return {
          id: String(doc.id),
          local_date: doc.localDate,
          local_time: doc.localTime,
          starts_at: doc.startAt,
          duration_minutes: doc.durationMinutes,
          time_zone: doc.timeZone,
        }
      })

      return json({ slots, timeZone: DEFAULT_ZONE })
    } catch (err) {
      req.payload.logger.error(`public/slots failed: ${(err as Error).message}`)
      return fail('Could not load available times.', 500)
    }
  },
}

/**
 * POST /api/public/book — claim a slot and arrange the call.
 *
 * ── Why this needs the shared secret ─────────────────────────────────────
 * Same reasoning as `/api/lead-intake`, which it sits beside: the site is a
 * separate process, so there is no Local API to write through, and the door has
 * to be opened by something. The browser never sees this secret — the site's own
 * server route holds it and is the only caller. Without that, this is a public
 * endpoint that creates Google Calendar events, which is a spam cannon pointed
 * at the founder's calendar.
 *
 * ── The order of operations, and why it unwinds ──────────────────────────
 * Claim, then calendar, then booking row. Each step can fail and each failure
 * undoes the step before it, because the alternative to unwinding is a slot
 * marked booked with no call attached — a time nobody can book and nobody is
 * coming to, which is invisible until someone asks why Tuesday is empty.
 */
export const publicBook: Endpoint = {
  path: '/public/book',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const secret = process.env.LEAD_INTAKE_SECRET
    const auth = req.headers.get('authorization')
    if (!secret || auth !== `Bearer ${secret}`) return fail('Unauthorized.', 401)

    let body: Record<string, unknown>
    try {
      body = (await req.json?.()) as Record<string, unknown>
    } catch {
      return fail('Malformed request.', 400)
    }

    const slotId = Number(body.slotId)
    const name = String(body.name || '').trim().slice(0, 240)
    const email = String(body.email || '').trim().toLowerCase().slice(0, 200)
    const phone = String(body.phone || '').trim().slice(0, 40)

    if (!Number.isInteger(slotId) || slotId <= 0) return fail('Bad slot id.', 422)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('A valid email is required.', 422)

    const { payload } = req

    /*
     * ── The claim ────────────────────────────────────────────────────────
     * One conditional UPDATE. Postgres serialises concurrent writes to the same
     * row, so of two people who pressed Confirm in the same second exactly one
     * sees a row come back and the other sees none — and the loser is told the
     * time went, rather than both being told yes.
     *
     * Read-then-write would not do this. `find` followed by `update` leaves a gap
     * between checking that the slot is open and marking it taken, and that gap
     * is precisely as long as a round trip to the database.
     */
    let claimed
    try {
      const res = await payload.update({
        collection: 'slots',
        where: { and: [{ id: { equals: slotId } }, { status: { equals: 'open' } }] },
        data: { status: 'booked', bookedName: name || undefined, bookedAt: new Date().toISOString() },
        overrideAccess: true,
        context: { skipRevalidate: true },
        req,
      })
      claimed = (res.docs || [])[0] as unknown as SlotDoc | undefined
    } catch (err) {
      payload.logger.error(`public/book claim failed: ${(err as Error).message}`)
      return fail('Could not hold that time. Please try again.', 500)
    }

    if (!claimed) {
      // 409, not 422: nothing about the request was wrong, the world moved. The
      // site turns this into "that time was just taken" and re-fetches.
      return fail('That time has just been taken. Please choose another.', 409)
    }

    /** Put the slot back. Used on every failure below. */
    const release = async (why: string) => {
      try {
        await payload.update({
          collection: 'slots',
          id: claimed!.id as number,
          data: { status: 'open', bookedName: null, bookedAt: null, booking: null },
          overrideAccess: true,
          context: { skipRevalidate: true },
          req,
        })
      } catch (err) {
        // Worth shouting about: the slot is now stuck. Named explicitly so
        // whoever reads the log knows which row to fix by hand.
        payload.logger.error(
          `slot ${claimed!.id} is STUCK as booked — ${why}, and releasing it also failed: ${(err as Error).message}`,
        )
      }
    }

    // The phone number lives on the lead the site stored a moment ago. No lead
    // means no WhatsApp for this booking — handled by sending nothing, never by
    // guessing a number.
    type LeadRow = { id: number; firstName?: string | null; lastName?: string | null; phone?: string | null }
    let lead: LeadRow | null = null
    try {
      const found = await payload.find({
        collection: 'leads',
        where: { email: { equals: email } },
        sort: '-createdAt',
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
      lead = (found.docs[0] as unknown as LeadRow) || null
    } catch (err) {
      payload.logger.error(`public/book lead lookup failed: ${(err as Error).message}`)
    }

    const inviteeName = name || [lead?.firstName, lead?.lastName].filter(Boolean).join(' ') || ''

    // ── The calendar event ─────────────────────────────────────────────
    let event: { id: string; hangoutLink?: string } | null = null
    try {
      const { createBookingEvent, meetLinkOf, calendarReady } = await import('../lib/googleCalendar')
      if (!calendarReady) throw new Error('Google Calendar is not configured.')

      const created = await createBookingEvent({
        summary: `Sirah Digital consultation — ${inviteeName || email}`,
        description: [
          'Booked from sirahdigital.in/book.',
          inviteeName ? `Name: ${inviteeName}` : '',
          `Email: ${email}`,
          phone || lead?.phone ? `WhatsApp: ${phone || lead?.phone}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        startAt: claimed.startAt,
        endAt: claimed.endAt,
        timeZone: claimed.timeZone,
        attendeeEmail: email,
        attendeeName: inviteeName || undefined,
      })

      event = { id: created.id, hangoutLink: meetLinkOf(created) }
    } catch (err) {
      const message = (err as Error).message
      payload.logger.error(`public/book calendar create failed: ${message}`)
      await release('the calendar event could not be created')
      return fail('We could not confirm that time just now. Please try again in a moment.', 502)
    }

    // ── The booking row ────────────────────────────────────────────────
    try {
      const booking = await payload.create({
        collection: 'bookings',
        data: {
          calendarEventId: event.id,
          inviteeName,
          inviteeEmail: email,
          /*
           * Normalised on the way in, not just at send time.
           *
           * `sendWhatsAppText` normalises anyway, so delivery worked either way
           * — but storing what the visitor typed meant one row reading
           * "06381780846" and the next "6381780846" for the same person, and the
           * admin column is what anyone checks when a message did not arrive.
           * A stored number that does not match the one actually dialled is a
           * false lead in exactly the moment someone is debugging.
           */
          inviteePhone: normalise(phone || lead?.phone || '') || undefined,
          lead: lead?.id,
          startAt: claimed.startAt,
          endAt: claimed.endAt,
          timezone: claimed.timeZone,
          // Often already present: conferenceDataVersion=1 usually mints the
          // link inline. When Google reports `pending` instead, this stays empty
          // and the five-minute sync fills it in well before the hour-before
          // message needs it.
          meetLink: event.hangoutLink || undefined,
          status: 'confirmed',
          slot: Number(claimed.id),
        },
        overrideAccess: true,
        context: { skipRevalidate: true },
        req,
      })

      await payload.update({
        collection: 'slots',
        id: claimed.id as number,
        data: { booking: booking.id },
        overrideAccess: true,
        context: { skipRevalidate: true },
        req,
      })

      /*
       * ── The confirmation, now rather than in five minutes ──────────────
       *
       * This used to be left entirely to the scheduled job, on the reasoning
       * that one sender is better than two. The reasoning was sound and the
       * result was not: the job fires on a five-minute cron, so a booking made
       * at 18:05:56 was confirmed at 18:10:07. Measured, twice — 251 and 282
       * seconds. Someone presses Confirm, opens WhatsApp, finds nothing, and
       * concludes the booking failed. Several did.
       *
       * That delay was inherited from the TidyCal design, where the job was the
       * only thing that *could* send because it was also the only thing that
       * knew a booking existed. We create the booking here now, so the wait
       * bought nothing.
       *
       * It is still one sender: `notifyNewBooking` is the same code the job
       * runs, called earlier. The stamps make the two callers safe — whichever
       * gets there first, the other finds the work done.
       *
       * ── Why the failure is swallowed ───────────────────────────────────
       * The call is real, the calendar event exists, and the row is written. A
       * WhatsApp gateway that is down must not turn a successful booking into an
       * error page and a released slot. Logged, left unstamped, and the job
       * picks it up on its next pass — which is exactly the behaviour this
       * endpoint had before, now as a fallback rather than the only path.
       */
      try {
        const { notifyNewBooking } = await import('../lib/bookingNotify')
        const sent = await notifyNewBooking(payload, booking.id)
        if (sent.errors.length || sent.held.length) {
          payload.logger.warn(
            `booking ${booking.id} confirmation incomplete: ${[...sent.errors, ...sent.held].join(' | ')}`,
          )
        }
      } catch (err) {
        payload.logger.error(
          `booking ${booking.id} was created but its confirmation did not send: ${(err as Error).message}`,
        )
      }

      return json({ ok: true, bookingId: String(booking.id), startAt: claimed.startAt, timeZone: claimed.timeZone }, 201)
    } catch (err) {
      const message = (err as Error).message
      payload.logger.error(`public/book booking row failed: ${message}`)

      // Undo the calendar event too, or the founder is left with an event for a
      // call that this database has no record of and will never remind anyone about.
      try {
        const { cancelBookingEvent } = await import('../lib/googleCalendar')
        await cancelBookingEvent(event.id)
      } catch (cancelErr) {
        payload.logger.error(
          `orphaned calendar event ${event.id} could not be cancelled: ${(cancelErr as Error).message}`,
        )
      }

      await release('the booking row could not be written')
      return fail('We could not confirm that time just now. Please try again in a moment.', 500)
    }
  },
}

export const slotEndpoints = [
  listSlots,
  createSlots,
  generateSlots,
  cancelSlot,
  publicSlots,
  publicBook,
]
