import { useMemo, useState, useEffect } from 'react'
import { IPFS_HOSTS, IS_OFFICIAL_HOST, OFFICIAL_HOSTS } from '@/config/constants'
import { APP_VERSION } from '@/config/version'
import useAsync from '@safe-global/utils/hooks/useAsync'

const GITHUB_API_URL = 'https://api.github.com/repos/5afe/safe-wallet-ipfs/releases/tags'

async function getGithubRelease(version: string) {
  const resp = await fetch(`${GITHUB_API_URL}/v${version}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!resp.ok) return false
  return await resp.json()
}

async function isOfficialIpfs(): Promise<boolean> {
  const data = await getGithubRelease(APP_VERSION)
  return data.body.includes(window.location.host)
}

function isIpfs() {
  return IPFS_HOSTS.test(window.location.host)
}

export const useIsOfficialHost = (): boolean => {
  // Use state to avoid hydration mismatch - start with SSR value
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const isOfficialHost = useMemo(() => {
    // During SSR and initial client render, use the SSR-safe value
    if (!hasMounted) {
      return IS_OFFICIAL_HOST
    }
    // After hydration, check the actual host
    return IS_OFFICIAL_HOST && OFFICIAL_HOSTS.test(window.location.host)
  }, [hasMounted])

  const [isTrustedIpfs = false] = useAsync<boolean>(() => {
    if (!hasMounted || isOfficialHost || !isIpfs()) return
    return isOfficialIpfs()
  }, [hasMounted, isOfficialHost])

  return isOfficialHost || isTrustedIpfs
}
