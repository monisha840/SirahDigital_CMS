import type { Access, FieldAccess } from 'payload'

/**
 * Access control lives here rather than inline on each collection, so the
 * whole permission surface can be read in one file during a security review.
 *
 * Roles are seeded in the schema from day one but only `admin` is issued at
 * launch (see cms_architecture.md §18). Adding a teammate later is a dropdown
 * change, not a migration — which is the entire reason the other three exist
 * now instead of being retrofitted.
 *
 * Every export below defaults to DENY. There is no `return true` fallthrough
 * anywhere in this file.
 */

type Role = 'admin' | 'editor' | 'contributor' | 'viewer'

const hasRole =
  (...roles: Role[]): Access =>
  ({ req: { user } }) =>
    Boolean(user && roles.includes(user.role as Role))

/** Full control: users, settings, redirects, destructive operations. */
export const isAdmin: Access = hasRole('admin')

/** Create, edit and publish content. No user management, no settings. */
export const canPublish: Access = hasRole('admin', 'editor')

/** Contributors may create and edit drafts but never publish (see below). */
export const canEditContent: Access = hasRole('admin', 'editor', 'contributor')

/** Any authenticated staff member, including read-only stakeholders. */
export const isLoggedIn: Access = hasRole('admin', 'editor', 'contributor', 'viewer')

/**
 * Public read for content collections.
 *
 * An authenticated user sees everything, including drafts, which is what makes
 * live preview work. Everyone else sees only entries whose `_status` is
 * `published` — so an unpublished page is a 404 to the internet even though
 * its row exists and its ID is guessable.
 */
export const publishedOnly: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: { equals: 'published' },
  }
}

/**
 * Publishing gate.
 *
 * Payload expresses "may save as published" through update access on the
 * `_status` field. A contributor can save drafts all day; the moment they try
 * to flip status to published, this denies it.
 */
export const canSetStatus: FieldAccess = ({ req: { user } }) =>
  Boolean(user && ['admin', 'editor'].includes(user.role as Role))

/** Field-level admin gate — used to lock `role`, TOTP secrets and the like. */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  Boolean(user && user.role === 'admin')

/**
 * A user may read and update their own record; admins may touch anyone's.
 * Without the self clause, a non-admin cannot change their own password.
 */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}

/**
 * Nobody, ever, through the API.
 *
 * Used for `leads.create`: submissions arrive through the site's own contact
 * route using the Local API with `overrideAccess`, so the collection needs no
 * public write path at all. Leaving create open would let anyone on the
 * internet stuff your CRM.
 */
export const noone: Access = () => false
