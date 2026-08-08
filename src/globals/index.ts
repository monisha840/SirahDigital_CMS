import type { GlobalConfig } from 'payload'
import { canEditContent, canPublish, isAdmin, publishedOnly } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'
import { pageSections } from '../blocks'
import { versioned } from '../fields/publishing'

/**
 * Globals — one record each. Settings and site-wide content that has exactly
 * one correct value, so it cannot drift between copies.
 */

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings' },
  versions: versioned,
  access: { read: () => true, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal(['site-settings'])] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            { name: 'name', type: 'text', required: true, defaultValue: 'SIRAH DIGITAL' },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { description: 'Canonical origin, no trailing slash. Feeds metadataBase and the sitemap.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
                { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
            {
              name: 'phoneHref',
              type: 'text',
              admin: { description: 'tel: link, digits only, e.g. tel:+919789961631' },
            },
            {
              name: 'address',
              type: 'array',
              labels: { singular: 'Line', plural: 'Address lines' },
              fields: [{ name: 'line', type: 'text', required: true }],
              admin: { description: 'One entry per line as the footer should break it.' },
            },
            {
              name: 'addressOneLine',
              type: 'text',
              admin: { description: 'Single-line form for schema.org and the contact page.' },
            },
            { name: 'blurb', type: 'textarea' },
            { name: 'tagline', type: 'text' },
          ],
        },
        {
          label: 'Brand',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'socials',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
                {
                  name: 'iconPath',
                  type: 'textarea',
                  admin: {
                    description:
                      'Raw SVG path data for the icon. Path data only — not a full <svg> element, which would be a script vector.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            { name: 'gtmId', type: 'text', admin: { description: 'GTM-XXXXXXX. Blank disables the tag.' } },
            { name: 'gaId', type: 'text', admin: { description: 'G-XXXXXXXXXX' } },
          ],
        },
      ],
    },
  ],
}

export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO Defaults',
  admin: { group: 'Settings' },
  versions: versioned,
  access: { read: () => true, update: canPublish },
  hooks: { afterChange: [revalidateGlobal(['seo-defaults'])] },
  fields: [
    {
      name: 'titleTemplate',
      type: 'text',
      defaultValue: '%s | Sirah Digital',
      admin: { description: '%s is replaced by each page’s own title.' },
    },
    { name: 'defaultTitle', type: 'text', required: true },
    { name: 'defaultDescription', type: 'textarea', required: true },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    {
      name: 'robotsDisallow',
      type: 'array',
      fields: [{ name: 'path', type: 'text', required: true }],
      admin: { description: 'Paths kept out of robots.txt, e.g. /api/ and /animations' },
    },
    {
      name: 'organizationJsonLd',
      type: 'json',
      admin: {
        description:
          'Optional schema.org Organization override. Left blank, the site builds one from Company settings.',
      },
    },
  ],
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Settings' },
  versions: versioned,
  access: { read: () => true, update: canPublish },
  hooks: { afterChange: [revalidateGlobal(['navigation'])] },
  fields: [
    {
      name: 'header',
      type: 'array',
      labels: { singular: 'Link', plural: 'Header links' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Sub-link', plural: 'Dropdown' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'headerCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'legacyAnchors',
      type: 'array',
      labels: { singular: 'Anchor', plural: 'Legacy anchors' },
      admin: {
        description:
          'Old single-page anchors mapped to the routes that replaced them. A URL fragment is never sent to the server, so the homepage resolves these on the client.',
      },
      fields: [
        { name: 'from', type: 'text', required: true, admin: { description: 'e.g. #offer' } },
        { name: 'to', type: 'text', required: true, admin: { description: 'e.g. /services' } },
      ],
    },
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  versions: versioned,
  access: { read: () => true, update: canPublish },
  hooks: { afterChange: [revalidateGlobal(['footer'])] },
  fields: [
    { name: 'blurb', type: 'textarea' },
    {
      name: 'columns',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      admin: { description: 'The year is inserted by the site — do not hardcode it here.' },
    },
    { name: 'showSocials', type: 'checkbox', defaultValue: true },
  ],
}

export const Methodology: GlobalConfig = {
  slug: 'methodology',
  admin: { group: 'Site-wide content' },
  versions: versioned,
  access: { read: publishedOnly, update: canEditContent },
  hooks: { afterChange: [revalidateGlobal(['methodology'])] },
  fields: [
    {
      name: 'pillars',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: { description: 'The three pillars behind how the work gets delivered.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'desc', type: 'textarea', required: true },
        {
          name: 'accent',
          type: 'text',
          admin: { description: 'Tailwind colour class. One accent across all three — the colour never encoded anything.' },
        },
      ],
    },
  ],
}

export const TransformationStory: GlobalConfig = {
  slug: 'transformation-story',
  label: 'Transformation Story',
  admin: {
    group: 'Site-wide content',
    description:
      'The homepage before/after narrative. Carries specific public claims — confirm every figure before publishing.',
  },
  versions: versioned,
  access: { read: publishedOnly, update: canEditContent },
  hooks: { afterChange: [revalidateGlobal(['transformation-story'])] },
  fields: [
    {
      name: 'sceneMs',
      type: 'number',
      defaultValue: 3000,
      admin: {
        description:
          'Milliseconds per scene. Feeds both the autoplay timeout and the progress bar — one source of truth.',
      },
    },
    {
      name: 'scenes',
      type: 'array',
      fields: [
        { name: 'sceneId', type: 'text', required: true, admin: { description: 'Stable key, e.g. "chaos".' } },
        {
          type: 'row',
          fields: [
            { name: 'tab', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'tabLong', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'phase', type: 'text' },
        {
          type: 'row',
          fields: [
            {
              name: 'accent',
              type: 'text',
              admin: { width: '50%', description: 'Story signal colour. May sit outside the brand palette.' },
            },
            { name: 'accentSoft', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        {
          name: 'points',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'status', type: 'text' },
        {
          name: 'statusTone',
          type: 'select',
          options: ['alert', 'neutral', 'positive'],
        },
      ],
    },
  ],
}

export const RoiConfig: GlobalConfig = {
  slug: 'roi-config',
  label: 'ROI Calculator',
  admin: {
    group: 'Site-wide content',
    description:
      'Drives numbers a prospect reads as a forecast. Every coefficient should be one you can defend publicly.',
  },
  versions: versioned,
  access: { read: publishedOnly, update: canPublish },
  hooks: { afterChange: [revalidateGlobal(['roi-config'])] },
  fields: [
    {
      name: 'industries',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'industryId', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'automationFit',
              type: 'number',
              required: true,
              admin: { width: '33%', description: 'Multiplier, e.g. 1.12' },
            },
            {
              name: 'dealValue',
              type: 'number',
              required: true,
              admin: { width: '33%', description: 'Average value of one converted enquiry.' },
            },
            {
              name: 'baseConversion',
              type: 'number',
              required: true,
              admin: { width: '34%', description: '0-1, e.g. 0.22' },
            },
          ],
        },
        {
          name: 'recommendations',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'textarea',
      admin: {
        description:
          'Shown with the result. Do not remove — the figures are indicative and the calculator says so on purpose.',
      },
    },
  ],
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    group: 'Content',
    livePreview: { url: () => `${process.env.SITE_URL}/` },
  },
  versions: versioned,
  access: { read: publishedOnly, update: canEditContent },
  hooks: { afterChange: [revalidateGlobal(['homepage'])] },
  fields: [pageSections],
}

export const ALL_GLOBALS = [
  SiteSettings,
  SeoDefaults,
  Navigation,
  Footer,
  Homepage,
  Methodology,
  TransformationStory,
  RoiConfig,
]
