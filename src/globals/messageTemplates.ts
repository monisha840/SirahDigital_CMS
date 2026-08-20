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
].join(' · ')

/** Reused by all four message bodies so the reference is never out of date. */
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
          description: 'Sent 24 hours before the call. Still no link — this one is a reminder, not the joining details.',
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
                '',
                // Same reasoning as the booking message: "we will find another
                // time" described a rescheduling service nothing implements.
                'We will send the joining link an hour before we start. If anything changes, reply here and we will get back to you.',
                '',
                '*Team SIRAH DIGITAL*',
              ].join('\n'),
            ),
          ],
        },
        {
          label: 'Hour before',
          description:
            'Sent 60 minutes before the call, and the only message that carries {{meetLink}}. If the link is missing this message is held back rather than sent without it — so keep {{meetLink}} in the body.',
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
          description: 'Emailed to the address below the moment someone books.',
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
                'This booking was read from the connected Google Calendar.',
              ].join('\n'),
            ),
          ],
        },
      ],
    },
  ],
}

export default MessageTemplates
