import React from 'react'
import Link from 'next/link'

/**
 * A way into the Availability screen from the admin nav.
 *
 * Custom views are routes, not collections, so Payload does not list them
 * anywhere by itself. Without this the screen exists but is reachable only by
 * typing the URL — which is how a feature gets built, demoed once, and then
 * forgotten because nobody can find it again.
 *
 * `afterNavLinks` rather than a nav override: it adds one entry and leaves the
 * vendor's own navigation alone, so nothing here has to be revisited when
 * Payload changes how the sidebar is built.
 */
export function AvailabilityNavLink() {
  return (
    <Link
      href="/admin/availability"
      className="nav__link"
      style={{ display: 'block', padding: '0.5rem 0' }}
    >
      Availability
    </Link>
  )
}

export default AvailabilityNavLink
