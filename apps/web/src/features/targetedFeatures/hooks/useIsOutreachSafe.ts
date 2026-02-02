import { useTargetedMessagingGetTargetedSafeV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/targeted-messages'

import useSafeInfo from '@/hooks/useSafeInfo'
import { sameAddress } from '@safe-global/utils/utils/addresses'
import type { SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

export type OutreachSafeResult = {
  isTargeted: boolean
  loading: boolean
}

export function useIsOutreachSafe(
  outreachId: number,
  options?: { skip?: boolean; safeInfo?: SafeInfo },
): OutreachSafeResult {
  const currentSafeInfo = useSafeInfo()

  const safe = options?.safeInfo || currentSafeInfo.safe

  const isSafeUnavailable = !safe.address.value
  const shouldSkip = options?.skip || isSafeUnavailable

  const { data, isLoading } = useTargetedMessagingGetTargetedSafeV1Query(
    {
      outreachId,
      chainId: safe.chainId,
      safeAddress: safe.address.value,
    },
    { skip: shouldSkip },
  )

  const isTargeted = data?.outreachId === outreachId && sameAddress(data.address, safe.address.value)
  // Only report loading during the initial fetch (isLoading), not during background refetches (isFetching)
  // This prevents showing skeleton indefinitely for non-targeted Safes during background refetches
  // Once the initial query completes (isLoading becomes false), we have a definitive answer
  const loading = isSafeUnavailable ? false : !options?.skip && isLoading

  return { isTargeted, loading }
}
