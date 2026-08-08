import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin, publishedOnly } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { versioned, orderField, enforcePublishPermission } from '../fields/publishing'
import { revalidate } from '../hooks/revalidate'
import { pageSections } from '../blocks'

/**
 * Aura Transcriber, Analytics Agents, NUSI.
 *
 * `src/data/products.js` carried a standing TODO: every `href` pointed at
 * /contact because no product had a page. `sections` here is what retires that
 * — a product can grow a real /products/[slug] page built from blocks, and the
 * homepage card starts linking to it instead of the enquiry form.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'hasPage', '_status'],
    livePreview: {
      url: ({ data }) => `${process.env.SITE_URL}/products/${data?.slug}`,
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
    afterChange: [revalidate(['products'])],
    afterDelete: [revalidate(['products'])],
  },
  fields: [
    orderField,
    slugField('title'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Homepage card',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Product',
              admin: { description: 'The small uppercase line above the title.' },
            },
            { name: 'title', type: 'text', required: true },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: { description: 'One paragraph. No marketing furniture.' },
            },
            {
              name: 'ctaLabel',
              type: 'text',
              defaultValue: 'Explore',
              admin: { description: 'The footer link text. The arrow is drawn by the component.' },
            },
            {
              name: 'hasPage',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Tick once this product has real page content below. The card then links to /products/<slug> instead of /contact.',
              },
            },
          ],
        },
        {
          label: 'Product page',
          description: 'Only rendered when "has page" is ticked.',
          fields: [
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'features',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'desc', type: 'textarea' },
                { name: 'icon', type: 'text' },
              ],
            },
            pageSections,
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}

export default Products
