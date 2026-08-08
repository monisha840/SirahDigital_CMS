/**
 * Sets a user's password directly.
 *
 *   npx tsx scripts/set-password.ts <email> <newPassword>
 *
 * For the cases the admin UI cannot cover: a locked-out admin, a forgotten
 * bootstrap password with no mail adapter configured yet, or handing the
 * account over to someone else.
 *
 * Normal password changes should go through the admin UI or the
 * "Forgot password" flow. This is the break-glass tool, which is why it only
 * runs with direct shell access to the server and its .env.
 *
 * The password is taken as an argument and never written anywhere — Payload
 * hashes it with Argon2 on save, and nothing here logs it.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const [, , email, password] = process.argv

const run = async () => {
  if (!email || !password) {
    console.error('Usage: npx tsx scripts/set-password.ts <email> <newPassword>')
    process.exit(1)
  }
  if (password.length < 12) {
    console.error(`Password is ${password.length} characters. Minimum is 12.`)
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (found.docs.length === 0) {
    console.error(`No user with email ${email}.`)
    process.exit(1)
  }

  await payload.update({
    collection: 'users',
    id: found.docs[0].id,
    data: {
      password,
      // The flag exists to stop a shared bootstrap credential staying live.
      // Someone choosing their own password here has already satisfied that,
      // so leaving it set would just prompt them to change it again at login.
      mustChangePassword: false,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })

  console.log(`Password updated for ${email}. Forced-change flag cleared.`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
