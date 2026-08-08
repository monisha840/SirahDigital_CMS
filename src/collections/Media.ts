import type { CollectionConfig } from 'payload'
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
  ],

  hooks: {
    beforeOperation: [
      async ({ req, operation }) => {
        if (operation !== 'create' && operation !== 'update') return
        const file = req.file
        if (!file?.data) return

        const result = sniff(file.data as Buffer)
        if (!result.ok) {
          throw new Error(result.reason)
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
         * blanking six live pages. Payload tracks relationships, so we ask it
         * which documents point here before allowing the delete.
         */
        const collectionsWithMedia = [
          'industries', 'products', 'case-studies', 'clients', 'testimonials',
          'posts', 'authors', 'team', 'insights', 'carousel-cards', 'pages',
        ] as const

        const dependents: string[] = []

        for (const collection of collectionsWithMedia) {
          const found = await req.payload.find({
            collection,
            depth: 0,
            limit: 3,
            pagination: false,
            overrideAccess: true,
            where: {
              or: [
                { image: { equals: id } },
                { cover: { equals: id } },
                { photo: { equals: id } },
                { logo: { equals: id } },
                { avatar: { equals: id } },
                { heroImage: { equals: id } },
                { 'seo.ogImage': { equals: id } },
              ],
            },
          }).catch(() => null)

          if (found?.docs?.length) {
            dependents.push(`${collection} (${found.docs.length}${found.docs.length === 3 ? '+' : ''})`)
          }
        }

        if (dependents.length) {
          throw new Error(
            `This image is still used by: ${dependents.join(', ')}. Replace it there first, then delete it here.`,
          )
        }
      },
    ],
  },
}

export default Media
export { MAX_UPLOAD_BYTES }
