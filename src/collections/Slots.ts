import type { CollectionConfig } from 'payload'
import { canPublish, isAdmin, noone } from '../access'

/**
 * Bookable time, and whether it has been taken.
 *
 * ── Why this collection exists ───────────────────────────────────────────
 * It is the half of the booking pipeline TidyCal used to own. Availability used
 * to live in the TidyCal dashboard — invisible to this codebase, un-versioned,
 * and knowable only by logging into a third party. A booking then arrived here
 * sideways, as a calendar event the poller had to *guess* was a booking by
 * regex-matching the word "tidycal" in its description.
 *
 * With availability here, both halves of that go away. A slot is bookable
 * because a row says so, and a booking is a booking because we wrote it — not
 * because a heuristic recognised someone else's event. `bookingSync` inverted
 * from "read the calendar and infer" to "reconcile what we already know", and
 * the guessing code was deleted rather than improved.
 *
 * ── The row is the lock ──────────────────────────────────────────────────
 * Two people can load /book at the same second and choose the same time. What
 * stops the second one double-booking is not a check-then-write in application
 * code — that races — but a single conditional UPDATE against `status`, which
 * Postgres serialises for us. See `claimSlot` in endpoints/slots.ts.
 *
 * ── No PII here ──────────────────────────────────────────────────────────
 * `bookedName` is the only personal field, and it is a display convenience for
 * the admin calendar. Email, phone and everything else live on `bookings` and
 * `leads`, which carry the retention machinery. Deliberately not duplicated:
 * a purge that cleans two tables and misses a third has not deleted anything.
 */

/** Ceilings on the bulk generator, restated server-side. See endpoints/slots.ts. */
export const MAX_GENERATE_DAYS = 92
export const MAX_GENERATE_SLOTS = 600

export const Slots: CollectionConfig = {
  slug: 'slots',
  admin: {
    group: 'Administration',
    useAsTitle: 'localTime',
    defaultColumns: ['localDate', 'localTime', 'durationMinutes', 'status', 'bookedName'],
    description:
      'Consultation times offered on /book. Manage these from the Availability screen rather than here — this list view is the raw table behind it, kept for inspection and one-off corrections.',
  },

  access: {
    /*
     * Everything goes through the endpoints. `create: noone` closes the public
     * REST door for the same reason `leads` does: the write path has invariants
     * (the local fields must be server-computed, the instant must not already be
     * taken) that a raw REST create would bypass entirely.
     *
     * `read` is staff-only. The site does not read this collection directly —
     * it reads /api/public/slots, which returns open slots and nothing else.
     */
    create: noone,
    read: canPublish,
    update: canPublish,
    delete: isAdmin,
  },

  versions: false,
  timestamps: true,

  fields: [
    /*
     * ── The absolute instant, and the civil time it represents ────────────
     *
     * Both are stored, and neither is derivable from the other without knowing
     * the zone — which is the entire reason `timeZone` sits next to them.
     *
     * `startAt` is the truth: an instant, comparable across zones, and what the
     * Google Calendar event and every reminder deadline are computed from.
     *
     * `localDate` / `localTime` are that same instant rendered in `timeZone`,
     * computed once on write by lib/zonedTime.ts. They exist so that "show me
     * March" is an indexed string comparison rather than a per-row timezone
     * conversion, and so the browser is never asked which day a slot falls on —
     * the mistake the SlotCalendar readme warns about twice.
     */
    {
      type: 'row',
      fields: [
        {
          name: 'localDate',
          type: 'text',
          required: true,
          index: true,
          admin: {
            width: '50%',
            readOnly: true,
            description: 'YYYY-MM-DD in the slot’s own zone. Server-computed — never edit by hand.',
          },
        },
        {
          name: 'localTime',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            readOnly: true,
            description: 'HH:mm, 24-hour, in the slot’s own zone. Server-computed.',
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'startAt',
          type: 'date',
          required: true,
          index: true,
          admin: {
            width: '50%',
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime' },
            description: 'The absolute instant. Everything downstream is scheduled from this.',
          },
        },
        {
          name: 'endAt',
          type: 'date',
          required: true,
          admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'durationMinutes',
          type: 'number',
          required: true,
          defaultValue: 45,
          min: 5,
          max: 480,
          admin: { width: '50%' },
        },
        {
          name: 'timeZone',
          type: 'text',
          required: true,
          defaultValue: 'Asia/Kolkata',
          admin: {
            width: '50%',
            description:
              'IANA zone the local fields above are expressed in. Stored per row because the row outlives any single default.',
          },
        },
      ],
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      index: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Booked', value: 'booked' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Cancelled slots are withdrawn, not deleted — the row is the only record that the time was ever offered, and deleting a booked one would orphan the call that was arranged on it.',
      },
    },

    /*
     * ── Who took it ──────────────────────────────────────────────────────
     *
     * The name is denormalised onto the slot on purpose: the admin calendar
     * renders "Booked — Priya" for every slot in a month, and joining out to
     * `bookings` for each one would turn one query into thirty. The `booking`
     * relationship below is the authoritative link; this is a label.
     */
    {
      type: 'row',
      fields: [
        {
          name: 'bookedName',
          type: 'text',
          admin: { width: '50%', readOnly: true, description: 'Display only. The record lives on the booking.' },
        },
        {
          name: 'bookedAt',
          type: 'date',
          admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      admin: {
        readOnly: true,
        description:
          'The call arranged on this slot. Set when the slot is claimed; the invitee’s contact details are on that row, not this one.',
      },
    },

    {
      name: 'actor',
      type: 'text',
      defaultValue: 'console',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Who created the slot — the signed-in admin, or "console" for a scripted call.',
      },
    },
  ],
}

export default Slots
