import { useBannerVisibility } from './useBannerVisibility'
import { BannerType } from './useBannerStorage'

/**
 * Component-specific visibility guard for HnBannerForHistory.
 *
 * Encapsulates ALL visibility logic for the history banner:
 * - Feature flag enabled
 * - User is Safe owner
 * - Safe has sufficient balance OR is targeted
 * - Hypernative guard is NOT installed
 * - Banner not dismissed
 *
 * @returns `true` to render, `false` to hide, `undefined` while loading
 */
export const useHnBannerForHistoryVisible = (): boolean | undefined => {
  const { showBanner, loading } = useBannerVisibility(BannerType.Promo)

  if (loading) return undefined
  return showBanner
}
