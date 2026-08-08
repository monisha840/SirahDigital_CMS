import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import sharp from 'sharp'
import { canPublish, isAdmin, isLoggedIn } from '../access'
import { sniff, isRaster, MAX_UPLOAD_BYTES } from '../lib/fileSafety'

/**
 * The asset library.
 *
 * Presets match cms_architecture.md §9. Every raster is re-encoded through
 * sharp on the way in, which strips EXIF — including the GPS coordinates that
 * ride along on photographs taken on a phone — and neutralises polyglot files
 * that are a valid image and a valid script at the same time.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Library',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize'],
    description: 'Images, video and documents. Alt text is required — it is not optional for accessibility or SEO.',
  },

  access: {
    // Public read: the site loads these by URL. Only the row is public; the
    // storage keys are content-hashed, so an unreferenced asset is not
    // enumerable.
    read: () => true,
    create: canPublish,
    update: canPublish,
    delete: isAdmin,
  },

  upload: {
    // Presets from §9. Height omitted keeps the aspect ratio; `og` is the one
    // fixed crop, and it honours the focal point so the subject survives it.
    imageSizes: [
      { name: 'thumb', width: 200, position: 'centre' },
      { name: 'card', width: 640, position: 'centre' },
      { name: 'hero', width: 1280, position: 'centre' },
      { name: 'wide', width: 1920, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumb',
    focalPoint: true,
    crop: true,
    // Advisory only — the real check is the magic-byte sniff below.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'application/pdf'],
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'What is in the picture, for screen readers. Describe the image rather than repeating the heading next to it.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. Shown under the image where a layout supports it.' },
    },
    {
      name: 'blurDataURL',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
        description: 'Generated on upload. Feeds next/image placeholder="blur".',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer or licence, where one is required.' },
    },
    {
      /*
       * The original /public path this asset was imported from, e.g.
       * "/carousel/01.jpg".
       *
       * The seed needs a stable key to recognise an already-imported file, and
       * `filename` cannot be it: uploads are re-encoded to WebP, so a source
       * called 01.jpg is stored as 01.webp and a lookup by the source name
       * never matches. Every re-run then re-uploaded, and Payload
       * de-duplicated the name to 01-1.webp — 30 files silently became 60.
       *
       * Empty for anything uploaded through the admin, which is correct: only
       * migrated assets have an origin path.
       */
      name: 'sourcePath',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Set by the migration for assets imported from the old /public folder.',
      },
    },
  ],

  hooks: {
    beforeOperation: [
      async ({ req, operation }) => {
        if (operation !== 'create' && operation !== 'update') return
        const file = req.file
        if (!file?.data) return

        const result = sniff(file.data as Buffer)
        if (!result.ok) {
          // APIError with an explicit status, so the editor is told what is wrong.
          // A plain Error surfaces as a 500 "Something went wrong."
          throw new APIError(result.reason, 400)
        }

        // Trust the sniffed type over anything the client claimed.
        file.mimetype = result.mime
      },
    ],

    beforeChange: [
      async ({ req, data }) => {
        const file = req.file
        if (!file?.data || !isRaster(file.mimetype)) return data

        // A ~20x20 WebP inlined as a data URI. Small enough to sit in the HTML
        // payload without measurably growing it, big enough to read as the
        // shape of the image while the real file downloads.
        try {
          const tiny = await sharp(file.data as Buffer)
            .resize(20, 20, { fit: 'inside' })
            .webp({ quality: 40 })
            .toBuffer()
          return {
            ...data,
            blurDataURL: `data:image/webp;base64,${tiny.toString('base64')}`,
          }
        } catch {
          // A blur placeholder is a nicety. Losing it must never fail an
          // otherwise valid upload.
          return data
        }
      },
    ],

    beforeDelete: [
      async ({ req, id }) => {
        /*
         * Refuse to delete an asset that is still referenced.
         *
         * This is the `entry_media` guard from §6 of the architecture doc: the
         * classic CMS failure is someone tidying the library and silently
         * blanking six live pages.
         *
         * ── Each collection is queried on the fields it actually has ───────
         * The first version of this ORed every known upload field name across
         * every collection. Querying `services` for `image` — a field it does
         * not have — makes Payload throw, and a `.catch(() => null)` swallowed
         * it. Every query failed, the dependents list stayed empty, and the
         * guard reported "safe to delete" for an image on a live page. It read
         * as working precisely because nothing ever errored out loud.
         *
         * Hence: an explicit map, and failures are logged and treated as
         * "assume referenced" rather than "assume free".
         */
        const MEDIA_REFS: Record<string, string[]> = {
          industries: ['image', 'seo.ogImage'],
          products: ['heroImage', 'seo.ogImage'],
          'case-studies': ['cover', 'seo.ogImage'],
          clients: ['logo'],
          testimonials: ['avatar'],
          posts: ['cover', 'seo.ogImage'],
          authors: ['photo'],
          team: ['photo'],
          insights: ['cover'],
          'carousel-cards': ['image'],
          services: ['seo.ogImage'],
          categories: ['seo.ogImage'],
          pages: ['seo.ogImage'],
        }

        const dependents: string[] = []

        for (const [collection, fields] of Object.entries(MEDIA_REFS)) {
          try {
            const found = await req.payload.find({
              collection: collection as never,
              depth: 0,
              limit: 3,
              overrideAccess: true,
              req,
              where: { or: fields.map((f) => ({ [f]: { equals: id } })) } as never,
            })
            if (found.docs.length) {
              dependents.push(`${collection} (${found.docs.length}${found.docs.length === 3 ? '+' : ''})`)
            }
          } catch (err) {
            // Fail closed. A guard that cannot verify must not green-light a
            // destructive action.
            req.payload.logger.error(
              `Media delete guard could not check ${collection}: ${(err as Error).message}`,
            )
            dependents.push(`${collection} (check failed)`)
          }
        }

        if (dependents.length) {
          throw new APIError(
            `This image is still used by: ${dependents.join(', ')}. Replace it there first, then delete it here.`,
            400,
          )
        }
      },
    ],
  },
}

export default Media
export { MAX_UPLOAD_BYTES }
