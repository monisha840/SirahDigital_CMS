/*
 * Put the reschedule offer into the saved day-before message.
 *
 * ── Why this script exists at all ────────────────────────────────────────
 * The bodies in globals/messageTemplates.ts are `defaultValue`s. They apply to
 * a global that has never been saved, and this one was saved long ago — so
 * shipping the new default changes nothing that goes out. Without this step the
 * reschedule link is dead code: the endpoint works, the token exists, and no
 * message ever mentions it.
 *
 * ── Why it refuses rather than overwrites ────────────────────────────────
 * Message copy belongs to whoever edits it in the admin, not to a deploy. So
 * this only rewrites a body that is still byte-for-byte the old default — if
 * anyone has touched the wording, it prints what to paste and changes nothing.
 * Re-running it after a successful run is a no-op for the same reason.
 *
 * Through the local API rather than SQL because this global has drafts and
 * version history; `updateGlobal` keeps the published row and the version table
 * consistent, which two hand-written UPDATEs would not.
 *
 *   npx tsx scripts/adopt-reschedule-copy.ts          # says what it would do
 *   npx tsx scripts/adopt-reschedule-copy.ts --apply
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const NL = String.fromCharCode(10)
const APPLY = process.argv.includes('--apply')

/** The wording being replaced. Its presence is the proof nobody has edited this. */
const OLD_MARKER = 'reply here and we will get back to you'

const NEW_BODY = [
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
  'Cannot make it? Pick another time here:',
  '{{rescheduleLink}}',
  '',
  'Your old time is freed the moment you choose a new one.',
  '',
  '*Team SIRAH DIGITAL*',
].join(NL)

/*
 * The reschedule email, which the saved global also has no value for.
 *
 * `defaultValue` applies when a row is created, never to one that already
 * exists — so a new required field added to a global that was saved months ago
 * is simply null, and the first attempt to update anything on that global fails
 * validation on the field nobody touched. Seeding it here is what makes the
 * day-before edit above possible at all.
 */
const NEW_TEAM_SUBJECT = 'Consultation MOVED — {{fullName}}, now {{dateTime}}'
const NEW_TEAM_BODY = [
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
].join(NL)

const payload = await getPayload({ config })

const current = (await payload.findGlobal({
  slug: 'message-templates',
  overrideAccess: true,
  depth: 0,
})) as {
  dayBeforeBody?: string | null
  teamRescheduleSubject?: string | null
  teamRescheduleBody?: string | null
}

const body = current.dayBeforeBody || ''
const needsTeamCopy = !current.teamRescheduleSubject || !current.teamRescheduleBody

if (body.includes('{{rescheduleLink}}') && !needsTeamCopy) {
  console.log('Already carries {{rescheduleLink}} and the reschedule email — nothing to do.')
  process.exit(0)
}

if (!body.includes(OLD_MARKER) && !body.includes('{{rescheduleLink}}') && !needsTeamCopy) {
  console.log(
    'The saved day-before message has been edited, so this script will not overwrite it.',
    NL + NL + 'Add these two lines wherever they read best, in the admin under',
    'Settings → Booking Messages → Day before:',
    NL + NL + '  Cannot make it? Pick another time here:',
    NL + '  {{rescheduleLink}}',
    NL + NL + 'Without {{rescheduleLink}} the message still sends exactly as it does now —',
    'it simply never offers the move.',
  )
  process.exit(1)
}

console.log('--- current ---')
console.log(body)
console.log(NL + '--- replacement ---')
console.log(NEW_BODY)

if (!APPLY) {
  console.log(NL + 'DRY RUN — nothing written. Re-run with --apply.')
  process.exit(0)
}

await payload.updateGlobal({
  slug: 'message-templates',
  data: {
    // Only rewritten when it is still the untouched old default; see above.
    ...(body.includes('{{rescheduleLink}}') ? {} : { dayBeforeBody: NEW_BODY }),
    // Filled only where empty, so a team that has already worded its own
    // reschedule email keeps it.
    ...(current.teamRescheduleSubject ? {} : { teamRescheduleSubject: NEW_TEAM_SUBJECT }),
    ...(current.teamRescheduleBody ? {} : { teamRescheduleBody: NEW_TEAM_BODY }),
  },
  overrideAccess: true,
  // The global is versioned with drafts; this has to land as published or the
  // reminder job, which reads the published state, would go on sending the old
  // body while the admin showed the new one.
  draft: false,
  context: { skipRevalidate: true },
})

const after = (await payload.findGlobal({
  slug: 'message-templates',
  overrideAccess: true,
  depth: 0,
})) as { dayBeforeBody?: string | null }

console.log(
  NL +
    (after.dayBeforeBody?.includes('{{rescheduleLink}}')
      ? 'Done — the day-before message now offers the reschedule link.'
      : 'WROTE, BUT THE READ-BACK DOES NOT SHOW THE LINK. Check the admin before trusting this.'),
)
process.exit(0)
