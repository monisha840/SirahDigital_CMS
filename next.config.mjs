import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The admin panel is the only UI this app serves; it is never indexed and
  // never framed except by the site's own live preview (see headers below).
  reactStrictMode: true,

  async headers() {
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        // The admin may only be framed by the public site, and only so that
        // live preview works. Everything else is denied.
        source: '/admin/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${siteUrl}` },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
