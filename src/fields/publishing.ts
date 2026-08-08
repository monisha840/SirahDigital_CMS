import type { CollectionConfig, Field } from 'payload'
import { canSetStatus } from '../access'

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
 * Payload renders `_status` itself; this field re-declares it purely to attach
 * field-level access, which is how a Contributor is stopped from publishing.
 * Without it, "cannot publish" would be a UI convention rather than a rule.
 */
export const statusGate: Field = {
  name: '_status',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
  admin: { hidden: true },
  access: {
    create: canSetStatus,
    update: canSetStatus,
  },
}

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
