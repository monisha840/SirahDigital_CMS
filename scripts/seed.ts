/**
 * Migrates the existing site content into the CMS.
 *
 *   npm run seed
 *
 * Reads the site's own `src/data/*.js` modules directly — they are plain ESM
 * with relative imports, so they load here unchanged and there is no
 * hand-transcribed copy of the content to drift out of date.
 *
 * ── Idempotent ────────────────────────────────────────────────────────────
 * Safe to run repeatedly. Every record is matched on a natural key (slug, name,
 * filename) and updated rather than duplicated, so you can run it against
 * staging, look at the result, fix the source data and run it again.
 *
 * ── Order matters ─────────────────────────────────────────────────────────
 * Media first, because industries/team/insights/carousel all point at it.
 * Clients before case studies. Team before authors. Services before industries
 * (relatedServices) and before navigation.
 */
import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const SITE = path.resolve(dirname, '../../SirahDigital_3D_WebSite')
const DATA = path.join(SITE, 'src/data')
const PUBLIC = path.join(SITE, 'public')

const load = async (file: string) => import(`file://${path.join(DATA, file)}`)

const log = (msg: string) => console.log(`  ${msg}`)
const section = (msg: string) => console.log(`\n── ${msg} ${'─'.repeat(Math.max(0, 60 - msg.length))}`)

type Doc = { id: string | number }

/**
 * Upsert by a natural key. Returns the record id.
 *
 * The collection slug is a runtime string here, so Payload's per-collection
 * generics collapse to `never` and the doc type is lost. That is inherent to a
 * migration that walks a list of collections; the casts are confined to this
 * one helper rather than sprayed across every call site.
 */
const upsert = async (
  payload: Payload,
  collection: string,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
): Promise<string | number> => {
  const found = (await payload.find({
    collection: collection as never,
    where: where as never,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })) as unknown as { docs: Doc[] }

  if (found.docs.length > 0) {
    const updated = (await payload.update({
      collection: collection as never,
      id: found.docs[0].id,
      data: data as never,
      overrideAccess: true,
      context: { skipRevalidate: true },
    })) as unknown as Doc
    return updated.id
  }

  const created = (await payload.create({
    collection: collection as never,
    data: data as never,
    overrideAccess: true,
    context: { skipRevalidate: true },
  })) as unknown as Doc
  return created.id
}

/**
 * Uploads a file from the site's public/ directory into the media library.
 *
 * Matched on filename, so re-running does not re-upload 16 MB every time.
 * A missing file is a warning, not a failure: several `image` paths in the
 * source data point at artwork that was never added, and the site already
 * renders a placeholder for those. Stopping the whole migration over one
 * absent photograph would be the wrong trade.
 */
const mediaCache = new Map<string, string | number | null>()

const uploadMedia = async (
  payload: Payload,
  publicPath: string | null | undefined,
  alt: string,
): Promise<string | number | null> => {
  if (!publicPath) return null
  if (mediaCache.has(publicPath)) return mediaCache.get(publicPath)!

  const abs = path.join(PUBLIC, publicPath.replace(/^\//, ''))

  if (!fs.existsSync(abs)) {
    log(`! missing file, skipped: ${publicPath}`)
    mediaCache.set(publicPath, null)
    return null
  }

  /*
   * Matched on `sourcePath`, NOT on filename.
   *
   * Uploads are re-encoded to WebP, so a source called 01.jpg lands as
   * 01.webp. Looking it up by the source name never matched, so every re-run
   * uploaded it again and Payload de-duplicated to 01-1.webp. That is what
   * turned 30 files into 60.
   */
  const existing = await payload.find({
    collection: 'media',
    where: { sourcePath: { equals: publicPath } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    mediaCache.set(publicPath, existing.docs[0].id)
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt, sourcePath: publicPath },
    filePath: abs,
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log(`+ media ${path.basename(abs)}`)
  mediaCache.set(publicPath, created.id)
  return created.id
}

const asArray = <T,>(items: readonly T[] | undefined, key: string) =>
  (items ?? []).map((v) => ({ [key]: v }))

const run = async () => {
  const payload = await getPayload({ config })
  const published = { _status: 'published' as const }

  // ── 1. Site settings, socials ──────────────────────────────────────────
  section('Globals: company, socials, SEO')
  const { COMPANY } = await load('company.js')
  const { SOCIALS } = await load('socials.js')

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: COMPANY.name,
      url: COMPANY.url,
      email: COMPANY.email,
      phone: COMPANY.phone,
      phoneHref: COMPANY.phoneHref,
      address: asArray(COMPANY.address, 'line'),
      addressOneLine: COMPANY.addressOneLine,
      blurb: COMPANY.blurb,
      tagline: COMPANY.tagline,
      socials: SOCIALS.map((s: { label: string; href: string; path: string }) => ({
        label: s.label,
        href: s.href,
        iconPath: s.path,
      })),
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log('site-settings')

  await payload.updateGlobal({
    slug: 'seo-defaults',
    data: {
      titleTemplate: '%s | Sirah Digital',
      defaultTitle: 'Sirah Digital | Intelligent Business Automation Systems',
      defaultDescription: 'Automate, simplify, and scale through custom software.',
      robotsDisallow: [{ path: '/animations' }, { path: '/api/' }],
      ...published,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log('seo-defaults')

  // ── 2. Services (before industries and navigation) ─────────────────────
  section('Services')
  const { SERVICES, METHODOLOGY } = await load('services.js')
  const { SERVICE_EXPERIENCE } = await load('serviceExperience.js')

  type Exp = {
    slug: string; navLabel?: string; visual?: string; system?: string
    problem?: string; outcome?: string; cta?: string
  }
  const expBySlug: Record<string, Exp> = Object.fromEntries(
    (SERVICE_EXPERIENCE as Exp[]).map((e) => [e.slug, e]),
  )

  const serviceIds: Record<string, string | number> = {}
  for (const [i, s] of (SERVICES as { slug: string; title: string; desc: string }[]).entries()) {
    const e = expBySlug[s.slug]
    serviceIds[s.slug] = await upsert(payload, 'services', { slug: { equals: s.slug } }, {
      slug: s.slug,
      title: s.title,
      desc: s.desc,
      order: (i + 1) * 10,
      navLabel: e?.navLabel,
      visual: e?.visual,
      system: e?.system,
      problem: e?.problem,
      outcome: e?.outcome,
      ctaLabel: e?.cta,
      ...published,
    })
  }
  log(`${Object.keys(serviceIds).length} services (merged with serviceExperience)`)

  await payload.updateGlobal({
    slug: 'methodology',
    data: {
      pillars: (METHODOLOGY as { title: string; desc: string; accent: string }[]).map((m) => ({
        title: m.title, desc: m.desc, accent: m.accent,
      })),
      ...published,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log('methodology (3 pillars)')

  // ── 3. Industries (merges 3 source modules) ────────────────────────────
  section('Industries')
  const { INDUSTRIES } = await load('industries.js')
  const { INDUSTRY_INTELLIGENCE } = await load('industryIntelligence.js')
  const { INDUSTRY_WORKFLOWS } = await load('industryWorkflows.js')

  type Intel = {
    slug: string; tagline?: string; icon?: string; accent?: string; summary?: string
    metric?: { value: string; label: string }; outcomes?: string[]
    guarantee?: string; stack?: string[]
  }
  const intelBySlug: Record<string, Intel> = Object.fromEntries(
    (INDUSTRY_INTELLIGENCE as Intel[]).map((i) => [i.slug, i]),
  )

  const industryIds: Record<string, string | number> = {}
  for (const [i, ind] of (INDUSTRIES as {
    slug: string; title: string; desc: string; image?: string; alt?: string
  }[]).entries()) {
    const intel = intelBySlug[ind.slug]
    const workflow = (INDUSTRY_WORKFLOWS as Record<string, { title: string; desc: string }[]>)[ind.slug]
    const imageId = await uploadMedia(payload, ind.image, ind.alt || ind.title)

    industryIds[ind.slug] = await upsert(payload, 'industries', { slug: { equals: ind.slug } }, {
      slug: ind.slug,
      title: ind.title,
      desc: ind.desc,
      order: (i + 1) * 10,
      image: imageId,
      tagline: intel?.tagline,
      icon: intel?.icon,
      accent: intel?.accent,
      summary: intel?.summary,
      metric: intel?.metric ? { value: intel.metric.value, label: intel.metric.label } : undefined,
      outcomes: asArray(intel?.outcomes, 'text'),
      guarantee: intel?.guarantee,
      stack: asArray(intel?.stack, 'name'),
      workflow: (workflow ?? []).map((w) => ({ title: w.title, desc: w.desc })),
      ...published,
    })
  }
  log(`${Object.keys(industryIds).length} industries (merged intelligence + workflows)`)

  // ── 4. Products ────────────────────────────────────────────────────────
  section('Products')
  const { HOME_PRODUCTS } = await load('products.js')
  for (const [i, p] of (HOME_PRODUCTS as {
    id: string; label: string; title: string; description: string; cta: string; href: string
  }[]).entries()) {
    await upsert(payload, 'products', { slug: { equals: p.id } }, {
      slug: p.id,
      label: p.label,
      title: p.title,
      description: p.description,
      ctaLabel: p.cta,
      order: (i + 1) * 10,
      // Every source href pointed at /contact because no product had a page.
      // hasPage stays false until someone builds one; the site keeps sending
      // these clicks to the enquiry form until then.
      hasPage: false,
      ...published,
    })
  }
  log(`${HOME_PRODUCTS.length} products`)

  // ── 5. Clients ─────────────────────────────────────────────────────────
  section('Clients')
  const { CLIENTS } = await load('clients.js')
  const clientIds: Record<string, string | number> = {}
  for (const [i, c] of (CLIENTS as { name: string; logo: string | null; url: string | null }[]).entries()) {
    const logoId = await uploadMedia(payload, c.logo, `${c.name} logo`)
    clientIds[c.name] = await upsert(payload, 'clients', { name: { equals: c.name } }, {
      name: c.name,
      logo: logoId,
      url: c.url ?? undefined,
      order: (i + 1) * 10,
      featured: true,
      ...published,
    })
  }
  log(`${CLIENTS.length} clients`)

  // ── 6. Case studies ────────────────────────────────────────────────────
  section('Case studies')
  const { PRODUCTION_PROJECTS, DEVELOPMENT_PROJECTS } = await load('projects.js')

  for (const [i, p] of (PRODUCTION_PROJECTS as {
    slug: string; title: string; client: string; impact: string; desc: string
  }[]).entries()) {
    await upsert(payload, 'case-studies', { slug: { equals: p.slug } }, {
      slug: p.slug, title: p.title, desc: p.desc, impact: p.impact,
      stage: 'production', order: (i + 1) * 10,
      // `client` in the source is a sector name, not a client record — the
      // industry relationship is the honest home for it.
      industry: industryIds[
        Object.keys(industryIds).find((s) => p.client.toLowerCase().includes(s.split('-')[0])) ?? ''
      ],
      ...published,
    })
  }
  for (const [i, p] of (DEVELOPMENT_PROJECTS as {
    slug: string; title: string; phase: string; stack: string; desc: string
  }[]).entries()) {
    await upsert(payload, 'case-studies', { slug: { equals: p.slug } }, {
      slug: p.slug, title: p.title, desc: p.desc, phase: p.phase,
      stage: 'development', order: (i + 1) * 10 + 500,
      stack: [{ name: p.stack }],
      ...published,
    })
  }
  log(`${PRODUCTION_PROJECTS.length} production + ${DEVELOPMENT_PROJECTS.length} development`)

  // ── 7. Team ────────────────────────────────────────────────────────────
  section('Team')
  const { FOUNDER, TEAM } = await load('team.js')
  const allTeam = [{ ...FOUNDER, isFounder: true }, ...TEAM.map((t: object) => ({ ...t, isFounder: false }))]
  for (const [i, m] of (allTeam as {
    name: string; role: string; bio: string; photo: string; isFounder: boolean
  }[]).entries()) {
    const photoId = await uploadMedia(payload, m.photo, `${m.name}, ${m.role}`)
    await upsert(payload, 'team', { name: { equals: m.name } }, {
      name: m.name, role: m.role, bio: m.bio, photo: photoId,
      isFounder: m.isFounder, order: (i + 1) * 10, ...published,
    })
  }
  log(`${allTeam.length} team members (1 founder)`)

  // ── 8. Insights ────────────────────────────────────────────────────────
  section('Insights')
  const { LATEST_INSIGHTS } = await load('insightsData.js')
  for (const [i, ins] of (LATEST_INSIGHTS as {
    id: string; cover: string | null; coverAlt: string; category: string; title: string
    description: string; duration: string; date: string; youtubeUrl: string; theme: string
  }[]).entries()) {
    const coverId = await uploadMedia(payload, ins.cover, ins.coverAlt)
    await upsert(payload, 'insights', { title: { equals: ins.title } }, {
      title: ins.title, cover: coverId, category: ins.category,
      description: ins.description, duration: ins.duration, date: ins.date,
      youtubeUrl: ins.youtubeUrl, theme: ins.theme, order: (i + 1) * 10, ...published,
    })
  }
  log(`${LATEST_INSIGHTS.length} insights`)

  // ── 9. Carousel cards ──────────────────────────────────────────────────
  section('Carousel cards')
  const { CAROUSEL_CARDS } = await load('carouselCards.js')
  let carouselCount = 0
  for (const [i, c] of (CAROUSEL_CARDS as {
    id: string; src: string; alt: string; title: string; desc: string; href: string; cta?: string
  }[]).entries()) {
    const imageId = await uploadMedia(payload, c.src, c.alt)
    if (!imageId) continue // image is required on this collection
    await upsert(payload, 'carousel-cards', { alt: { equals: c.alt } }, {
      image: imageId, alt: c.alt,
      title: c.title || undefined, desc: c.desc || undefined,
      href: c.href || undefined, ctaLabel: c.cta,
      order: (i + 1) * 10, ...published,
    })
    carouselCount += 1
  }
  log(`${carouselCount} carousel cards`)

  // ── 10. Transformation story + ROI ─────────────────────────────────────
  section('Site-wide content')
  const { SCENE_MS, SCENES } = await load('transformation.js')
  await payload.updateGlobal({
    slug: 'transformation-story',
    data: {
      sceneMs: SCENE_MS,
      scenes: (SCENES as {
        id: string; tab: string; tabLong: string; phase: string; accent: string
        accentSoft: string; title: string; body: string; points: string[]
        status: string; statusTone: 'alert' | 'bolt' | 'rocket'
      }[]).map((s) => ({
        sceneId: s.id, tab: s.tab, tabLong: s.tabLong, phase: s.phase,
        accent: s.accent, accentSoft: s.accentSoft, title: s.title, body: s.body,
        points: asArray(s.points, 'text'), status: s.status, statusTone: s.statusTone,
      })),
      ...published,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log(`transformation story (${SCENES.length} scenes)`)

  const { ROI_INDUSTRIES } = await load('roi.js')
  await payload.updateGlobal({
    slug: 'roi-config',
    data: {
      industries: (ROI_INDUSTRIES as {
        id: string; label: string; automationFit: number; dealValue: number
        baseConversion: number; recommendations: string[]
      }[]).map((r) => ({
        industryId: r.id, label: r.label, automationFit: r.automationFit,
        dealValue: r.dealValue, baseConversion: r.baseConversion,
        recommendations: asArray(r.recommendations, 'text'),
      })),
      disclaimer:
        'Indicative estimate based on typical engagement data. Your actual results will depend on your processes, volumes and systems.',
      ...published,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log(`ROI config (${ROI_INDUSTRIES.length} industries)`)

  // ── 11. Navigation, footer, redirects ──────────────────────────────────
  section('Navigation, footer and redirects')
  const { NAV_LINKS, LEGACY_ANCHORS } = await load('nav.js')

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      header: (NAV_LINKS as {
        label: string; href: string; menu?: { label: string; href: string }[]
      }[]).map((l) => ({
        label: l.label,
        href: l.href,
        children: (l.menu ?? []).map((m) => ({ label: m.label, href: m.href })),
      })),
      legacyAnchors: Object.entries(LEGACY_ANCHORS as Record<string, string>).map(([from, to]) => ({
        from, to,
      })),
      ...published,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log(`navigation (${NAV_LINKS.length} top-level links)`)

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      blurb: COMPANY.blurb,
      columns: [
        {
          heading: 'Company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Work', href: '/work' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          heading: 'Services',
          links: (SERVICES as { slug: string; title: string }[])
            .slice(0, 5)
            .map((s) => ({ label: s.title, href: `/services#${s.slug}` })),
        },
      ],
      legalLinks: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
      copyright: `${COMPANY.name}. All rights reserved.`,
      showSocials: true,
      ...published,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log('footer')

  // Lifted from next.config.js so they can be changed without a deploy.
  const REDIRECTS = [
    ['/team', '/about'], ['/process', '/about'], ['/projects', '/work'],
    ['/portfolio', '/work'], ['/service', '/services'], ['/contact-us', '/contact'],
  ]
  for (const [from, to] of REDIRECTS) {
    await upsert(payload, 'redirects', { from: { equals: from } }, { from, to, permanent: true })
  }
  log(`${REDIRECTS.length} redirects`)

  // ── 12. Homepage composition ───────────────────────────────────────────
  section('Homepage')
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      // The running order of the current homepage, expressed as blocks. From
      // here the team can reorder or remove any of these without a deploy.
      sections: [
        { blockType: 'hero', heading: 'Automate, simplify, and scale through custom software.', sub: COMPANY.blurb, ctaLabel: 'Book a free consultation', ctaHref: '/contact' },
        { blockType: 'productGrid', heading: 'Products' },
        { blockType: 'transformationStory' },
        { blockType: 'serviceChapters', heading: 'What we build' },
        { blockType: 'industryOrbit', heading: 'Industries we serve' },
        { blockType: 'perspectiveCarousel' },
        { blockType: 'clientMarquee', heading: 'Trusted across industries' },
        { blockType: 'roiCalculator', heading: 'What could automation return?' },
        { blockType: 'insightsCarousel', heading: 'Insights & success stories' },
        { blockType: 'methodologyJourney', heading: 'How the work gets delivered' },
        { blockType: 'ctaBand', heading: 'Ready to automate?', ctaLabel: 'Book a free consultation', ctaHref: '/contact' },
      ],
      ...published,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log('homepage (11 sections)')

  // ── 13. Static pages ───────────────────────────────────────────────────
  section('Pages')
  for (const p of [
    { slug: 'privacy', title: 'Privacy Policy' },
    { slug: 'terms', title: 'Terms of Service' },
  ]) {
    await upsert(payload, 'pages', { slug: { equals: p.slug } }, {
      ...p,
      // Body intentionally left empty — the existing legal copy lives in the
      // site's JSX and should be moved across by someone who reads it, not by
      // a migration script guessing at paragraph breaks.
      sections: [],
      ...published,
    })
  }
  log('privacy + terms (shells — legal copy still to be moved by hand)')

  console.log(`
${'═'.repeat(64)}
Seed complete.

Next:
  1. Open the admin and spot-check Industries — it is the record that merged
     three source modules, so it is where a mistake would show first.
  2. Move the Privacy and Terms copy across by hand.
  3. Fill in client logos and URLs, which were null in the source data.
${'═'.repeat(64)}
`)
  process.exit(0)
}

run().catch((err) => {
  console.error('\nSeed failed:', err)
  process.exit(1)
})
