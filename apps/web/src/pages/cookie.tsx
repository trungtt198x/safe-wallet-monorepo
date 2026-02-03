import type { NextPage } from 'next'
import Head from 'next/head'
import { useIsOfficialHost } from '@/hooks/useIsOfficialHost'
import { BRAND_NAME } from '@/config/constants'
import { CookiePolicy as SafeCookiePolicy } from '@/components/legal'

const CookiePolicy: NextPage = () => {
  const isOfficialHost = useIsOfficialHost()

  return (
    <>
      <Head>
        <title>{`${BRAND_NAME} – Cookie policy`}</title>
      </Head>

      <main style={{ lineHeight: '1.5' }}>{isOfficialHost && <SafeCookiePolicy />}</main>
    </>
  )
}

export default CookiePolicy
