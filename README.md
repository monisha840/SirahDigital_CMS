# Sirah Digital CMS

Payload 3 admin for the Sirah Digital marketing site. Runs as its own app so the
site keeps its Next 14 / React 18 runtime — `@react-three/fiber@8` and
`drei@9` cannot run on React 19, so embedding the CMS in the site would have
forced a migration of every 3D component.

Architecture and rationale: [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## First run

```bash
cd sirah-cms
npm install
npm run gen:password        # prints the secrets to paste into .env
cp .env.example .env        # then fill it in
```

### Database — Supabase

1. Create a Supabase project.
2. **Project Settings → Database → Connection string.**
3. Take the **port 5432** string (session pooler / direct), not 6543.
4. Append `?sslmode=require` and paste into `DATABASE_URI`.

> **The 6543 trap.** Supabase's transaction pooler on port 6543 does not support
> prepared statements. Payload's schema push and migrations both need them and
> fail with `prepared statement "s0" already exists` — which reads like a bug in
> your code, not a connection-mode mismatch. Use 5432 unless you have a specific
> reason not to. If you must use 6543 at runtime, put a 5432 string in
> `DATABASE_URI_DIRECT` and migrations will pick it up automatically.

Supabase's free tier pauses a project after ~1 week of inactivity. That is fine
for the CMS — it wakes on the next request — but it means the first admin load
after a quiet fortnight takes a few seconds.

```bash
npm run dev                 # http://localhost:3001/admin
npm run seed:admin          # creates the bootstrap admin
npm run seed                # imports all existing site content
```

`npm run dev` creates the schema automatically in development. For production
see *Deploying* below — a production boot never alters the schema on its own.

### The admin account

| | |
|---|---|
| URL | `http://localhost:3001/admin` (prod: `https://cms.sirahdigital.in/admin`) |
| Email | `admin@sirahdigital.in`, or whatever you set as `SEED_ADMIN_EMAIL` |
| Password | the `SEED_ADMIN_PASSWORD` you generated |

The bootstrap account is flagged `mustChangePassword`. Change it at first login,
then blank `SEED_ADMIN_PASSWORD` in `.env` and create a personal admin account —
a shared login makes the audit trail meaningless.

**Never commit `.env`.** It is git-ignored; keep it that way.

---

## What the seed imports

`npm run seed` reads the site's own `src/data/*.js` modules directly, so there is
no hand-transcribed copy to drift. It is idempotent — every record is matched on
a natural key and updated, never duplicated, so run it as many times as you like.

| Source | Becomes |
|---|---|
| `company.js` + `socials.js` | Site Settings global |
| `services.js` + `serviceExperience.js` | **10 Services** (merged into one record each) |
| `industries.js` + `industryIntelligence.js` + `industryWorkflows.js` | **12 Industries** (three modules merged) |
| `products.js` | 3 Products |
| `projects.js` | 5 Case Studies (`stage` discriminator) |
| `clients.js` | 9 Clients |
| `team.js` | 6 Team members |
| `insightsData.js` | 3 Insights |
| `carouselCards.js` | 9 Carousel cards |
| `transformation.js` | Transformation Story global |
| `roi.js` | ROI Calculator global |
| `nav.js` | Navigation global + 6 Redirects |
| `services.js` + `company.js` | Footer global |
| `public/**` | ~30 media records with all 5 renditions |

**Two things the seed deliberately does not do:**

1. **Privacy and Terms copy.** The shells are created; the legal text stays in
   the site's JSX until a human moves it. A script guessing at paragraph breaks
   in legal copy is not a trade worth making.
2. **Client logos and URLs.** They were `null` in the source data. A marquee of
   wrong links is worse than one of none.

Missing image files are warnings, not failures — several `image` paths in the
source point at artwork that was never added, and the site already renders
placeholders for those.

---

## Day-to-day

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Typecheck | `npm run typecheck` |
| Regenerate TS types after a schema edit | `npm run generate:types` |
| Create a migration | `npm run migrate:create` |
| Apply migrations | `npm run migrate` |
| Production build | `npm run build` |

After changing any collection or global, run `npm run generate:types`. After
changing admin components, `npx payload generate:importmap`.

---

## Adding content types

**A new section on an existing page** — no code. Add a block in the admin.

**A new field on an existing type** — one entry in the collection's `fields`
array, then `npm run migrate:create`.

**A genuinely new visual section** — three steps:
1. A block in [`src/blocks/index.ts`](src/blocks/index.ts) and an entry in `ALL_BLOCKS`.
2. A React component on the site.
3. One line in the site's `src/components/blocks/registry.js`.

That third case is the honest boundary described in §3 of the architecture doc.
No CMS generates a design that does not exist yet.

**Do not rename a block `slug`.** It is the key the site's renderer switches on,
so renaming orphans every page using it. Add freely; rename never.

---

## Deploying

Set every variable from `.env.example` in the host's secret store.

```bash
npm run build
npm run migrate      # explicit, reviewed, applied on deploy
npm start
```

`push` is disabled when `NODE_ENV=production`, so a production boot never
silently alters the schema. Schema changes ship as reviewed migrations.

**Cron jobs to configure:**

| Schedule | Target | Purpose |
|---|---|---|
| every minute | `POST /api/payload-jobs/run` | Scheduled publish/unpublish |
| daily | `POST /api/jobs/purge-leads` | DPDP 24-month retention |

Both take `Authorization: Bearer $CRON_SECRET`.

`payload.config.ts` sets `jobs.autoRun` for the publish queue, which is fine on a
**single instance**. On a multi-instance deploy, remove `autoRun` and drive it
from external cron instead, or two instances will race for the same job.

---

## Wiring the site to this CMS

The site half is Phase 3 and is **not** done yet. What exists here already:

- `GET /api/site/bundle` — every global plus the short collections in one
  response, so a build makes one round-trip instead of twelve.
- `afterChange` hooks POST to the site's `/api/revalidate` with an HMAC
  signature, which is what makes an edit go live in seconds with no rebuild.
- Live preview URLs are configured per collection and point at `SITE_URL`.

`REVALIDATE_SECRET` must be identical in both apps. A mismatch fails silently —
edits save fine and simply never appear on the site, which is a miserable thing
to debug. If content is not updating, check this first.

The site also needs `S3_PUBLIC_URL` added to `next.config.js` `images.remotePatterns`
before `next/image` will load CMS media.

---

## Security notes

Full detail in §13 of the architecture doc. What is implemented here:

- **Access control** — `src/access/index.ts`, default deny throughout. Public
  reads see only `_status: published`.
- **Mass-assignment guards** — `role`, `totpSecret` and `mustChangePassword`
  cannot be set through a normal update; without this a user could PATCH
  themselves to admin.
- **Login throttling** — 5 attempts, 15-minute lockout.
- **Upload safety** — magic-byte sniffing rather than extension or
  `Content-Type` (both attacker-supplied); SVG rejected as executable XML;
  20 MB cap; every raster re-encoded through sharp, which strips EXIF including
  GPS coordinates from phone photos.
- **Media deletion guard** — refuses to delete an asset still referenced by any
  entry, and names the dependents.
- **CORS/CSRF allowlists** — the site and CMS origins only, never `*`.
- **Leads** — `create` closed to the API entirely; retention enforced by job;
  consent wording stored verbatim; IP salted-hashed, never raw.

**Not yet implemented — Phase 6:**

- **TOTP 2FA.** The `totpEnabled` / `totpSecret` columns exist so enabling it
  later is not a migration against a populated table, but there is **no login
  step-up yet**. Do not read `totpEnabled` as "this account is protected".
- Cloudflare Access in front of `/admin`, backup restore drill, Sentry.
