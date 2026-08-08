import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin, publishedOnly } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { versioned, statusGate } from '../fields/publishing'
import { revalidate } from '../hooks/revalidate'
import { pageSections } from '../blocks'

/**
 * Generic composed pages: /privacy, /terms, and anything the team invents
 * later — a campaign landing page, an event page, a hiring page.
 *
 * This is where "add a page without a developer" actually lives. The route
 * `/[slug]` on the site renders whatever blocks are in `sections`.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt', '_status'],
    livePreview: {
      url: ({ data }) => `${process.env.SITE_URL}/${data?.slug}`,
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
    afterChange: [revalidate(['pages'])],
    afterDelete: [revalidate(['pages'])],
  },
  fields: [
    statusGate,
    slugField('title'),
    { name: 'title', type: 'text', required: true },
    {
      name: 'showInSitemap',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        { label: 'Sections', fields: [pageSections] },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}

export default Pages
