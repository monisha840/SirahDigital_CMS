import type { Field, FieldHook } from 'payload'

/**
 * A slug is a URL. Renaming one breaks every inbound link and every share, so
 * this field is deliberately awkward to change: it derives itself once from
 * the title and then stays put unless someone types over it on purpose.
 */

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    // Decompose, then strip the combining marks, so "Cafe" with an acute
    // becomes "cafe" rather than "caf". The Unicode property escape keeps this
    // file pure ASCII — a literal character class here would contain invisible
    // combining characters that editors hide and re-encoders mangle.
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallbackFrom: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)

    // Only auto-fill on create. On update an empty slug is a mistake worth
    // surfacing as a validation error, not something to silently regenerate —
    // regenerating would change a live URL because someone edited a heading.
    if (operation === 'create') {
      const source = data?.[fallbackFrom]
      if (typeof source === 'string') return slugify(source)
    }

    return value
  }

export const slugField = (fallbackFrom = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'The URL segment. Generated from the title on first save. Changing it breaks existing links — add a redirect if you do.',
  },
  hooks: {
    beforeValidate: [formatSlug(fallbackFrom)],
  },
})
