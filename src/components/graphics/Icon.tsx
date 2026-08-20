import React from 'react'
import { SirahMark } from './SirahMark'

/**
 * Replaces the Payload cube in the admin nav and breadcrumb.
 *
 * Registered as `admin.components.graphics.Icon`. Mark only, no wordmark —
 * it renders at around 24px next to the breadcrumb trail, where a two-word
 * lockup would be unreadable.
 */
export const Icon = () => <SirahMark size={26} id="sirah-nav-mark" />

export default Icon
