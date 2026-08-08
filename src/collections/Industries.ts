import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin, publishedOnly } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { versioned, orderField, enforcePublishPermission } from '../fields/publishing'
import { revalidate } from '../hooks/revalidate'

/**
 * The twelve sectors.
 *
 * Collapses three source modules into one record: `industries.js` (tile copy),
 * `industryIntelligence.js` (the explorer panel) and `industryWorkflows.js`
 * (the seven-step timeline). All three were keyed by slug, so a slug rename
 * used to break two of them silently. Here the slug is one column on one row.
 */
export const Industries: CollectionConfig = {
  slug: 'industries',
  labels: { singular: 'Industry', plural: 'Industries' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'tagline', 'order', '_status'],
    livePreview: {
      url: ({ data }) => `${process.env.SITE_URL}/industries/${data?.slug}`,
    },
  },
  versions: versioned,
  access: {
    read: publishedOnly,
    create: canEditContent,
    update: canEditContent,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [enforcePublishPermission],
    afterChange: [revalidate(['industries'])],
    afterDelete: [revalidate(['industries'])],
  },
  fields: [
    orderField,
    slugField('title'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Gallery tile',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'desc',
              type: 'textarea',
              required: true,
              admin: { description: 'One line under the sector name on the gallery tile.' },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Landscape. Tiles render up to 526px wide, so anything under ~1100px will soften on a retina screen.',
              },
            },
          ],
        },
        {
          label: 'Intelligence panel',
          fields: [
            {
              name: 'tagline',
              type: 'text',
              admin: { description: 'e.g. "Clinical Operations & Patient Flow".' },
            },
            {
              name: 'icon',
              type: 'text',
              admin: { description: 'Icon key. Defaults to the slug.' },
            },
            {
              name: 'accent',
              type: 'text',
              admin: {
                description:
                  'Hex colour cycling the brand ramp so neighbouring entries never match. Blank lets the site cycle it automatically.',
              },
            },
            {
              name: 'summary',
              type: 'textarea',
              admin: { description: 'The longer paragraph in the explorer detail panel.' },
            },
            {
              name: 'metric',
              type: 'group',
              fields: [
                { name: 'value', type: 'text', admin: { description: 'e.g. "64%"' } },
                { name: 'label', type: 'text', admin: { description: 'e.g. "Reduction in Admin Hours"' } },
              ],
              admin: {
                description:
                  'A public claim. Use a number you can stand behind — this is read as a forecast.',
              },
            },
            {
              name: 'outcomes',
              type: 'array',
              maxRows: 6,
              labels: { singular: 'Outcome', plural: 'Outcomes' },
              fields: [{ name: 'text', type: 'text', required: true }],
              admin: { description: 'Four reads best. The panel lays them out in two columns.' },
            },
            {
              name: 'guarantee',
              type: 'textarea',
              admin: { description: 'The delivery promise, pulled out as a quote.' },
            },
            {
              name: 'stack',
              type: 'array',
              labels: { singular: 'Tool', plural: 'Stack' },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Workflow timeline',
          description:
            'The seven-step sequence on the sector page. Icons are derived from the step title by the site — there is nothing to choose here.',
          fields: [
            {
              name: 'workflow',
              type: 'array',
              labels: { singular: 'Step', plural: 'Steps' },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'desc',
                  type: 'text',
                  admin: {
                    description:
                      'Four or five words. On desktop a node is ~150px wide; longer wraps to a third line and breaks the row.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Related',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              admin: { description: 'Optional. Surfaces service links on the sector page.' },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}

export default Industries
