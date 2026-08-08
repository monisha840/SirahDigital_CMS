import crypto from 'crypto'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Tells the site to drop its cache for the given tags.
 *
 * This is what makes an edit appear within seconds without a rebuild. The site
 * holds pages as static ISR output; this webhook calls `revalidateTag()` there
 * so the next request re-renders against fresh content.
 *
 * ── Why HMAC and not a bearer token ──────────────────────────────────────
 * A bearer token proves the caller knows a secret. An HMAC over the body plus
 * a timestamp also proves the *body* was not altered and that the request is
 * recent, which closes the replay window. §13 of the architecture doc requires
 * both, so both are here.
 *
 * ── Why failure is swallowed ─────────────────────────────────────────────
 * If the site is unreachable, the edit is still valid and still saved. Content
 * goes live on the next natural ISR expiry instead of within seconds. Throwing
 * here would roll back an editor's save because a cache ping failed, which is
 * the wrong trade every time.
 */

const sign = (body: string, timestamp: string, secret: string): string =>
  crypto.createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')

type RevalidatePayload = { tags?: string[]; paths?: string[] }

export const pingSite = async (payloadBody: RevalidatePayload, logger?: { error: (msg: string) => void }) => {
  const siteUrl = process.env.SITE_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!siteUrl || !secret) {
    // Local development without the site running is normal and not an error.
    return
  }

  const body = JSON.stringify(payloadBody)
  const timestamp = Date.now().toString()

  try {
    const res = await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sirah-Timestamp': timestamp,
        'X-Sirah-Signature': sign(body, timestamp, secret),
      },
      body,
      // Never let a hanging site hold an editor's save open.
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      logger?.error(`Revalidation returned ${res.status} for tags: ${payloadBody.tags?.join(', ')}`)
    }
  } catch (err) {
    logger?.error(`Revalidation failed: ${(err as Error).message}`)
  }
}

/** Collection afterChange / afterDelete. */
export const revalidate =
  (tags: string[]): CollectionAfterChangeHook & CollectionAfterDeleteHook =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (async ({ doc, req, context }: any) => {
    // Bookkeeping writes (last-login stamps, purge jobs) opt out.
    if (context?.skipRevalidate) return doc

    const paths: string[] = []
    if (doc?.slug) {
      // Let a collection ask for its own detail path to be dropped as well as
      // its tag, which covers routes rendered outside the tagged fetch.
      paths.push(...tags.filter((t) => t.startsWith('/')).map((t) => `${t}/${doc.slug}`))
    }

    await pingSite({ tags: tags.filter((t) => !t.startsWith('/')), paths }, req.payload.logger)
    return doc
  }) as CollectionAfterChangeHook & CollectionAfterDeleteHook

/** Global afterChange — globals have no slug, so tags only. */
export const revalidateGlobal =
  (tags: string[]): GlobalAfterChangeHook =>
  async ({ doc, req, context }) => {
    if ((context as { skipRevalidate?: boolean })?.skipRevalidate) return doc
    await pingSite({ tags }, req.payload.logger)
    return doc
  }
