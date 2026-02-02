import { useIsOutreachSafe } from '@/features/targetedFeatures/hooks/useIsOutreachSafe'
import { useIsHypernativeGuard } from './useIsHypernativeGuard'
import { HYPERNATIVE_ALLOWLIST_OUTREACH_ID } from '../constants'
import type { SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

export type HypernativeEligibility = {
  isHypernativeEligible: boolean
  isHypernativeGuard: boolean
  isAllowlistedSafe: boolean
  loading: boolean
}

/**
 * Determines whether the current Safe is eligible for Hypernative CTAs.
 * Eligibility requires a Hypernative guard installed or targeted outreach membership.
 * @param safeInfo - The Safe info to check the guard for (optional, defaults to current Safe info)
 */
export const useIsHypernativeEligible = (safeInfo?: SafeInfo): HypernativeEligibility => {
  const { isHypernativeGuard, loading: guardLoading } = useIsHypernativeGuard(safeInfo)
  const { isTargeted: isAllowlistedSafe, loading: outreachLoading } = useIsOutreachSafe(
    HYPERNATIVE_ALLOWLIST_OUTREACH_ID,
    { safeInfo },
  )

  return {
    isHypernativeEligible: isHypernativeGuard || isAllowlistedSafe,
    isHypernativeGuard,
    isAllowlistedSafe,
    loading: guardLoading || outreachLoading,
  }
}
