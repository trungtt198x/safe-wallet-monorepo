import type { NextPage } from 'next'
import Head from 'next/head'
import { useIsOfficialHost } from '@/hooks/useIsOfficialHost'
import { BRAND_NAME } from '@/config/constants'
import { Terms as SafeTerms } from '@/components/legal'

const Terms: NextPage = () => {
  const isOfficialHost = useIsOfficialHost()

  return (
    <>
      <Head>
        <title>{`${BRAND_NAME} – Terms`}</title>
      </Head>

      <main style={{ lineHeight: '1.5' }}>{isOfficialHost && <SafeTerms />}</main>
    </>
  )
}

export default Terms
