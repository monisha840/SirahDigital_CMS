import type { CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload'
import { Forbidden } from 'payload'

/**
 * Draft / publish / version behaviour, applied identically to every content
 * collection so an editor never has to learn two sets of rules.
 *
 * `schedulePublish` is native in Payload 3.87 and is driven by the jobs queue
 * (see payload.config.ts `jobs.autoRun`). The architecture doc originally
 * specced a bespoke `scheduled_jobs` table and worker; that is no longer
 * needed for publishing, and the custom worker survives only for lead purging.
 *
 * `maxPerDoc: 50` matches §8. Payload keeps the newest 50 versions per
 * document; published versions are retained regardless.
 */
export const versioned: CollectionConfig['versions'] = {
  drafts: {
    autosave: { interval: 2000, showSaveDraftButton: true },
    schedulePublish: true,
    // Validate drafts too. Without this, a required field can be left empty in
    // a draft and only explode at publish time — usually in front of whoever
    // is trying to ship it.
    validate: true,
  },
  maxPerDoc: 50,
}

/**
 * The publishing gate.
 *
 * ── Why this is a hook and not a field ───────────────────────────────────
 * The obvious approach is to declare `_status` as a field with field-level
 * access. It does not work: enabling `versions.drafts` makes Payload create
 * `_status` itself, so redeclaring it builds the same Postgres enum twice and
 * schema creation dies with
 *
 *     duplicate key value violates unique constraint "pg_enum_typid_label_index"
 *     Key (enumtypid, enumlabel)=(…, draft) already exists
 *
 * which names an internal catalogue index and says nothing about the actual
 * cause. A `beforeChange` hook enforces the same rule against the field Payload
 * already owns, and leaves the schema alone.
 *
 * Applied to every content collection. With Admin-only roles at launch this is
 * currently theoretical — but it is the thing that makes Contributor real the
 * day someone is given that role, rather than a label the UI merely respects.
 */
export const enforcePublishPermission: CollectionBeforeChangeHook = ({ data, req, originalDoc }) => {
  if (data?._status !== 'published') return data

  // Already published and staying published — an ordinary edit, not an act of
  // publishing. Blocking these would stop a contributor fixing a typo on a
  // live page, which is not what the rule is for.
  if (originalDoc?._status === 'published') return data

  /*
   * No user means this is server-side code: the seed script, a migration, the
   * scheduled-publish worker. Hooks run even under `overrideAccess`, so
   * without this the seed cannot publish anything it creates.
   *
   * Safe, because collection-level access has already run by this point and
   * denies every unauthenticated write — `create` and `update` both require a
   * role. An anonymous REST request never reaches this line.
   */
  if (!req.user) return data

  const role = req.user.role
  if (role === 'admin' || role === 'editor') return data

  throw new Forbidden(req.t)
}

/** Kept for the seed script, which writes with overrideAccess. */
export const PUBLISHED = { _status: 'published' as const }

/** Sidebar ordering control, used by every collection the site renders in sequence. */
export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 100,
  index: true,
  admin: {
    position: 'sidebar',
    step: 1,
    description: 'Lower numbers appear first. Ties fall back to creation date.',
  },
}
