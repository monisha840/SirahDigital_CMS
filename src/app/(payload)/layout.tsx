/* THIS FILE IS GENERATED-SHAPED BOILERPLATE — it wires the Payload admin into
 * the Next App Router. There is no Sirah-specific logic here; everything that
 * matters lives in src/payload.config.ts and src/collections/.
 */
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

/*
 * Payload's global admin stylesheet. Without this line the admin renders as
 * unstyled HTML — serif text, no layout, no theme.
 *
 * It is easy to miss why: the page still ships a stylesheet, because every
 * Payload component imports its own SCSS and Next bundles those into the
 * route's chunk. What that chunk does NOT contain is the base layer — the
 * reset, the typography, the theme variables and the view templates
 * (`template-minimal`, `login__form`). So the symptom is a page with a
 * 389KB stylesheet attached and no styling to show for it.
 *
 * Must stay above './custom.scss': the overrides below are written against
 * these rules and have to win on order, not specificity.
 */
import '@payloadcms/next/css'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
