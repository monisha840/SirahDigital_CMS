import React from 'react'
import { SirahMark } from './SirahMark'

/**
 * Replaces the Payload wordmark on the login and unauthorised screens.
 *
 * Registered as `admin.components.graphics.Logo` in payload.config.ts. After
 * changing either graphic, run `npx payload generate:importmap` — the admin
 * resolves custom components through that generated map, not through a normal
 * import, so an unregenerated map means the change simply does not appear.
 *
 * `currentColor` on the wordmark, so it stays legible if the admin is switched
 * to the dark theme. The accent is the site's cyan and is the only fixed
 * colour here.
 */
export const Logo = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      color: 'currentColor',
    }}
  >
    <SirahMark size={44} id="sirah-logo-mark" />
    <span
      style={{
        fontSize: '30px',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}
    >
      Sirah <span style={{ color: '#22D3EE' }}>CMS</span>
    </span>
  </div>
)

export default Logo
