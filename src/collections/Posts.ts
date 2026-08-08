import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin, publishedOnly } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { versioned, enforcePublishPermission } from '../fields/publishing'
import { revalidate } from '../hooks/revalidate'

/** Rough reading time from the Lexical AST. Counts text nodes, ignores markup. */
const countWords = (node: unknown): number => {
  if (!node || typeof node !== 'object') return 0
  const n = node as { text?: string; children?: unknown[] }
  let total = 0
  if (typeof n.text === 'string') total += n.text.trim().split(/\s+/).filter(Boolean).length
  if (Array.isArray(n.children)) total += n.children.reduce<number>((sum, c) => sum + countWords(c), 0)
  return total
}

/**
 * The blog. Entirely new — the site has no blog today.
 *
 * `publishedAt` is separate from Payload's own createdAt so a post can be
 * back-dated or scheduled without lying about when the row was made.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Blog',
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'category', 'publishedAt', '_status'],
    livePreview: {
      url: ({ data }) => `${process.env.SITE_URL}/blog/${data?.slug}`,
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
    afterChange: [revalidate(['posts'])],
    afterDelete: [revalidate(['posts'])],
    beforeChange: [
      enforcePublishPermission,
      ({ data }) => {
        // ~220 wpm is the usual estimate for technical prose.
        if (data?.body) {
          const words = countWords(data.body?.root ?? data.body)
          data.readingTime = Math.max(1, Math.round(words / 220))
        }
        // A post published without an explicit date gets today's.
        if (data?._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    slugField('title'),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description:
          'The date shown on the post. To schedule the post going live, use Publish -> Schedule instead.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Minutes. Calculated on save.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 300,
              admin: { description: 'The card summary and the SEO description fallback.' },
            },
            { name: 'cover', type: 'upload', relationTo: 'media' },
            { name: 'body', type: 'richText', required: true },
          ],
        },
        {
          label: 'Filing',
          fields: [
            { name: 'author', type: 'relationship', relationTo: 'authors' },
            { name: 'category', type: 'relationship', relationTo: 'categories' },
            {
              name: 'tags',
              type: 'array',
              fields: [{ name: 'tag', type: 'text', required: true }],
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_equals: id } }),
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}

export default Posts
