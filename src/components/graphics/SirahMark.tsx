import React from 'react'

/**
 * The Sirah mark, drawn rather than shipped as an image.
 *
 * An SVG rather than a PNG because this renders at 24px in the nav and at
 * 44px on the login screen, on light and dark admin themes, and a raster at
 * two sizes would need two files and would still be soft on a retina panel.
 *
 * The gradient is the site's own — indigo through purple to cyan, in that
 * order — so the CMS and the site read as one product.
 *
 * `id` is parameterised because the login screen renders the logo while the
 * nav renders the icon, and two identical gradient ids in one document is the
 * kind of thing that works until it quietly does not.
 */
export const SirahMark = ({ size = 40, id = 'sirah-mark' }: { size?: number; id?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" role="img" aria-hidden="true">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="52%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>
    </defs>

    <rect x="1" y="1" width="46" height="46" rx="13" fill={`url(#${id})`} />

    {/* The S, as a single stroked curve rather than a text glyph — a <text>
        element here would inherit whatever font the admin happens to load. */}
    <path
      d="M32 16.5C32 12.9 28.4 10.5 24 10.5C19.6 10.5 16 12.9 16 16.8C16 24.4 32 21.8 32 30.2C32 34.6 28.4 37.5 23.6 37.5C19.2 37.5 16 35.2 16 31.6"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SirahMark
