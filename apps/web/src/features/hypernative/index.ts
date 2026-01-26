/**
 * Hypernative Feature Public API
 *
 * This barrel file exports all public interfaces for the hypernative feature.
 * External code should import from '@/features/hypernative' only.
 *
 * Internal code within the feature should use relative imports.
 */
import dynamic from 'next/dynamic'

// ============================================================================
// HOOKS (named exports)
// ============================================================================

// Feature flag hook
export { useIsHypernativeEnabled } from './hooks/useIsHypernativeEnabled'

// Guard detection hook
export { useIsHypernativeGuard } from './hooks/useIsHypernativeGuard'
export type { HypernativeGuardCheckResult } from './hooks/useIsHypernativeGuard'

// Queue scan feature hook
export { useIsHypernativeQueueScanFeature } from './hooks/useIsHypernativeQueueScanFeature'

// Banner storage and visibility hooks
export { useBannerStorage } from './hooks/useBannerStorage'
export { useBannerVisibility } from './hooks/useBannerVisibility'
export type { BannerVisibilityResult } from './hooks/useBannerVisibility'

// Authentication hooks
export { useAuthToken } from './hooks/useAuthToken'
export { useHypernativeOAuth, readPkce, clearPkce } from './hooks/useHypernativeOAuth'
export type { HypernativeAuthStatus, PkceData } from './hooks/useHypernativeOAuth'

// Eligibility hook
export { useIsHypernativeEligible } from './hooks/useIsHypernativeEligible'
export type { HypernativeEligibility } from './hooks/useIsHypernativeEligible'

// Queue assessment hooks
export { useQueueAssessment } from './hooks/useQueueAssessment'
export { useQueueBatchAssessments } from './hooks/useQueueBatchAssessments'

// Display/UI hooks
export { useShowHypernativeAssessment } from './hooks/useShowHypernativeAssessment'
export { useCalendly } from './hooks/useCalendly'
export { useAssessmentUrl } from './hooks/useAssessmentUrl'
export { useHnAssessmentSeverity } from './hooks/useHnAssessmentSeverity'

// ============================================================================
// TYPES (zero-cost exports)
// ============================================================================

export { BannerType } from './hooks/useBannerStorage'

// ============================================================================
// CONSTANTS
// ============================================================================

export { MIN_BALANCE_USD } from './hooks/useBannerVisibility'
export { hnBannerID } from './components/HnBanner/HnBanner'

// ============================================================================
// COMPONENTS (lazy-loaded via next/dynamic for code-splitting)
// ============================================================================

// Dashboard banners
export const HnDashboardBannerWithNoBalanceCheck = dynamic(
  () => import('./components/HnDashboardBanner').then((mod) => ({ default: mod.HnDashboardBannerWithNoBalanceCheck })),
  { ssr: false },
)

// Mini transaction banner
export const HnMiniTxBanner = dynamic(() => import('./components/HnMiniTxBanner'), { ssr: false })

// Carousel and page-specific banners
export const HnBannerForCarousel = dynamic(
  () => import('./components/HnBanner').then((mod) => ({ default: mod.HnBannerForCarousel })),
  { ssr: false },
)
export const HnBannerForHistory = dynamic(
  () => import('./components/HnBanner').then((mod) => ({ default: mod.HnBannerForHistory })),
  { ssr: false },
)
export const HnBannerForQueue = dynamic(
  () => import('./components/HnBanner').then((mod) => ({ default: mod.HnBannerForQueue })),
  { ssr: false },
)
export const HnBannerForSettings = dynamic(
  () => import('./components/HnBanner').then((mod) => ({ default: mod.HnBannerForSettings })),
  { ssr: false },
)

// Settings page activated banner
export const HnActivatedBannerForSettings = dynamic(
  () => import('./components/HnActivatedSettingsBanner').then((mod) => ({ default: mod.HnActivatedBannerForSettings })),
  { ssr: false },
)

// Pending banner
export const HnPendingBanner = dynamic(() => import('./components/HnPendingBanner'), { ssr: false })

// Login card
export const HnLoginCard = dynamic(() => import('./components/HnLoginCard'), { ssr: false })

// Queue assessment components
export const HnQueueAssessment = dynamic(
  () => import('./components/HnQueueAssessment').then((mod) => ({ default: mod.HnQueueAssessment })),
  { ssr: false },
)
export const HnQueueAssessmentBanner = dynamic(
  () => import('./components/HnQueueAssessmentBanner').then((mod) => ({ default: mod.HnQueueAssessmentBanner })),
  { ssr: false },
)
export const QueueAssessmentProvider = dynamic(
  () => import('./components/QueueAssessmentProvider').then((mod) => ({ default: mod.QueueAssessmentProvider })),
  { ssr: false },
)

// Tooltip and logo
export const HypernativeTooltip = dynamic(() => import('./components/HypernativeTooltip'), { ssr: false })
export const HypernativeLogo = dynamic(
  () => import('./components/HypernativeLogo').then((mod) => ({ default: mod.HypernativeLogo })),
  { ssr: false },
)

// OAuth callback handler
export const OAuthCallbackHandler = dynamic(() => import('./components/OAuthCallbackHandler'), { ssr: false })
