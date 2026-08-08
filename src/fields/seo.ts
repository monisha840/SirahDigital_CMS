import type { Field } from 'payload'

/**
 * Per-entry SEO overrides.
 *
 * Every field here is optional on purpose. Left blank, the site falls back to
 * the `seo-defaults` global and then to the entry's own title/excerpt, so a
 * page is never shipped with an empty <title> because somebody skipped a tab.
 * Filling these in is an override, not a requirement.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO & Social',
  admin: {
    description:
      'Optional. Blank fields fall back to the page title, the excerpt, and then site-wide defaults.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 70,
          admin: {
            width: '50%',
            description: 'Browser tab and search result heading. ~60 characters reads best.',
          },
        },
        {
          name: 'canonical',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Only if this content is duplicated elsewhere. Usually leave blank.',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'The grey line under the search result. ~155 characters before Google trims it.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'The preview shown when the link is shared. 1200x630. Falls back to the site default.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Hide from Google and drop from the sitemap. The page stays publicly reachable.',
      },
    },
  ],
}
