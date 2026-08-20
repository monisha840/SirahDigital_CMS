import type { TaskConfig } from 'payload'

/**
 * The booking sync, as a scheduled Payload task.
 *
 * ── Why this exists alongside the HTTP endpoint ──────────────────────────
 * `POST /api/jobs/sync-bookings` does the same work and is still there — it is
 * how you run the pipeline on demand while testing, and it is the escape hatch
 * for a platform where in-process scheduling is the wrong choice. But requiring
 * an external cron to make the *normal* case work means the whole feature depends
 * on a piece of infrastructure that does not exist yet and that someone has to
 * remember to create. Payload already runs a scheduler every minute for scheduled
 * publishing; this hangs off it, so a fresh deploy sends reminders with no cron,
 * no platform scheduler and nothing to forget.
 *
 * ── Why every 5 minutes ──────────────────────────────────────────────────
 * The tightest deadline is the hour-before message, whose send window is 65
 * minutes wide, so five minutes is comfortable. Every minute would work and
 * mostly burn Google API quota re-reading an unchanged calendar.
 *
 * ── Duplicate protection ─────────────────────────────────────────────────
 * Payload's default `beforeSchedule` will not queue this task if one is already
 * running, already queued, or waiting on a retry. That matters more than it looks:
 * a slow calendar read could otherwise overlap the next tick, and two concurrent
 * runs could each decide the same reminder was unsent and send it twice. The
 * per-booking timestamps guard against that too, so this is the second of two
 * independent protections rather than the only one.
 */
export const syncBookingsTask: TaskConfig<'syncBookings'> = {
  slug: 'syncBookings',
  label: 'Sync bookings and send reminders',

  // No input: the task reads the calendar and the bookings table, both of which
  // it discovers for itself. Anything passed in would be a second source of truth.
  inputSchema: [],
  outputSchema: [
    { name: 'created', type: 'number' },
    { name: 'updated', type: 'number' },
    { name: 'sent', type: 'number' },
    { name: 'problems', type: 'number' },
  ],

  schedule: [
    {
      /*
       * Six fields: Payload's cron takes a leading SECONDS field, and that field
       * is the whole subtlety here. Payload's own doc comment offers
       * '* 0/5 * * * *' as "every 5 minutes", but a '*' in seconds means every
       * second of minutes 0, 5, 10 … — and because a completed job is deleted,
       * the duplicate-guard stops suppressing and a fresh job is queued the
       * moment the previous one finishes. Observed effect: it ran at 10:40:02
       * and again at 10:41:02 rather than once per five minutes.
       *
       * Pinning seconds to 0 queues exactly one run per interval, which is what
       * was intended.
       */
      cron: '0 0/5 * * * *',
      queue: 'default',
    },
  ],

  // One attempt. A failure here is almost always a missing credential or a
  // revoked token, which no amount of retrying fixes, and the next tick is five
  // minutes away regardless — so retries would only multiply identical log noise.
  retries: 0,

  handler: async ({ req }) => {
    const { syncBookings } = await import('../lib/bookingSync')
    const { runBookingNotifications } = await import('../lib/bookingNotify')

    let created = 0
    let updated = 0
    let sent = 0
    const problems: string[] = []

    /*
     * The two halves are independently guarded. If the calendar read fails, the
     * reminders for bookings already in the table must still go out — those are
     * time-critical and have nothing to do with Google being reachable.
     */
    try {
      const calendar = await syncBookings(req.payload)
      created = calendar.created
      updated = calendar.updated
      problems.push(...calendar.errors)
    } catch (err) {
      problems.push(`calendar: ${(err as Error).message}`)
    }

    try {
      const notify = await runBookingNotifications(req.payload)
      sent = notify.booked + notify.dayBefore + notify.hourBefore + notify.teamEmail
      problems.push(...notify.errors)
    } catch (err) {
      problems.push(`notify: ${(err as Error).message}`)
    }

    // Logged only when something happened. This runs 288 times a day and a line
    // per tick would bury everything else in the log.
    if (created || updated || sent || problems.length) {
      req.payload.logger.info(
        `bookings: +${created} new, ${updated} updated, ${sent} message(s) sent${
          problems.length ? `, ${problems.length} problem(s): ${problems.slice(0, 3).join(' | ')}` : ''
        }`,
      )
    }

    return { output: { created, updated, sent, problems: problems.length } }
  },
}

export default syncBookingsTask
