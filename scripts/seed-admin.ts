/**
 * Creates the bootstrap admin account, once.
 *
 *   npm run seed:admin
 *
 * The password comes from SEED_ADMIN_PASSWORD in the environment and is never
 * written to a file, a log or this repo. `mustChangePassword` is set, so the
 * account is forced to rotate it at first login and the bootstrap value stops
 * being a live credential the moment it is used.
 *
 * Safe to re-run: if the account exists, this reports and exits without
 * touching it. It will not silently reset a real admin's password.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const email = process.env.SEED_ADMIN_EMAIL || 'admin@sirahdigital.in'
const password = process.env.SEED_ADMIN_PASSWORD

const run = async () => {
  if (!password) {
    console.error('SEED_ADMIN_PASSWORD is not set. Run `npm run gen:password` and put it in .env.')
    process.exit(1)
  }
  if (password.length < 12) {
    console.error('SEED_ADMIN_PASSWORD is shorter than 12 characters. Generate a real one.')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    console.log(`Admin ${email} already exists — leaving it alone.`)
    console.log('To reset a lost password, use "Forgot password" on the login screen.')
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      name: 'Sirah Admin',
      role: 'admin',
      mustChangePassword: true,
    },
    overrideAccess: true,
  })

  console.log(`
Created bootstrap admin.

  URL       ${process.env.CMS_URL || 'http://localhost:3001'}/admin
  Email     ${email}
  Password  (the SEED_ADMIN_PASSWORD you set — not printed here on purpose)

Next:
  1. Log in and change the password immediately. The account is flagged to force this.
  2. Blank SEED_ADMIN_PASSWORD in .env.
  3. Create a personal admin account and stop using this shared one.
`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
