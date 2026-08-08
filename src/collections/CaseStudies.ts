import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin, publishedOnly } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { versioned, orderField, enforcePublishPermission } from '../fields/publishing'
import { revalidate } from '../hooks/revalidate'

/**
 * The /work page.
 *
 * `PRODUCTION_PROJECTS` and `DEVELOPMENT_PROJECTS` were two arrays with
 * different shapes — production had `client` and `impact`, development had
 * `phase` and `stack`. One collection with a `stage` discriminator, because
 * they are the same thing at different maturity and the site renders them in
 * two rows off one query.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'stage', 'client', 'order', '_status'],
    livePreview: {
      url: ({ data }) => `${process.env.SITE_URL}/work#${data?.slug}`,
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
    afterChange: [revalidate(['case-studies'])],
    afterDelete: [revalidate(['case-studies'])],
  },
  fields: [
    orderField,
    slugField('title'),
    {
      name: 'stage',
      type: 'select',
      required: true,
      defaultValue: 'production',
      options: [
        { label: 'In production — live client system', value: 'production' },
        { label: 'In development — alpha or beta', value: 'development' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'title', type: 'text', required: true },
    {
      name: 'desc',
      type: 'textarea',
      required: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      admin: {
        description:
          'Optional. Only link a named client where you have permission to name them publicly.',
      },
    },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
      admin: { description: 'Shown as the sector label where no client is named.' },
    },
    {
      name: 'impact',
      type: 'text',
      admin: {
        description: 'Production only, e.g. "40% Admin Reduction". A public claim — keep it defensible.',
        condition: (data) => data?.stage === 'production',
      },
    },
    {
      name: 'phase',
      type: 'text',
      admin: {
        description: 'Development only, e.g. "Alpha Testing".',
        condition: (data) => data?.stage === 'development',
      },
    },
    {
      name: 'stack',
      type: 'array',
      labels: { singular: 'Technology', plural: 'Stack' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'metrics',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    { name: 'body', type: 'richText' },
    seoField,
  ],
}

export default CaseStudies
