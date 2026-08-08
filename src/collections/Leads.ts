import type { CollectionConfig } from 'payload'
import { canPublish, isAdmin, noone } from '../access'

/**
 * Contact-form submissions.
 *
 * Approved in cms_architecture.md §18 decision 5, which pulled India's DPDP
 * Act 2023 obligations into scope. This collection therefore holds real PII and
 * is built accordingly:
 *
 *   create   — closed to the API entirely. The site's own /api/contact route
 *              writes through the Local API with overrideAccess, so there is no
 *              public write path for anyone to stuff the CRM through.
 *   read     — staff only. Never public, never unauthenticated.
 *   delete   — admin only, and every deletion is logged.
 *   purgeAt  — set at insert, enforced by a nightly job. Retention is code,
 *              not a policy document nobody reads.
 *   consentText — stores the exact wording shown at submission time, so when
 *              the form copy changes next year you can still prove what this
 *              person actually agreed to.
 *   ipHash   — salted SHA-256. The raw IP is never stored.
 */

/** §13.4: 24 months. */
export const LEAD_RETENTION_MONTHS = 24

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    group: 'Administration',
    useAsTitle: 'email',
    defaultColumns: ['createdAt', 'firstName', 'email', 'company', 'status', 'owner'],
    description:
      'Contact-form submissions. Personal data — do not export or forward without a reason, and remember these are deleted automatically after 24 months.',
  },

  access: {
    create: noone,
    read: canPublish,
    update: canPublish,
    delete: isAdmin,
  },

  // Leads are records of an event, not editorial content. Versioning them would
  // defeat the retention guarantee: a purged row whose old values survive in a
  // versions table has not actually been deleted.
  versions: false,

  timestamps: true,

  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          const purge = new Date()
          purge.setMonth(purge.getMonth() + LEAD_RETENTION_MONTHS)
          data.purgeAt = purge.toISOString()
        }
        return data
      },
    ],
  },

  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'lastName', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea', required: true },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', description: 'Who is following this up.' },
    },
    {
      name: 'notes',
      type: 'array',
      fields: [
        { name: 'note', type: 'textarea', required: true },
        {
          name: 'at',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Provenance & consent',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'sourcePath',
          type: 'text',
          admin: { readOnly: true, description: 'The page the form was submitted from.' },
        },
        {
          name: 'consentGivenAt',
          type: 'date',
          admin: {
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'consentText',
          type: 'textarea',
          admin: {
            readOnly: true,
            description:
              'The exact consent wording displayed when this was submitted. Kept verbatim so a later copy change cannot rewrite history.',
          },
        },
        {
          name: 'ipHash',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'Salted hash for abuse investigation. The raw IP is never stored.',
          },
        },
        {
          name: 'purgeAt',
          type: 'date',
          admin: {
            readOnly: true,
            position: 'sidebar',
            date: { pickerAppearance: 'dayAndTime' },
            description: `Automatically deleted on this date (${LEAD_RETENTION_MONTHS} months after submission).`,
          },
        },
      ],
    },
  ],
}

export default Leads
