import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Industries } from './collections/Industries'
import { Products } from './collections/Products'
import { CaseStudies } from './collections/CaseStudies'
import { Posts } from './collections/Posts'
import { Testimonials } from './collections/Testimonials'
import { Pages } from './collections/Pages'
import { Leads } from './collections/Leads'
import { Authors, Categories, Clients, Team, Insights, CarouselCards, Redirects } from './collections/Simple'
import { ALL_GLOBALS } from './globals'
import { siteBundle, health, purgeLeads } from './endpoints'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
const CMS_URL = process.env.CMS_URL || 'http://localhost:3001'

// Payload sets this while running migrate / generate:types.
const isMigrating = Boolean(process.env.PAYLOAD_MIGRATING)

/**
 * Media storage.
 *
 * With S3_BUCKET set, uploads go to R2/S3 and the site loads them from the CDN
 * origin. Without it, Payload falls back to local disk — fine for a first run
 * on a laptop, wrong for any deployed environment, because most hosts have an
 * ephemeral filesystem and the library would empty itself on restart.
 */
const storagePlugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: {
          media: {
            prefix: 'media',
            // Content-hashed keys make long-lived immutable caching safe.
            generateFileURL: ({ filename, prefix }) =>
              `${process.env.S3_PUBLIC_URL}/${prefix ? `${prefix}/` : ''}${filename}`,
          },
        },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || 'auto',
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
          // R2 and most S3-compatibles require path-style addressing.
          forcePathStyle: true,
        },
      }),
    ]
  : []

export default buildConfig({
  serverURL: CMS_URL,

  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— Sirah Digital CMS',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  collections: [
    // Content
    Pages,
    Services,
    Industries,
    Products,
    CaseStudies,
    Testimonials,
    Clients,
    Team,
    Insights,
    CarouselCards,
    // Blog
    Posts,
    Authors,
    Categories,
    // Library + admin
    Media,
    Redirects,
    Leads,
    Users,
  ],

  globals: ALL_GLOBALS,

  editor: lexicalEditor(),

  /*
   * Supabase Postgres.
   *
   * `DATABASE_URI_DIRECT` exists because Supabase's transaction pooler (port
   * 6543) does not support prepared statements or session state. Payload's
   * schema push and its migrations both need them, and fail against the pooler
   * with "prepared statement s0 already exists" — which reads like a bug in
   * your code rather than a connection-mode mismatch, and costs an afternoon.
   *
   * Using the session pooler / direct string (port 5432) for everything is the
   * simpler setup and what .env.example recommends. This split only matters if
   * the CMS is ever deployed somewhere serverless.
   */
  db: postgresAdapter({
    pool: {
      connectionString:
        (isMigrating && process.env.DATABASE_URI_DIRECT) || process.env.DATABASE_URI || '',
    },
    // Migrations are generated and reviewed in a PR, then applied on deploy.
    // Never let a production boot silently alter the schema.
    push: process.env.NODE_ENV !== 'production',
  }),

  sharp,

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  /*
   * CORS and CSRF are allowlists, not wildcards.
   *
   * A `*` here would let any origin drive an authenticated admin session from
   * a page the user happens to have open. Only the site and the CMS itself
   * ever legitimately call this API from a browser.
   */
  cors: [SITE_URL, CMS_URL],
  csrf: [SITE_URL, CMS_URL],

  endpoints: [siteBundle, health, purgeLeads],

  /*
   * Scheduled publishing runs on Payload's job queue.
   *
   * `autoRun` is a convenience for single-instance deploys. On a platform with
   * more than one instance, disable it and hit `/api/payload-jobs/run` from an
   * external cron instead, so two instances cannot claim the same job.
   */
  jobs: {
    access: {
      run: ({ req }) => {
        const auth = req.headers.get('authorization')
        if (auth === `Bearer ${process.env.CRON_SECRET}`) return true
        return Boolean(req.user)
      },
    },
    autoRun: [
      {
        // Every minute, per §8.
        cron: '* * * * *',
        limit: 20,
        queue: 'default',
      },
    ],
  },

  plugins: [...storagePlugins],

  graphQL: {
    disablePlaygroundInProduction: true,
  },

  telemetry: false,
})
