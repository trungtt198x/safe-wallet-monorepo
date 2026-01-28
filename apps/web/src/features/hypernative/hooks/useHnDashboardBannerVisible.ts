import { useBannerVisibility } from './useBannerVisibility'
import { BannerType } from './useBannerStorage'

/**
 * Component-specific visibility guard for HnDashboardBannerWithNoBalanceCheck.
 *
 * Encapsulates ALL visibility logic for the dashboard banner (no balance check):
 * - Feature flag enabled
 * - User is Safe owner
 * - Hypernative guard is NOT installed
 * - Banner not dismissed
 * - Does NOT require minimum balance (used for undeployed safes)
 *
 * @returns `true` to render, `false` to hide, `undefined` while loading
 */
export const useHnDashboardBannerVisible = (): boolean | undefined => {
  const { showBanner, loading } = useBannerVisibility(BannerType.NoBalanceCheck)

  if (loading) return undefined
  return showBanner
}
