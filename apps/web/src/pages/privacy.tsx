import type { NextPage } from 'next'
import Head from 'next/head'
import { useIsOfficialHost } from '@/hooks/useIsOfficialHost'
import { BRAND_NAME } from '@/config/constants'
import { PrivacyPolicy as SafePrivacyPolicy } from '@/components/legal'

const PrivacyPolicy: NextPage = () => {
  const isOfficialHost = useIsOfficialHost()

  return (
    <>
      <Head>
        <title>{`${BRAND_NAME} – Privacy policy`}</title>
      </Head>

      <main style={{ lineHeight: '1.5' }}>{isOfficialHost && <SafePrivacyPolicy />}</main>
    </>
  )
}

export default PrivacyPolicy
