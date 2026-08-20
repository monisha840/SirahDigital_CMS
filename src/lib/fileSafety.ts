/**
 * Upload validation by magic bytes.
 *
 * The `Content-Type` header and the file extension are both attacker-supplied.
 * `evil.svg` renamed to `logo.png` arrives with `image/png` on the wire and
 * passes every extension check ever written. The only honest question is what
 * the first few bytes of the buffer actually are.
 *
 * SVG is absent from this list on purpose: it is executable XML and a stored
 * XSS vector in a CMS that serves uploads to the public. If a client logo only
 * exists as SVG, sanitise it out-of-band and upload the raster.
 */

export type SniffResult = { ok: true; mime: string } | { ok: false; reason: string }

const startsWith = (buf: Buffer, bytes: number[], offset = 0): boolean =>
  bytes.every((b, i) => buf[offset + i] === b)

const ascii = (buf: Buffer, str: string, offset = 0): boolean =>
  buf.slice(offset, offset + str.length).toString('latin1') === str

/** Signatures we accept, most specific first. */
const SIGNATURES: Array<{ mime: string; test: (b: Buffer) => boolean }> = [
  { mime: 'image/jpeg', test: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  { mime: 'image/png', test: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  { mime: 'image/gif', test: (b) => ascii(b, 'GIF87a') || ascii(b, 'GIF89a') },
  { mime: 'image/webp', test: (b) => ascii(b, 'RIFF') && ascii(b, 'WEBP', 8) },
  { mime: 'image/avif', test: (b) => ascii(b, 'ftyp', 4) && ascii(b, 'avif', 8) },
  { mime: 'image/avif', test: (b) => ascii(b, 'ftyp', 4) && ascii(b, 'avis', 8) },
  { mime: 'video/mp4', test: (b) => ascii(b, 'ftyp', 4) },
  { mime: 'application/pdf', test: (b) => ascii(b, '%PDF-') },
]

/*
 * 4 MB. Architecture §13 specifies 20 MB, but Vercel caps a serverless
 * function's request body at roughly 4.5 MB, so anything above this never
 * reaches the sniff below — the platform rejects it first, with an opaque
 * 413 the editor cannot act on. Refusing at 4 MB makes the limit honest and
 * the error message true.
 *
 * The alternative — clientUploads on the S3 adapter, which PUTs straight to
 * the bucket and bypasses the cap — was rejected deliberately: with it the
 * bytes never reach the server, so `req.file` is undefined and both the
 * polyglot sniff and blurDataURL generation in Media.ts silently no-op.
 * Losing the sniff to gain large uploads is a bad trade for a site that
 * accepts mp4 and PDF. Host video externally and reference it instead.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

export const sniff = (buffer: Buffer): SniffResult => {
  if (!buffer || buffer.length < 12) {
    return { ok: false, reason: 'File is empty or too short to identify.' }
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return { ok: false, reason: `File is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` }
  }

  // An SVG or HTML polyglot will lead with '<' or a BOM followed by '<'.
  const head = buffer.slice(0, 512).toString('latin1').trimStart().toLowerCase()
  if (head.startsWith('<')) {
    return {
      ok: false,
      reason:
        'XML/SVG/HTML uploads are rejected — they can carry scripts. Convert to PNG or WebP and try again.',
    }
  }

  const match = SIGNATURES.find((s) => s.test(buffer))
  if (!match) {
    return {
      ok: false,
      reason: 'Unrecognised file type. Allowed: JPEG, PNG, WebP, AVIF, GIF, MP4, PDF.',
    }
  }

  return { ok: true, mime: match.mime }
}

export const isRaster = (mime: string): boolean =>
  ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'].includes(mime)
