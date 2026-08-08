import type { Endpoint, PayloadRequest } from 'payload'
import { LEAD_RETENTION_MONTHS } from '../collections/Leads'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

/**
 * GET /api/site/bundle
 *
 * Everything the site needs that is small and read on nearly every page:
 * the globals plus the short collections. Without this the site makes a dozen
 * round-trips per build; with it, one.
 *
 * Deliberately excludes `posts`, `case-studies` and `media` — those are
 * unbounded and belong in their own paginated queries.
 */
export const siteBundle: Endpoint = {
  path: '/site/bundle',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const { payload } = req
    const draft = req.searchParams?.get('draft') === 'true' && Boolean(req.user)

    const listOf = async (collection: string, limit = 200) =>
      (
        await payload.find({
          collection: collection as never,
          limit,
          depth: 1,
          draft,
          sort: 'order',
          overrideAccess: false,
          req,
        })
      ).docs

    const globalOf = async (slug: string) =>
      payload.findGlobal({ slug: slug as never, depth: 1, draft, overrideAccess: false, req })

    try {
      const [
        siteSettings, seoDefaults, navigation, footer, homepage,
        methodology, transformation, roiConfig,
        services, industries, products, clients, team, insights, carouselCards,
        testimonials, redirects,
      ] = await Promise.all([
        globalOf('site-settings'),
        globalOf('seo-defaults'),
        globalOf('navigation'),
        globalOf('footer'),
        globalOf('homepage'),
        globalOf('methodology'),
        globalOf('transformation-story'),
        globalOf('roi-config'),
        listOf('services'),
        listOf('industries'),
        listOf('products'),
        listOf('clients'),
        listOf('team'),
        listOf('insights'),
        listOf('carousel-cards'),
        listOf('testimonials'),
        listOf('redirects'),
      ])

      return json({
        globals: {
          siteSettings, seoDefaults, navigation, footer, homepage,
          methodology, transformation, roiConfig,
        },
        collections: {
          services, industries, products, clients, team, insights,
          carouselCards, testimonials, redirects,
        },
        generatedAt: new Date().toISOString(),
      })
    } catch (err) {
      payload.logger.error(`site/bundle failed: ${(err as Error).message}`)
      return json({ error: 'Bundle unavailable.' }, 500)
    }
  },
}

/** GET /api/health — DB and storage liveness for uptime checks. */
export const health: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const checks: Record<string, string> = {}
    let ok = true

    try {
      await req.payload.count({ collection: 'users', overrideAccess: true })
      checks.database = 'ok'
    } catch (err) {
      checks.database = `error: ${(err as Error).message}`
      ok = false
    }

    checks.storage = process.env.S3_BUCKET ? 's3' : 'local-disk (development only)'

    return json({ ok, checks, at: new Date().toISOString() }, ok ? 200 : 503)
  },
}

/**
 * POST /api/jobs/purge-leads
 *
 * DPDP retention, enforced. Hard-deletes leads past `purgeAt` and leaves a
 * tombstone in the log — the count and the date range, never the personal
 * data, which would defeat the point of deleting it.
 *
 * Scheduled publishing does NOT run through here; Payload's own job queue
 * handles that (see payload.config.ts `jobs`).
 */
export const purgeLeads: Endpoint = {
  path: '/jobs/purge-leads',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const secret = process.env.CRON_SECRET
    const auth = req.headers.get('authorization')

    // Without a configured secret this endpoint stays shut rather than open.
    if (!secret || auth !== `Bearer ${secret}`) {
      return json({ error: 'Unauthorized.' }, 401)
    }

    const cutoff = new Date().toISOString()

    try {
      const due = await req.payload.find({
        collection: 'leads',
        where: { purgeAt: { less_than: cutoff } },
        limit: 500,
        depth: 0,
        overrideAccess: true,
        req,
      })

      let deleted = 0
      for (const doc of due.docs) {
        await req.payload.delete({
          collection: 'leads',
          id: doc.id,
          overrideAccess: true,
          context: { skipRevalidate: true },
          req,
        })
        deleted += 1
      }

      if (deleted > 0) {
        req.payload.logger.info(
          `DPDP retention: purged ${deleted} lead(s) older than ${LEAD_RETENTION_MONTHS} months.`,
        )
      }

      return json({ ok: true, deleted, remaining: due.totalDocs - deleted })
    } catch (err) {
      req.payload.logger.error(`purge-leads failed: ${(err as Error).message}`)
      return json({ error: 'Purge failed.' }, 500)
    }
  },
}
