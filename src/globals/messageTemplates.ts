import type { GlobalConfig } from 'payload'
import { canEditContent, isLoggedIn } from '../access'
import { versioned } from '../fields/publishing'

/**
 * The messages sent to someone who books a call, editable without a deploy.
 *
 * ── Why these live in the CMS and are rendered in the CMS ─────────────────
 * The obvious home for this copy is the site, next to the WhatsApp client that
 * already sends the contact-form confirmation. It cannot go there: the site
 * reads the CMS for nothing but the chatbot, so a template edited in the admin
 * would never reach it. The sender therefore runs *inside* the CMS — which has
 * the database, the job queue and these templates in one process — and the site
 * is not involved in booking messages at all.
 *
 * ── Placeholders ─────────────────────────────────────────────────────────
 * Written as {{token}} and substituted at send time. The set is fixed by the
 * renderer (src/lib/templates.ts); an unknown token is removed and logged rather
 * than delivered, because "Hi {{frstName}}," reaching a prospect is worse than
 * "Hi ,".
 *
 * ── WhatsApp formatting ──────────────────────────────────────────────────
 * Bold is a *single* asterisk. Markdown's **double** asterisk renders the extra
 * asterisks literally, so the defaults below are deliberately single-starred —
 * keep that if you edit them.
 *
 * ── The `enabled` switches ───────────────────────────────────────────────
 * Each message can be turned off without deleting its wording, so pausing the
 * day-before nudge for a week does not mean rewriting it afterwards from memory.
 */

const PLACEHOLDERS = [
  '{{firstName}} — invitee’s first name',
  '{{fullName}} — invitee’s full name',
  '{{email}} — invitee’s email',
  '{{phone}} — invitee’s WhatsApp number',
  '{{date}} — e.g. Tuesday, 26 August 2026',
  '{{time}} — e.g. 4:30 pm IST',
  '{{dateTime}} — date and time together',
  '{{meetLink}} — the video call link',
  '{{company}} — company name, if the lead gave one',
  '{{interests}} — products they named on the form',
  '{{message}} — what they typed in the enquiry form',
  '{{rescheduleLink}} — where they move the call themselves; empty inside 24h or after 2 moves',
  '{{previousDateTime}} — the time before the last move; only in the reschedule email',
].join(' · ')

// A newline, spelled out. The same character the older bodies below get from
// an escape sequence; this form exists because that escape is the one thing
// that does not survive being written into this file through a shell, and it
// fails silently — the string ends early and the template renders half a
// message. Prefer this in anything added from now on.
const NL = String.fromCharCode(10)

/** Reused by every message body so the reference is never out of date. */
const bodyField = (name: string, label: string, defaultValue: string, extra = '') => ({
  name,
  label,
  type: 'textarea' as const,
  required: true,
  defaultValue,
  admin: {
    rows: 12,
    description: `${extra}${extra ? ' ' : ''}Placeholders: ${PLACEHOLDERS}`,
  },
})

export const MessageTemplates: GlobalConfig = {
  slug: 'message-templates',
  label: 'Booking Messages',
  admin: {
    group: 'Settings',
    description:
      'What a person receives after booking a call, and what the team is emailed. Edits apply to the next message sent — messages already delivered are unaffected.',
  },
  versions: versioned,
  access: {
    // Not public: this is internal outbound copy, and the site never reads it.
    read: isLoggedIn,
    update: canEditContent,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'On booking',
          description:
            'Sent immediately when someone books, from the booking request itself. Deliberately carries no call link — the link goes out an hour before, so it cannot be lost in a week-old chat. Note that nothing reads replies to these messages: a reply sits in the WhatsApp inbox until a person opens it, so do not promise anything automatic here.',
          fields: [
            { name: 'bookedEnabled', type: 'checkbox', defaultValue: true, label: 'Send this message' },
            bodyField(
              'bookedBody',
              'WhatsApp — booking confirmed',
              [
                'Hi {{firstName}},',
                '',
                'Your consultation with *SIRAH DIGITAL* is confirmed.',
                '',
                '*When:* {{dateTime}}',
                '*Duration:* 45 minutes',
                '',
                'We will send you the joining link one hour before the call.',
                '',
                /*
                 * Was: "If you need to reschedule, just reply to this message."
                 *
                 * Nothing reads inbound WhatsApp. The gateway is send-only —
                 * there is no webhook, no listener, nothing in the codebase that
                 * touches a reply. So that sentence promised an automated action
                 * that does not exist, and a reply asking to move a call would
                 * have sat unread until somebody happened to open the inbox.
                 *
                 * The wording below is what actually happens: a person reads it
                 * and answers. It deliberately avoids naming rescheduling as a
                 * feature, because it is not one — moving a call is a manual job
                 * done from the admin, and inviting it in writing is what creates
                 * the expectation that it is handled.
                 */
                'If anything changes, reply here and we will get back to you.',
                '',
                '*Kind regards,*',
                '*Team SIRAH DIGITAL*',
              ].join('\n'),
            ),
          ],
        },
        {
          label: 'Day before',
          description:
            'Sent 24 hours before the call. Still no joining link — this one is a reminder. It is also the only message that offers rescheduling, so keep {{rescheduleLink}} in the body: without it the message is held back rather than sent with a broken offer.',
          fields: [
            { name: 'dayBeforeEnabled', type: 'checkbox', defaultValue: true, label: 'Send this message' },
            bodyField(
              'dayBeforeBody',
              'WhatsApp — day before',
              [
                'Hi {{firstName}},',
                '',
                'A quick reminder that your consultation with *SIRAH DIGITAL* is tomorrow.',
                '',
                '*When:* {{dateTime}}',
                '*Duration:* 45 minutes',
                '*Booked as:* {{fullName}}',
                '',
                'We will send the joining link an hour before we start.',
                '',
                /*
                 * The reschedule link, and why this is the only message with it.
                 *
                 * The booking message is too early to be useful — plans have not
                 * changed yet — and the hour-before message is too late, because
                 * there is nothing left to move to and offering it then reads as
                 * an invitation to drop out twenty minutes before the call.
                 * Twenty-four hours out is where somebody actually knows whether
                 * they can make it.
                 *
                 * It replaces "reply here and we will get back to you", which was
                 * accurate but manual: nothing reads inbound WhatsApp, so that
                 * sentence meant waiting for somebody to open the inbox. This is
                 * a real route with real limits — the endpoint refuses inside 24
                 * hours and after two moves, and the link is not printed at all
                 * when it would be refused. See rescheduleAllowed in
                 * lib/templates.ts; isSendable holds the whole message back
                 * rather than let this render as a dangling "Pick another time".
                 */
                'Cannot make it? Pick another time here:',
                '{{rescheduleLink}}',
                '',
                'Your old time is freed the moment you choose a new one.',
                '',
                '*Team SIRAH DIGITAL*',
              ].join('\n'),
            ),
          ],
        },
        {
          label: 'Hour before',
          description:
            'Sent 60 minutes before the call, and the only message that carries {{meetLink}}. If the link is missing this message is held back rather than sent without it — so keep {{meetLink}} in the body. Do not add {{rescheduleLink}} here: an hour out there is nothing useful to move to, the endpoint would refuse it anyway, and offering it reads as an invitation to drop out.',
          fields: [
            { name: 'hourBeforeEnabled', type: 'checkbox', defaultValue: true, label: 'Send this message' },
            bodyField(
              'hourBeforeBody',
              'WhatsApp — hour before, with link',
              [
                'Hi {{firstName}},',
                '',
                'Your consultation with *SIRAH DIGITAL* starts in about an hour ({{time}}).',
                '',
                'Join here:',
                '{{meetLink}}',
                '',
                'See you shortly.',
                '',
                '*Team SIRAH DIGITAL*',
              ].join('\n'),
              'Must contain {{meetLink}}.',
            ),
          ],
        },
        {
          label: 'Team email',
          description:
            'Emailed to the address below the moment someone books, and again whenever they move the call. Nothing here ever goes to the person who booked — sendEmail refuses any recipient outside our own domain.',
          fields: [
            { name: 'teamEmailEnabled', type: 'checkbox', defaultValue: true, label: 'Send this email' },
            {
              name: 'teamEmailTo',
              type: 'email',
              required: true,
              defaultValue: 'support@sirahdigital.in',
              admin: { description: 'Where booking notifications go.' },
            },
            {
              name: 'teamEmailSubject',
              type: 'text',
              required: true,
              defaultValue: 'New consultation booked — {{fullName}}, {{dateTime}}',
              admin: { description: `Placeholders: ${PLACEHOLDERS}` },
            },
            bodyField(
              'teamEmailBody',
              'Email body',
              [
                'A consultation call has been booked.',
                '',
                'Name:     {{fullName}}',
                'Email:    {{email}}',
                'Phone:    {{phone}}',
                'Company:  {{company}}',
                '',
                'When:     {{dateTime}}',
                'Link:     {{meetLink}}',
                '',
                'Interested in: {{interests}}',
                '',
                'What they said:',
                '{{message}}',
                '',
                'Booked at sirahdigital.in/book.',
              ].join('\n'),
            ),

            /*
             * A second subject/body pair for a call that has moved, rather than
             * one template with an optional line.
             *
             * `render` is a plain regex substitution with no conditionals, so a
             * "Moved from {{previousDateTime}}" line in the shared body renders
             * as "Moved from " on every first booking — a blank where the reader
             * expects a fact, on the majority of emails, to serve the minority.
             * Two templates is the smaller cost.
             *
             * The team wants the same details either way: what the person said
             * on the form is exactly as relevant the second time. So this
             * repeats the enquiry block rather than sending a bare "it moved"
             * that has to be cross-referenced against the first email.
             */
            {
              name: 'teamRescheduleSubject',
              type: 'text',
              required: true,
              defaultValue: 'Consultation MOVED — {{fullName}}, now {{dateTime}}',
              admin: { description: `Used instead of the subject above when the call has been rescheduled. Placeholders: ${PLACEHOLDERS}` },
            },
            bodyField(
              'teamRescheduleBody',
              'Email body — rescheduled',
              [
                'A consultation call has been MOVED by the person who booked it.',
                '',
                'Was:      {{previousDateTime}}',
                'Now:      {{dateTime}}',
                '',
                'Name:     {{fullName}}',
                'Email:    {{email}}',
                'Phone:    {{phone}}',
                'Company:  {{company}}',
                '',
                'Link:     {{meetLink}}',
                '',
                'Interested in: {{interests}}',
                '',
                'What they said:',
                '{{message}}',
                '',
                'The old time has been put back on the calendar as available.',
              ].join(NL),
              'Sent instead of the booking email when the call has moved.',
            ),
          ],
        },
      ],
    },
  ],
}

export default MessageTemplates
