import crypto from 'crypto'
import type { CollectionConfig } from 'payload'
import { canPublish, isAdmin, noone } from '../access'

/**
 * Confirmed consultation calls.
 *
 * ── Why this collection exists ───────────────────────────────────────────
 * A row is written the moment a visitor claims a slot on /book, by the endpoint
 * that also creates the Google Calendar event. It turns "a booking happened"
 * into a fact this database knows first-hand — and therefore something reminders
 * can be scheduled against.
 *
 * It did not always work that way. Under TidyCal there was no API and no
 * webhook, so a job polled the connected calendar and tried to *recognise* which
 * events were bookings, by matching the word "tidycal" in the description and
 * sniffing the attendee list for an outsider. That guessing is gone: we create
 * the event, so we know its id, and `bookingSync` now reconciles rather than
 * infers. Anything in this file still phrased as though the calendar were the
 * source of truth is out of date, not subtle.
 *
 * This row is the scheduler's state, not a copy of the calendar for its own
 * sake. Everything on it exists to answer one of two questions: *when* should
 * the next message go out, and *has it already gone*.
 *
 * ── Idempotency ──────────────────────────────────────────────────────────
 * `calendarEventId` is unique. The sync job runs every few minutes and reminder
 * windows are checked repeatedly; without a unique key a retried booking could
 * create a second row for one call, and the reminder pass would message the same
 * person on every tick. The `notifications` timestamps are the other half of that
 * guarantee: a message is sent when its stamp is empty, and stamping it is what
 * stops the next run repeating it.
 *
 * ── PII ──────────────────────────────────────────────────────────────────
 * Name, email and phone of a member of the public, so the same DPDP rules as
 * `leads` apply: no versions (a purged row whose values survive in a versions
 * table has not been deleted), and `purgeAt` enforced by the retention job.
 */

/** Matches leads. §13.4. */
export const BOOKING_RETENTION_MONTHS = 24

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    group: 'Administration',
    useAsTitle: 'inviteeName',
    defaultColumns: ['startAt', 'inviteeName', 'inviteeEmail', 'inviteePhone', 'status'],
    description:
      'Consultation calls booked on the website. Personal data — deleted automatically after 24 months. The notification timestamps are what stop a reminder being sent twice; clearing one will cause that message to be re-sent on the next run.',
  },

  access: {
    // Written only by the secret-guarded booking endpoint and the sync job,
    // exactly as leads are. No public write path.
    create: noone,
    read: canPublish,
    update: canPublish,
    delete: isAdmin,
  },

  versions: false,
  timestamps: true,

  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          const purge = new Date(data.startAt || Date.now())
          purge.setMonth(purge.getMonth() + BOOKING_RETENTION_MONTHS)
          data.purgeAt = purge.toISOString()

          /*
           * The reschedule token, minted here rather than in the booking
           * endpoint.
           *
           * A row without one cannot be moved by the person it belongs to, and
           * the day-before message would go out with the reschedule line held
           * back — a silent downgrade nobody would notice for weeks. Doing it in
           * the hook covers every way a booking can come into being, including a
           * hand-created row in the admin and whatever the next integration is.
           *
           * randomBytes, not randomInt or a counter: this is the entire
           * authorisation for moving somebody's call, so it has to be
           * unguessable. 24 bytes is 192 bits, base64url so it survives being
           * pasted into a WhatsApp message and clicked.
           */
          data.rescheduleToken = data.rescheduleToken || crypto.randomBytes(24).toString('base64url')
          data.rescheduleCount = data.rescheduleCount ?? 0
        }
        return data
      },
    ],
  },

  fields: [
    {
      name: 'calendarEventId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description:
          'Google Calendar event id, returned when we created the event. The deduplication key — one booking, one row, however many times the sync job sees it.',
      },
    },

    {
      name: 'slot',
      type: 'relationship',
      relationTo: 'slots',
      admin: {
        readOnly: true,
        description:
          'The bookable time this call was arranged on. Cancelling either one cancels the other — a booking with its slot still open would let the time be sold twice.',
      },
    },

    {
      type: 'row',
      fields: [
        { name: 'inviteeName', type: 'text', admin: { width: '50%' } },
        { name: 'inviteeEmail', type: 'email', required: true, index: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'inviteePhone',
      type: 'text',
      admin: {
        description:
          'WhatsApp number, digits only with country code. Asked for on the booking form and copied from the matching lead — no lead, no number, and the WhatsApp messages for this booking are skipped rather than guessed at.',
      },
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      admin: {
        description:
          'The enquiry this booking was matched to, by email. The only source of the phone number above.',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'startAt',
          type: 'date',
          required: true,
          index: true,
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'endAt',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'timezone',
      type: 'text',
      defaultValue: 'Asia/Kolkata',
      admin: {
        description:
          'IANA zone the times are rendered in for the invitee. Stored per booking because the row outlives any single default.',
      },
    },

    {
      name: 'meetLink',
      type: 'text',
      admin: {
        description:
          'The Google Meet link, created with the calendar event. Usually present immediately; when Google reports the conference as pending it arrives on a later sync. The hour-before reminder will not send while this is empty — that message exists to deliver the link.',
      },
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'confirmed',
      index: true,
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Cancelled bookings are skipped by the reminder job rather than deleted.',
      },
    },

    {
      name: 'notifications',
      type: 'group',
      admin: {
        description:
          'Set when each message is sent. Empty means "not yet"; a value means "done". Not "never again": a reschedule clears these on purpose, so the three messages go out afresh for the new time. Read them as "sent for the time currently on this row".',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'bookedSentAt',
              type: 'date',
              admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'teamEmailSentAt',
              type: 'date',
              admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'dayBeforeSentAt',
              type: 'date',
              admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'hourBeforeSentAt',
              type: 'date',
              admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          name: 'lastError',
          type: 'text',
          admin: {
            readOnly: true,
            description:
              'Why the most recent send failed. Kept on the row because a job log scrolls away and this is the first thing anyone asks about a missing reminder.',
          },
        },
      ],
    },

    /*
     * ── Rescheduling ──────────────────────────────────────────────────────
     * The invitee moves their own call from a link in the day-before message.
     * Everything needed to police that lives here rather than in a side table,
     * because the only questions ever asked of it are about one booking.
     */
    {
      name: 'rescheduleToken',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description:
          'Identifies this booking in the reschedule link, and is the only thing authorising the move. Treat it as a password: anyone holding it can change the time. Never paste it into an email or a chat.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rescheduleCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '50%',
            readOnly: true,
            description: 'Moves so far. The link stops working after 2 — past that a person handles it.',
          },
        },
        {
          name: 'rescheduledFrom',
          type: 'date',
          admin: {
            width: '50%',
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime' },
            description: 'The time this call was at before the most recent move. Empty on a booking that has never moved.',
          },
        },
      ],
    },

    {
      name: 'purgeAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: `Automatically deleted on this date (${BOOKING_RETENTION_MONTHS} months after the call).`,
      },
    },
  ],
}

export default Bookings
