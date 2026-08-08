import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin, publishedOnly } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { versioned, statusGate, orderField } from '../fields/publishing'
import { revalidate } from '../hooks/revalidate'

/**
 * The straightforward collections, grouped in one file because each is a
 * handful of fields and a page of boilerplate per record would bury them.
 * Anything with real behaviour (Posts, Industries, Media, Leads) gets its own.
 */

const socialsField = {
  name: 'socials',
  type: 'array' as const,
  labels: { singular: 'Profile', plural: 'Profiles' },
  fields: [
    {
      name: 'label',
      type: 'select' as const,
      required: true,
      options: ['LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube', 'WhatsApp', 'GitHub'],
    },
    { name: 'href', type: 'text' as const, required: true },
  ],
}

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { group: 'Blog', useAsTitle: 'name', defaultColumns: ['name', 'role'] },
  versions: versioned,
  access: { read: publishedOnly, create: canEditContent, update: canEditContent, delete: isAdmin },
  hooks: { afterChange: [revalidate(['authors'])], afterDelete: [revalidate(['authors'])] },
  fields: [
    statusGate,
    slugField('name'),
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'teamMember',
      type: 'relationship',
      relationTo: 'team',
      admin: { description: 'Optional link to the team record, so a bio is written once.' },
    },
    socialsField,
  ],
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { group: 'Blog', useAsTitle: 'name', defaultColumns: ['name', 'slug'] },
  access: { read: () => true, create: canEditContent, update: canEditContent, delete: isAdmin },
  hooks: { afterChange: [revalidate(['categories'])], afterDelete: [revalidate(['categories'])] },
  fields: [
    slugField('name'),
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'color',
      type: 'text',
      admin: { description: 'Hex accent for the category chip. Blank uses the brand cyan.' },
    },
    seoField,
  ],
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: { group: 'Content', useAsTitle: 'name', defaultColumns: ['name', 'featured', 'order', '_status'] },
  versions: versioned,
  access: { read: publishedOnly, create: canEditContent, update: canEditContent, delete: isAdmin },
  hooks: { afterChange: [revalidate(['clients'])], afterDelete: [revalidate(['clients'])] },
  fields: [
    statusGate,
    orderField,
    slugField('name'),
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional. Without one the marquee draws the client name as a wordmark, which is on-brief rather than a placeholder. The tile flattens whatever it is given to a single colour.',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description:
          'Optional. With a URL the tile becomes a link. Leave blank rather than guessing — a marquee of wrong links is worse than one of none.',
      },
    },
    { name: 'industry', type: 'relationship', relationTo: 'industries' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Shown in the Trusted Across Industries marquee.' },
    },
  ],
}

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Team Member', plural: 'Team' },
  admin: { group: 'Content', useAsTitle: 'name', defaultColumns: ['name', 'role', 'isFounder', 'order'] },
  versions: versioned,
  access: { read: publishedOnly, create: canEditContent, update: canEditContent, delete: isAdmin },
  hooks: { afterChange: [revalidate(['team'])], afterDelete: [revalidate(['team'])] },
  fields: [
    statusGate,
    orderField,
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'A missing photo falls back to an initials badge rather than a broken image.' },
    },
    {
      name: 'isFounder',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Renders in the founder panel rather than the team grid.' },
    },
    socialsField,
  ],
}

export const Insights: CollectionConfig = {
  slug: 'insights',
  labels: { singular: 'Insight', plural: 'Insights' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', 'order', '_status'],
    description: 'The video/media carousel. For written articles use Blog -> Posts instead.',
  },
  versions: versioned,
  access: { read: publishedOnly, create: canEditContent, update: canEditContent, delete: isAdmin },
  hooks: { afterChange: [revalidate(['insights'])], afterDelete: [revalidate(['insights'])] },
  fields: [
    statusGate,
    orderField,
    { name: 'title', type: 'text', required: true },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          '16:10 or wider. The card frame is 16:10 and trims the sides. Without one the card shows a neutral plate of the same shape.',
      },
    },
    { name: 'youtubeUrl', type: 'text' },
    {
      name: 'category',
      type: 'text',
      admin: { description: 'Not currently rendered — the card shows cover plus title. Kept for a future layout.' },
    },
    { name: 'description', type: 'textarea', admin: { description: 'Not currently rendered. See above.' } },
    {
      type: 'row',
      fields: [
        { name: 'duration', type: 'text', admin: { width: '50%', description: 'e.g. 14:20' } },
        { name: 'date', type: 'text', admin: { width: '50%', description: 'e.g. Oct 2024' } },
      ],
    },
    {
      name: 'theme',
      type: 'text',
      admin: { description: 'Visual theme key resolved by the site, e.g. "network".' },
    },
  ],
}

export const CarouselCards: CollectionConfig = {
  slug: 'carousel-cards',
  labels: { singular: 'Carousel Card', plural: 'Carousel Cards' },
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'title', 'order', '_status'],
    description:
      'The homepage 3D carousel. Portrait 5:7 — the focal point handles the crop, so a source that is not exactly 5:7 no longer has to be cut by hand.',
  },
  versions: versioned,
  access: { read: publishedOnly, create: canEditContent, update: canEditContent, delete: isAdmin },
  hooks: { afterChange: [revalidate(['carousel-cards'])], afterDelete: [revalidate(['carousel-cards'])] },
  fields: [
    statusGate,
    orderField,
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describes the photograph for screen readers.' },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description:
          'Optional. A caption panel covers the bottom third of the card — the team photographs deliberately carry none.',
      },
    },
    { name: 'desc', type: 'text', admin: { description: 'One short line under the heading.' } },
    {
      name: 'href',
      type: 'text',
      admin: {
        description: 'With a link a click navigates; without one a click brings the card round to the centre.',
      },
    },
    { name: 'ctaLabel', type: 'text', admin: { description: 'Defaults to "Explore".' } },
  ],
}

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    group: 'Administration',
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'permanent'],
    description:
      'Served by the site middleware, so a redirect goes live without a deploy — unlike the ones hardcoded in next.config.js.',
  },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { afterChange: [revalidate(['redirects'])], afterDelete: [revalidate(['redirects'])] },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Path only, with a leading slash, e.g. /old-page' },
      validate: (value: string | null | undefined) =>
        typeof value === 'string' && value.startsWith('/')
          ? true
          : 'Must be a path starting with "/" — full URLs cannot be matched here.',
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'A path like /services, or a full https:// URL to send traffic off-site.' },
    },
    {
      name: 'permanent',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          '308 permanent. Browsers cache these hard — use a temporary redirect while you are still deciding.',
      },
    },
  ],
}
