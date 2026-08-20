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
 * POST /api/lead-intake
 *
 * The site's single write door into `leads`.
 *
 * ── Why this exists at all ───────────────────────────────────────────────
 * `leads.create` is `noone`, and the comment on it says submissions arrive
 * "through the site's own contact route using the Local API with
 * overrideAccess". That is true of a one-app Payload install and false here:
 * the site is a separate Next app on :3000 and the CMS is on :3001, so there is
 * no Local API to reach across. Without this endpoint `create: noone` is not a
 * hardened write path, it is *no* write path — which is exactly why the contact
 * form has been dropping every submission to a console.log.
 *
 * So the rule is kept and given one authenticated door: the public REST create
 * stays shut to the entire internet, and this route — which requires a shared
 * secret the browser never sees — is the only way a row gets made.
 *
 * ── Why not at /api/leads/intake ─────────────────────────────────────────
 * Payload already owns `/api/leads/:id`, and a sibling path risks resolving as
 * id="intake" depending on which router matches first. `/api/lead-intake`
 * cannot collide with anything.
 *
 * ── What the site sends, and what it deliberately does not ───────────────
 * `ipHash` arrives pre-hashed. The site salts and SHA-256s the address in its
 * own process so the raw IP never crosses this wire, never lands in a CMS log
 * and cannot be recovered from this database — which is what §13.4's "the raw
 * IP is never stored" has to mean to be worth writing down.
 *
 * `consentText` is the verbatim wording the visitor was shown. The site holds
 * it as a server-side constant and submits that, rather than echoing back a
 * string from the form, so a crafted POST cannot record a consent notice that
 * was never on screen.
 *
 * `purgeAt` is not accepted: the collection's own beforeChange hook stamps it
 * on create. A caller that could set its own retention date could opt out of
 * retention.
 */
export const leadIntake: Endpoint = {
  path: '/lead-intake',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const secret = process.env.LEAD_INTAKE_SECRET
    const auth = req.headers.get('authorization')

    // Unset secret closes the door rather than opening it, matching
    // purge-leads below. A misconfigured deploy must not become a public CRM.
    if (!secret || auth !== `Bearer ${secret}`) {
      return json({ error: 'Unauthorized.' }, 401)
    }

    let body: Record<string, unknown>
    try {
      body = (await req.json?.()) as Record<string, unknown>
    } catch {
      return json({ error: 'Malformed request.' }, 400)
    }

    const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

    const data = {
      firstName: str(body.firstName, 120),
      lastName: str(body.lastName, 120),
      email: str(body.email, 200),
      phone: str(body.phone, 40),
      company: str(body.company, 200),
      message: str(body.message, 4000),
      sourcePath: str(body.sourcePath, 200),
      /*
       * Product interests, as titles.
       *
       * Whitelisted and trimmed here like everything else. It was missing from
       * this mapping entirely for a while, which is a quiet way to lose data: the
       * site sent it, the column existed, and the endpoint silently dropped it on
       * the floor because the object below is built key by key rather than
       * spread. Caught by checking a stored row rather than a 201 response.
       */
      interests: (Array.isArray(body.interests) ? body.interests : [])
        .slice(0, 10)
        .map((v: unknown) => str(v, 120))
        .filter(Boolean),
      consentText: str(body.consentText, 2000),
      consentGivenAt: body.consentGivenAt ? new Date(String(body.consentGivenAt)).toISOString() : undefined,
      ipHash: str(body.ipHash, 128),
    }

    /*
     * Re-validated here even though the site validates first. The secret proves
     * the caller is ours, not that it is correct — and a bug on that side
     * writing half-empty rows into a table holding PII is worth one cheap check
     * to prevent.
     */
    if (!data.firstName || !data.message) {
      return json({ error: 'firstName and message are required.' }, 422)
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return json({ error: 'A valid email is required.' }, 422)
    }

    try {
      const doc = await req.payload.create({
        collection: 'leads',
        data,
        overrideAccess: true,
        req,
      })
      return json({ ok: true, id: doc.id }, 201)
    } catch (err) {
      // Logged with the message only. The row's contents are the personal data
      // this collection exists to look after; they do not belong in a log line.
      req.payload.logger.error(`lead-intake failed: ${(err as Error).message}`)
      return json({ error: 'Could not store lead.' }, 500)
    }
  },
}

/**
 * POST /api/jobs/sync-bookings
 *
 * Reads the connected Google Calendar, reconciles it into `bookings`, then sends
 * whatever messages are due. One endpoint for both halves because they are
 * always wanted together: polling without sending would collect bookings nobody
 * is told about, and sending without polling would work from a stale table.
 *
 * ── Run it every 5 minutes ───────────────────────────────────────────────
 * The tightest deadline in the pipeline is the hour-before message, whose window
 * is 65 minutes wide, so five-minute granularity has plenty of room. A minute
 * would work too and mostly waste Google API quota.
 *
 * Both halves report rather than throw. A calendar outage must not prevent the
 * reminders for bookings already in the table from going out, which is why the
 * notify step runs even when the sync step failed.
 */
export const syncBookings: Endpoint = {
  path: '/jobs/sync-bookings',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const secret = process.env.CRON_SECRET
    const auth = req.headers.get('authorization')

    if (!secret || auth !== `Bearer ${secret}`) {
      return json({ error: 'Unauthorized.' }, 401)
    }

    const { syncBookings: sync } = await import('../lib/bookingSync')
    const { runBookingNotifications } = await import('../lib/bookingNotify')

    let calendar: unknown = null
    let calendarError: string | null = null
    try {
      calendar = await sync(req.payload)
    } catch (err) {
      calendarError = (err as Error).message
      req.payload.logger.error(`sync-bookings: calendar step failed: ${calendarError}`)
    }

    let notify: unknown = null
    let notifyError: string | null = null
    try {
      notify = await runBookingNotifications(req.payload)
    } catch (err) {
      notifyError = (err as Error).message
      req.payload.logger.error(`sync-bookings: notify step failed: ${notifyError}`)
    }

    /*
     * 200 even with a failed half: the caller is a cron, and a non-2xx would have
     * it retry the half that worked. The body carries the detail.
     *
     * `ok` covers reported errors as well as thrown ones. Missing credentials and
     * a dead calendar arrive as entries in `errors` rather than exceptions, and an
     * `ok: true` alongside a list of failures is exactly the sort of green light
     * that lets a broken pipeline sit unnoticed for a week.
     */
    const reported = [
      ...((calendar as { errors?: string[] } | null)?.errors || []),
      ...((notify as { errors?: string[] } | null)?.errors || []),
    ]

    return json({
      ok: !calendarError && !notifyError && reported.length === 0,
      calendar: calendar ?? { error: calendarError },
      notifications: notify ?? { error: notifyError },
    })
  },
}

/**
 * POST /api/jobs/purge-leads
 *
 * DPDP retention, enforced. Hard-deletes rows past their `purgeAt` and leaves a
 * tombstone in the log — the count and the collection, never the personal data,
 * which would defeat the point of deleting it.
 *
 * ── Why it covers bookings too ───────────────────────────────────────────
 * `bookings` holds a member of the public's name, email and WhatsApp number,
 * which is the same category of data as a lead and carries the same obligation.
 * It has its own `purgeAt` for that reason, and a retention job that ignored it
 * would leave the guarantee true of one table and false of the other — the worst
 * of the three possible states, because the policy would still read as honoured.
 *
 * The path keeps its original name: nothing calls it yet, but it is referenced by
 * name in ARCHITECTURE.md §13.4 and renaming it would silently strand whichever
 * cron is eventually pointed at it.
 *
 * Scheduled publishing does NOT run through here; Payload's own job queue
 * handles that (see payload.config.ts `jobs`).
 */
const RETAINED_COLLECTIONS = ['leads', 'bookings'] as const

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
    const result: Record<string, { deleted: number; remaining: number }> = {}

    try {
      for (const collection of RETAINED_COLLECTIONS) {
        const due = await req.payload.find({
          collection,
          where: { purgeAt: { less_than: cutoff } },
          limit: 500,
          depth: 0,
          overrideAccess: true,
          req,
        })

        let deleted = 0
        for (const doc of due.docs) {
          await req.payload.delete({
            collection,
            id: doc.id,
            overrideAccess: true,
            context: { skipRevalidate: true },
            req,
          })
          deleted += 1
        }

        if (deleted > 0) {
          req.payload.logger.info(
            `DPDP retention: purged ${deleted} ${collection} row(s) past ${LEAD_RETENTION_MONTHS}-month retention.`,
          )
        }

        result[collection] = { deleted, remaining: due.totalDocs - deleted }
      }

      return json({ ok: true, ...result })
    } catch (err) {
      req.payload.logger.error(`purge-leads failed: ${(err as Error).message}`)
      return json({ error: 'Purge failed.' }, 500)
    }
  },
}
