import React from 'react'
import { SlotCalendar } from './SlotCalendar'
import './slot-calendar.css'

/**
 * The Availability screen — /admin/availability.
 *
 * This is where the TidyCal dashboard used to be. Opening hours, the length of a
 * call, the gap between them and which days are offered all used to live in a
 * third party's settings page: invisible to this codebase, absent from version
 * control, and knowable only by logging in as the account that owned it. They
 * are rows in our own database now, and this is the screen that writes them.
 *
 * ── Why no `headers` prop ────────────────────────────────────────────────
 * It would be the natural thing to pass, and it is a trap. SlotCalendar builds
 * its fetch client inside `useMemo(..., [api, baseUrl, headers])`, and `refresh`
 * depends on that client while `useEffect(refresh, [refresh])` depends on
 * `refresh`. Hand it an inline `headers={() => ({...})}` and the identity changes
 * on every render, so the client is rebuilt, so the effect re-runs, so it renders
 * again — a request loop against the API for as long as the tab is open.
 *
 * None is needed anyway. `/api/admin` is same-origin with the admin panel, and
 * fetch sends cookies to same-origin by default, so Payload's own session
 * authenticates the request. `staff()` in endpoints/slots.ts is what enforces it.
 *
 * ── Why the timezone is not a picker ─────────────────────────────────────
 * Availability is offered in one zone — the founder's — and every slot stores
 * its own, so a future change of mind does not rewrite history. A picker here
 * would imply per-slot zones are a supported thing, which would make the month
 * grid ambiguous about which day a row belongs to.
 */

const TIME_ZONE = process.env.BOOKING_TIMEZONE || 'Asia/Kolkata'

type ViewProps = {
  initPageResult?: {
    req?: { user?: { email?: string } | null }
  }
}

export function AvailabilityView({ initPageResult }: ViewProps) {
  const actor = initPageResult?.req?.user?.email || 'console'

  return (
    <div style={{ padding: '2rem', maxWidth: '72rem', margin: '0 auto' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Availability</h1>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7, maxWidth: '60ch', lineHeight: 1.6 }}>
          Times offered on the website&rsquo;s booking page. Adding a slot makes it bookable
          immediately; cancelling one withdraws it, and if someone had already booked it their call
          and its calendar event are called off too.
        </p>
      </header>

      {/* Everything inside this wrapper is styled by slot-calendar.css, which is
          scoped to the class so its generic utility names cannot escape into the
          rest of the admin. */}
      <div className="sc-scope">
        <SlotCalendar timeZone={TIME_ZONE} baseUrl="/api/admin" actor={actor} />
      </div>
    </div>
  )
}

export default AvailabilityView
