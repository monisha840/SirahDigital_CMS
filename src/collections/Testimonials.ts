import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin, publishedOnly } from '../access'
import { versioned, orderField, enforcePublishPermission } from '../fields/publishing'
import { revalidate } from '../hooks/revalidate'

/**
 * Client testimonials. New — the site has none today.
 *
 * A testimonial is a public claim attributed to a named person, so the fields
 * lean towards attribution: an unattributed quote reads as invented, and
 * `sourceUrl` is what lets someone check it. Keep `consentOnFile` honest — it
 * is there so nobody has to reconstruct permission from memory a year later.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Content',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'authorCompany', 'featured', 'order', '_status'],
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
    afterChange: [revalidate(['testimonials'])],
    afterDelete: [revalidate(['testimonials'])],
  },
  fields: [
    orderField,
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Testimonial walls with no hand-picked list show every featured entry.',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: 'Their words, not ours. Trim for length; do not rewrite for tone.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'authorName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'authorRole', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'authorCompany', type: 'text', admin: { width: '50%' } },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: { width: '50%', description: 'Optional, 1-5.' },
        },
      ],
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      admin: { description: 'Links the testimonial to the client record, so the logo can be shown.' },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: { description: 'Google review, LinkedIn post, email thread reference — wherever it came from.' },
    },
    {
      name: 'consentOnFile',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Tick only if this person has agreed in writing to being quoted publicly by name.',
      },
    },
  ],
}

export default Testimonials
