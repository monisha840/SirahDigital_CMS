import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, isAdminFieldLevel } from '../access'

/**
 * Staff accounts.
 *
 * Only `admin` is issued at launch (cms_architecture.md §18 decision 3). The
 * other three roles exist in the schema now so that adding a teammate later is
 * a dropdown change rather than a migration against a live table.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'lastLoginAt'],
    group: 'Administration',
    // Nobody but an admin should even see this collection in the sidebar.
    hidden: ({ user }) => user?.role !== 'admin',
  },

  auth: {
    // §13: 5 attempts, then a 15-minute lockout. Payload enforces both.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,

    // 2 hours, refreshed on activity. Short enough that a stolen laptop is not
    // a standing session; long enough that editors are not re-authenticating
    // in the middle of writing a post.
    tokenExpiration: 2 * 60 * 60,

    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },

    // The reset link is single-use and expires; the email body deliberately
    // does not confirm whether the address exists.
    forgotPassword: {
      expiration: 30 * 60 * 1000,
    },
  },

  access: {
    // Creating staff accounts is an admin-only act. There is no self-signup.
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    // Prevents a non-admin from seeing the collection in the admin UI at all.
    admin: ({ req: { user } }) => Boolean(user),
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin — everything, including users and settings', value: 'admin' },
        { label: 'Editor — create, edit and publish all content', value: 'editor' },
        { label: 'Contributor — drafts only, cannot publish', value: 'contributor' },
        { label: 'Viewer — read-only, including preview', value: 'viewer' },
      ],
      access: {
        // Mass-assignment guard. Without this a user could PATCH their own
        // record and promote themselves to admin.
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'Only Admin is issued at launch. The rest are reserved.',
      },
    },
    {
      name: 'mustChangePassword',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: isAdminFieldLevel,
      },
      admin: {
        description:
          'Set on the seeded bootstrap account. The user is redirected to a password change until they clear it.',
      },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      access: {
        update: () => false,
      },
    },

    /*
     * TOTP two-factor.
     *
     * The columns are created now so that enabling 2FA later is not a
     * migration against a populated table. Enforcement — the login step-up,
     * the enrolment QR, the recovery codes — is a Phase 6 item and is NOT
     * implemented yet. Do not read `totpEnabled` as "this account is
     * protected by 2FA" until that phase lands.
     */
    {
      name: 'totpEnabled',
      type: 'checkbox',
      defaultValue: false,
      access: { update: isAdminFieldLevel },
      admin: {
        position: 'sidebar',
        description: 'Reserved for Phase 6. Not yet enforced at login.',
      },
    },
    {
      name: 'totpSecret',
      type: 'text',
      access: {
        // Never readable through the API, by anyone, including admins.
        read: () => false,
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
  ],

  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        // Stamped without triggering hooks or access checks — this is
        // bookkeeping, not an editorial change.
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: { lastLoginAt: new Date().toISOString() },
          overrideAccess: true,
          context: { skipRevalidate: true },
        })
      },
    ],
  },
}

export default Users
