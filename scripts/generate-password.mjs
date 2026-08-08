#!/usr/bin/env node
/**
 * Generates the secrets this app needs.
 *
 *   npm run gen:password
 *
 * Alphabet excludes I, l, 1, O and 0 — a bootstrap password gets read aloud or
 * typed from a screenshot at least once, and those five characters are where
 * that goes wrong.
 *
 * Uses crypto.randomInt, which is rejection-sampled and unbiased. Math.random()
 * is not a CSPRNG and must never be used for this.
 */
import crypto from 'crypto'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%^*_-+='

const password = (length = 28) =>
  Array.from({ length }, () => ALPHABET[crypto.randomInt(ALPHABET.length)]).join('')

const hex = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

console.log(`
Copy these into sirah-cms/.env — never into git, never into Slack.

PAYLOAD_SECRET=${hex(32)}
REVALIDATE_SECRET=${hex(32)}
CRON_SECRET=${hex(24)}

Bootstrap admin password (hand over out-of-band; it is force-changed at first login):

SEED_ADMIN_PASSWORD=${password(28)}

REVALIDATE_SECRET must be copied to the SITE's .env.local under the same name —
the site verifies the HMAC with it, so a mismatch silently stops every edit from
going live.
`)
