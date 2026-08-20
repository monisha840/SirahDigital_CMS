import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The admin panel is the only UI this app serves; it is never indexed and
  // never framed except by the site's own live preview (see headers below).
  reactStrictMode: true,

  /*
   * The CMS is served from https://sirahdigital.in/admin. It is its own Vercel
   * project; the site proxies /admin/* here with a Next rewrite (see the site's
   * next.config.js). `basePath` is what makes that safe: it puts EVERYTHING
   * this app serves — admin HTML, its /_next chunks, Payload's REST API,
   * GraphQL, and public/ — under /admin, so the two apps never share a URL
   * namespace and no rule ordering has to be trusted.
   *
   * It has to be basePath rather than assetPrefix. Payload's admin builds its
   * API URLs *relative* — formatAdminURL returns NEXT_BASE_PATH + routes.api
   * and ignores serverURL — so the API must sit on the same origin as the
   * admin page regardless. basePath is the only setting that moves both.
   */
  basePath: '/admin',

  experimental: {
    /*
     * Next 15 aborts a Server Action when Origin !== Host, which is exactly
     * what a proxy produces: the browser sends Origin: sirahdigital.in while
     * this app sees its own Vercel host. Payload's admin runs on server
     * functions, so without this the admin renders fine and then fails on
     * every save with "Invalid Server Actions request".
     *
     * Hostnames, not URLs — no scheme, no trailing slash. Add any staging or
     * preview host that needs a working admin.
     */
    serverActions: {
      allowedOrigins: (process.env.ADMIN_HOSTS || '')
        .split(',')
        .map((host) => host.trim())
        .filter(Boolean),
    },
  },

  async headers() {
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
    return [
      {
        /*
         * `source` is relative to basePath — Next prepends /admin itself. So
         * '/:path*' here covers '/admin/:path*' in the response. Writing
         * '/admin/:path*' would resolve to '/admin/admin/:path*' and every
         * header below would silently stop applying, including the frame and
         * noindex protections. This app serves nothing outside /admin, so one
         * rule is the whole surface.
         */
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // The admin may only be framed by the public site, and only so that
          // live preview works. Everything else is denied.
          //
          // NB: siteUrl is baked in at build time. Changing SITE_URL needs a
          // redeploy, not just an env update.
          { key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${siteUrl}` },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
