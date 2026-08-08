import type { CollectionConfig } from 'payload'
import { canEditContent, canPublish, isAdmin, publishedOnly } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { versioned, orderField, enforcePublishPermission } from '../fields/publishing'
import { revalidate } from '../hooks/revalidate'

/**
 * The ten capabilities.
 *
 * `src/data/services.js` and `src/data/serviceExperience.js` merge into this
 * one collection. In the old repo they were two arrays joined by slug, which
 * meant a renamed slug silently dropped a service's problem/outcome copy with
 * nothing to catch it. One record per service removes that failure mode.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'navLabel', 'order', '_status'],
    livePreview: {
      url: ({ data }) => `${process.env.SITE_URL}/services#${data?.slug}`,
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
    afterChange: [revalidate(['services', 'navigation'])],
    afterDelete: [revalidate(['services', 'navigation'])],
  },
  fields: [
    orderField,
    slugField('title'),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'desc',
              type: 'textarea',
              required: true,
              admin: { description: 'One line. Shown on the service card and in the nav dropdown.' },
            },
            {
              name: 'navLabel',
              type: 'text',
              admin: {
                description:
                  'Short label for the /services navigator rail. Falls back to the title if blank.',
              },
            },
            {
              name: 'icon',
              type: 'text',
              admin: { description: 'Icon key resolved by the site. Leave blank for the default.' },
            },
          ],
        },
        {
          label: 'Narrative',
          description: 'The Problem -> Solution -> Outcome sequence the /services page renders.',
          fields: [
            {
              name: 'problem',
              type: 'textarea',
              admin: { description: 'The situation the client is in before this service.' },
            },
            {
              name: 'outcome',
              type: 'textarea',
              admin: { description: 'What is true afterwards.' },
            },
            {
              name: 'ctaLabel',
              type: 'text',
              admin: { description: 'Inline CTA in this service’s own voice, e.g. "Build My AI Workforce".' },
            },
            {
              name: 'visual',
              type: 'select',
              options: [
                { label: 'Neural AI Core', value: 'ai-core' },
                { label: 'Communication Hub', value: 'communication-hub' },
                { label: 'Workflow Engine', value: 'workflow-engine' },
                { label: 'Enterprise Dashboard', value: 'enterprise-dashboard' },
                { label: 'Business Network', value: 'business-network' },
                { label: 'Document Scanner', value: 'document-scanner' },
                { label: 'Analytics Sphere', value: 'analytics-sphere' },
              ],
              admin: {
                description:
                  'Which 3D visualisation plays alongside this service. These are built components — pick one that exists.',
              },
            },
            {
              name: 'system',
              type: 'text',
              admin: { description: 'The label overlaid on the visualisation, e.g. "Neural AI Core".' },
            },
          ],
        },
        {
          label: 'Detail page',
          description: 'Only used once /services/[slug] pages exist. Safe to leave empty.',
          fields: [
            {
              name: 'body',
              type: 'richText',
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}

export default Services
