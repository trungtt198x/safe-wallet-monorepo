import type { NextPage } from 'next'
import Head from 'next/head'
import { OAuthCallbackHandler } from '@/features/hypernative'

/**
 * OAuth callback page for Hypernative authentication
 *
 * This page handles the OAuth redirect after user authorization.
 * All logic is encapsulated in the OAuthCallbackHandler component.
 */
const HypernativeOAuthCallback: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hypernative Authentication</title>
      </Head>
      <OAuthCallbackHandler />
    </>
  )
}

export default HypernativeOAuthCallback
