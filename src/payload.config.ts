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
import { Testimonials } from './collections/Testimonials'
import { Pages } from './collections/Pages'
import { Leads } from './collections/Leads'
import { Bookings } from './collections/Bookings'
import { Slots } from './collections/Slots'
import { syncBookingsTask } from './jobs/syncBookings'
import { Clients, Team, Insights, CarouselCards, Redirects } from './collections/Simple'
import { ALL_GLOBALS } from './globals'
import { siteBundle, health, purgeLeads, leadIntake, syncBookings } from './endpoints'
import { slotEndpoints } from './endpoints/slots'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
const CMS_URL = process.env.CMS_URL || 'http://localhost:3001'

/*
 * Origins allowed to drive an authenticated admin session (see cors/csrf).
 *
 * Full origins — scheme included, no trailing slash — unlike ADMIN_HOSTS in
 * next.config.mjs, which takes bare hostnames. Falls back to the two local
 * dev URLs so a fresh checkout works with nothing set.
 */
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || `${SITE_URL},${CMS_URL}`)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

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

  /*
   * next.config.mjs sets `basePath: '/admin'`, which already prefixes every
   * URL this app serves. Leaving routes.admin at its '/admin' default would
   * stack a second one and put the panel at /admin/admin.
   *
   * Consequence for the file tree: route folders under src/app/(payload)
   * mirror these values, so the admin pages live at (payload)/[[...segments]]
   * rather than (payload)/admin/[[...segments]]. routes.api stays '/api' and
   * (payload)/api is untouched — basePath makes it /admin/api on the wire.
   */
  routes: { admin: '/' },

  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },

    /*
     * White-labelling.
     *
     * Payload ships its own wordmark on the login screen and its cube in the
     * nav. This is a tool the Sirah team uses every day and the vendor's brand
     * on it only ever prompts "what is Payload?" — so both graphics are
     * replaced, along with the tab title and the favicon.
     *
     * Component paths resolve against `importMap.baseDir` (src), and the admin
     * loads them through the generated import map rather than a plain import.
     * Re-run `npx payload generate:importmap` after touching either one.
     */
    components: {
      graphics: {
        Logo: '/components/graphics/Logo#Logo',
        Icon: '/components/graphics/Icon#Icon',
      },

      /*
       * The Availability screen — the SlotCalendar the booking page reads from.
       *
       * A custom view rather than a field on a collection, because managing
       * availability is a calendar task: "which Tuesdays in March are open" is
       * one glance here and thirty rows in a list view. The `slots` collection
       * is still registered and still browsable for one-off corrections; this is
       * the screen anyone should normally use.
       */
      views: {
        availability: {
          Component: '/components/admin/AvailabilityView#AvailabilityView',
          path: '/availability',
        },
      },

      // Custom views are routes, not collections, so nothing links to them by
      // default. Without this the screen is reachable only by typing the URL.
      afterNavLinks: ['/components/admin/AvailabilityNavLink#AvailabilityNavLink'],
    },
    meta: {
      titleSuffix: '— Sirah CMS',

      /*
       * Icon URLs are passed through verbatim and resolved against
       * metadataBase, which Payload sets from serverURL — the apex. A bare
       * '/favicon.svg' therefore resolves to sirahdigital.in/favicon.svg and
       * lands on the public site, not here. The /admin prefix is explicit
       * because basePath does not rewrite strings inside config values.
       */
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/admin/favicon.svg' }],

      /*
       * Default is 'dynamic', which points og:image at an un-prefixed
       * /api/og?… — again the site's origin, again a 404. Nothing needs a
       * preview image for a noindex admin panel, so turn it off rather than
       * prefix it.
       */
      defaultOGImageType: 'off',
      /*
       * Without these two, every admin page ships Payload's stock description
       * ("Payload is a headless CMS and application framework built with
       * TypeScript…") in its og: and twitter: tags. Nobody indexes this — the
       * route is noindex — but paste an admin link into WhatsApp or Slack and
       * that sentence is the preview card the team sees.
       */
      description: 'Content management for sirahdigital.in.',
      openGraph: {
        title: 'Sirah CMS',
        description: 'Content management for sirahdigital.in.',
        siteName: 'Sirah CMS',
      },
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
    // Library + admin
    Media,
    Redirects,
    Leads,
    Bookings,
    Slots,
    Users,
  ],

  globals: ALL_GLOBALS,

  editor: lexicalEditor(),

  /*
   * The last piece of vendor branding lives in the translation bundle: the
   * account menu item reads "Payload Settings". Overriding one key is enough —
   * everything not listed here falls back to Payload's own English strings.
   */
  i18n: {
    translations: {
      en: {
        general: {
          payloadSettings: 'Sirah CMS Settings',
        },
      },
    },
  },

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

      /*
       * node-postgres defaults to 10 connections per pool. On Vercel that is
       * 10 per *lambda instance*, and instances scale with traffic — a busy
       * minute exhausts Supabase's connection limit and every request starts
       * failing at once. Capping it keeps a traffic spike from taking the
       * database down; Supabase's pooler does the real multiplexing.
       *
       * Not 1, though — that deadlocks. Payload opens a transaction and then
       * issues further queries inside it, so a single-connection pool waits
       * on itself forever: the response streams its head and then hangs with
       * nothing in the log. 5 leaves room for that nesting and is still well
       * under the default.
       */
      max: 5,
      idleTimeoutMillis: 10_000,
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
   *
   * Env-driven rather than [SITE_URL, CMS_URL], because in production both of
   * those hold the same value — the apex — and the list would then contain no
   * allowance for any other origin the admin is legitimately served from
   * (a staging host, a preview deployment). Payload rejects the session cookie
   * outright when Origin is absent from `csrf`, and the symptom is a login
   * that appears to succeed and then bounces straight back with no error.
   */
  cors: ALLOWED_ORIGINS,
  csrf: ALLOWED_ORIGINS,

  endpoints: [siteBundle, health, purgeLeads, leadIntake, syncBookings, ...slotEndpoints],

  /*
   * Scheduled publishing and the booking sync both run on Payload's job queue.
   *
   * `autoRun` is the runner: every minute it picks up whatever is queued. The
   * booking task queues *itself* on its own five-minute schedule (see
   * jobs/syncBookings.ts), which is why booking reminders need no external cron —
   * they work on a bare deploy with nothing else configured.
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
    tasks: [syncBookingsTask],

    /*
     * Local dev only. `autoRun` needs a process that stays alive between
     * ticks, and Vercel has none — worse, if two lambdas did stay warm they
     * would each run the scheduler and race for the same jobs.
     *
     * In production the queue is driven externally instead: Supabase pg_cron
     * hits GET /admin/api/payload-jobs/run with the CRON_SECRET bearer that
     * `access.run` above already accepts. That endpoint calls handleSchedules
     * first, so the one cron covers both scheduled publishing and
     * syncBookingsTask's own five-minute self-scheduling.
     */
    autoRun: process.env.VERCEL
      ? []
      : [
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
