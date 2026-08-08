import type { Block, Field } from 'payload'

/**
 * The block library — the mechanism behind "new sections without code changes"
 * (cms_architecture.md §7).
 *
 * Each block here has a matching React component on the site, registered in
 * `src/components/blocks/registry.js`. The contract is the `slug` below: it is
 * the key the renderer switches on, so renaming one orphans every page that
 * uses it. Add blocks freely; rename them never.
 *
 * What this buys, precisely:
 *   - adding a section to a page        -> drag and drop, no deploy
 *   - reordering or removing a section  -> drag and drop, no deploy
 *   - adding a field to a block         -> one entry below, no hand-written migration
 *   - inventing a visually new block    -> a React component. Unavoidable.
 *
 * That last line is the honest boundary. No CMS generates a design that does
 * not exist yet.
 */

/** Shared heading/intro pair, used by most blocks. */
const sectionHeader: Field[] = [
  { name: 'heading', type: 'text' },
  { name: 'intro', type: 'textarea' },
]

const anchorField: Field = {
  name: 'anchor',
  type: 'text',
  admin: {
    position: 'sidebar',
    description: 'Optional #id so this section can be deep-linked.',
  },
}

const linkFields: Field[] = [
  { name: 'ctaLabel', type: 'text' },
  {
    name: 'ctaHref',
    type: 'text',
    admin: { description: 'Internal path like /contact, or a full https:// URL.' },
  },
]

// ── Blocks ────────────────────────────────────────────────────────────────

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    anchorField,
    { name: 'eyebrow', type: 'text', admin: { description: 'Small uppercase line above the headline.' } },
    { name: 'heading', type: 'text', required: true },
    { name: 'sub', type: 'textarea' },
    ...linkFields,
    { name: 'secondaryCtaLabel', type: 'text' },
    { name: 'secondaryCtaHref', type: 'text' },
    { name: 'media', type: 'upload', relationTo: 'media' },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    anchorField,
    { name: 'content', type: 'richText', required: true },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Prose (860px — readable measure)', value: 'prose' },
        { label: 'Wide (1152px)', value: 'wide' },
        { label: 'Full bleed', value: 'full' },
      ],
    },
  ],
}

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  labels: { singular: 'Product Grid', plural: 'Product Grids' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { description: 'Leave empty to show every published product in its set order.' },
    },
  ],
}

export const ServiceChaptersBlock: Block = {
  slug: 'serviceChapters',
  labels: { singular: 'Service Chapters', plural: 'Service Chapters' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Leave empty to show all published services in their set order.' },
    },
  ],
}

export const IndustryOrbitBlock: Block = {
  slug: 'industryOrbit',
  labels: { singular: 'Industry Orbit', plural: 'Industry Orbits' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'industries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
      admin: { description: 'Leave empty to show all twelve.' },
    },
  ],
}

export const ClientMarqueeBlock: Block = {
  slug: 'clientMarquee',
  labels: { singular: 'Client Marquee', plural: 'Client Marquees' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      admin: { description: 'Leave empty to show every client marked Featured.' },
    },
  ],
}

export const TestimonialWallBlock: Block = {
  slug: 'testimonialWall',
  labels: { singular: 'Testimonial Wall', plural: 'Testimonial Walls' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { description: 'Leave empty to show every testimonial marked Featured.' },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Single quote', value: 'single' },
      ],
    },
  ],
}

export const InsightsCarouselBlock: Block = {
  slug: 'insightsCarousel',
  labels: { singular: 'Insights Carousel', plural: 'Insights Carousels' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'insights',
      type: 'relationship',
      relationTo: 'insights',
      hasMany: true,
    },
    { name: 'exploreMoreHref', type: 'text', admin: { description: 'Where the closing tile goes.' } },
  ],
}

export const PostsFeedBlock: Block = {
  slug: 'postsFeed',
  labels: { singular: 'Blog Feed', plural: 'Blog Feeds' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'latest',
      options: [
        { label: 'Latest posts', value: 'latest' },
        { label: 'Featured posts', value: 'featured' },
        { label: 'Hand-picked', value: 'manual' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      admin: { condition: (_, s) => s?.mode !== 'manual' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { condition: (_, s) => s?.mode === 'latest' },
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: { condition: (_, s) => s?.mode === 'manual' },
    },
  ],
}

export const TransformationStoryBlock: Block = {
  slug: 'transformationStory',
  labels: { singular: 'Transformation Story', plural: 'Transformation Stories' },
  admin: {
    // The scenes themselves are a global, not per-instance content: the story
    // is the same wherever it is placed, and duplicating it per page would
    // guarantee the two copies drift.
    group: 'Site-wide content',
  },
  fields: [
    anchorField,
    {
      name: 'placementNote',
      type: 'text',
      admin: {
        readOnly: true,
        description:
          'Scene copy is edited once under Globals -> Transformation Story. This block only places it.',
      },
    },
  ],
}

export const RoiCalculatorBlock: Block = {
  slug: 'roiCalculator',
  labels: { singular: 'ROI Calculator', plural: 'ROI Calculators' },
  fields: [anchorField, ...sectionHeader],
}

export const PerspectiveCarouselBlock: Block = {
  slug: 'perspectiveCarousel',
  labels: { singular: 'Photo Carousel', plural: 'Photo Carousels' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'cards',
      type: 'relationship',
      relationTo: 'carousel-cards',
      hasMany: true,
      admin: {
        description:
          'Leave empty to use all cards. Keep the count odd so one card sits dead centre; nine is the practical minimum.',
      },
    },
  ],
}

export const MethodologyBlock: Block = {
  slug: 'methodologyJourney',
  labels: { singular: 'Methodology', plural: 'Methodology' },
  fields: [anchorField, ...sectionHeader],
}

export const StatBandBlock: Block = {
  slug: 'statBand',
  labels: { singular: 'Stat Band', plural: 'Stat Bands' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'stats',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const LogoWallBlock: Block = {
  slug: 'logoWall',
  labels: { singular: 'Logo Wall', plural: 'Logo Walls' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'logos',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'desc', type: 'text', admin: { description: 'Four or five words — longer breaks the row.' } },
      ],
    },
  ],
}

export const CtaBandBlock: Block = {
  slug: 'ctaBand',
  labels: { singular: 'CTA Band', plural: 'CTA Bands' },
  fields: [
    anchorField,
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    ...linkFields,
  ],
}

export const TeamGridBlock: Block = {
  slug: 'teamGrid',
  labels: { singular: 'Team Grid', plural: 'Team Grids' },
  fields: [
    anchorField,
    ...sectionHeader,
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
      admin: { description: 'Leave empty to show everyone in their set order.' },
    },
  ],
}

export const SpacerBlock: Block = {
  slug: 'spacer',
  labels: { singular: 'Spacer', plural: 'Spacers' },
  fields: [
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
  ],
}

export const ALL_BLOCKS: Block[] = [
  HeroBlock,
  RichTextBlock,
  ProductGridBlock,
  ServiceChaptersBlock,
  IndustryOrbitBlock,
  ClientMarqueeBlock,
  TestimonialWallBlock,
  InsightsCarouselBlock,
  PostsFeedBlock,
  TransformationStoryBlock,
  RoiCalculatorBlock,
  PerspectiveCarouselBlock,
  MethodologyBlock,
  StatBandBlock,
  LogoWallBlock,
  FaqBlock,
  TimelineBlock,
  CtaBandBlock,
  TeamGridBlock,
  SpacerBlock,
]

/** The composable section array, reused by Pages, Products and the Homepage global. */
export const pageSections: Field = {
  name: 'sections',
  type: 'blocks',
  blocks: ALL_BLOCKS,
  admin: {
    initCollapsed: true,
    description: 'Compose the page. Drag to reorder; collapse to see the running order at a glance.',
  },
}
