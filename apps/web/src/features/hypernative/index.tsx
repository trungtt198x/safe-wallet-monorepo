/**
 * Hypernative Feature - Public API
 *
 * This is the main entry point for the hypernative feature.
 * All external code should import from this barrel file only.
 *
 * @see apps/web/docs/feature-architecture.md for architecture guidelines
 */

import dynamic from 'next/dynamic'
import { withFeatureGuard } from '@/utils/withFeatureGuard'

// Internal guard hooks (used by withFeatureGuard)
import { useIsHypernativeEnabled } from './hooks/useIsHypernativeEnabled'
import { useIsHypernativeQueueScanEnabled } from './hooks/useIsHypernativeQueueScanEnabled'

// Component-specific visibility guards (encapsulate ALL visibility logic)
import { useHnBannerForQueueVisible } from './hooks/useHnBannerForQueueVisible'
import { useHnBannerForHistoryVisible } from './hooks/useHnBannerForHistoryVisible'
import { useHnBannerForCarouselVisible } from './hooks/useHnBannerForCarouselVisible'
import { useHnDashboardBannerVisible } from './hooks/useHnDashboardBannerVisible'
import { useHnLoginCardForQueueVisible } from './hooks/useHnLoginCardForQueueVisible'

// ============================================================================
// GUARDED COMPONENT EXPORTS (lazy-loaded + feature-gated)
// ============================================================================

// Banner Components (HYPERNATIVE feature flag)
const LazyHnBannerForCarousel = dynamic(
  () => import('./components/HnBanner/HnBannerForCarousel').then((m) => ({ default: m.HnBannerForCarousel })),
  { ssr: false },
)
const LazyHnBannerForQueue = dynamic(
  () => import('./components/HnBanner/HnBannerForQueue').then((m) => ({ default: m.HnBannerForQueue })),
  { ssr: false },
)
const LazyHnBannerForHistory = dynamic(
  () => import('./components/HnBanner/HnBannerForHistory').then((m) => ({ default: m.HnBannerForHistory })),
  { ssr: false },
)
const LazyHnBannerForSettings = dynamic(
  () => import('./components/HnBanner').then((m) => ({ default: m.HnBannerForSettings })),
  { ssr: false },
)

// All banners use component-specific guards that encapsulate ALL visibility logic
// Consumers just render the component - no need to import useBannerVisibility
export const HnBannerForCarousel = withFeatureGuard(LazyHnBannerForCarousel, useHnBannerForCarouselVisible)
export const HnBannerForQueue = withFeatureGuard(LazyHnBannerForQueue, useHnBannerForQueueVisible)
export const HnBannerForHistory = withFeatureGuard(LazyHnBannerForHistory, useHnBannerForHistoryVisible)
export const HnBannerForSettings = withFeatureGuard(LazyHnBannerForSettings, useIsHypernativeEnabled)

// Dashboard Banner
const LazyHnDashboardBanner = dynamic(
  () => import('./components/HnDashboardBanner/HnDashboardBanner').then((m) => ({ default: m.HnDashboardBanner })),
  { ssr: false },
)
const LazyHnDashboardBannerNoBalance = dynamic(
  () => import('./components/HnDashboardBanner').then((m) => ({ default: m.HnDashboardBannerWithNoBalanceCheck })),
  { ssr: false },
)

export const HnDashboardBanner = withFeatureGuard(LazyHnDashboardBanner, useIsHypernativeEnabled)
// Dashboard banner with component-specific guard (used in FirstSteps, no balance check)
export const HnDashboardBannerWithNoBalanceCheck = withFeatureGuard(
  LazyHnDashboardBannerNoBalance,
  useHnDashboardBannerVisible,
)

// Transaction Banners (HOC-wrapped with signup flow and banner conditions)
const LazyHnMiniTxBanner = dynamic(() => import('./components/HnMiniTxBanner'), { ssr: false })
const LazyHnPendingBanner = dynamic(() => import('./components/HnPendingBanner'), { ssr: false })

export const HnMiniTxBanner = withFeatureGuard(LazyHnMiniTxBanner, useIsHypernativeEnabled)
export const HnPendingBanner = withFeatureGuard(LazyHnPendingBanner, useIsHypernativeEnabled)

// Settings Banner
const LazyHnActivatedBannerForSettings = dynamic(
  () => import('./components/HnActivatedSettingsBanner').then((m) => ({ default: m.HnActivatedBannerForSettings })),
  { ssr: false },
)

export const HnActivatedBannerForSettings = withFeatureGuard(LazyHnActivatedBannerForSettings, useIsHypernativeEnabled)

// Queue Assessment Components (HYPERNATIVE_QUEUE_SCAN feature flag)
const LazyHnQueueAssessment = dynamic(
  () => import('./components/HnQueueAssessment/HnQueueAssessment').then((m) => ({ default: m.HnQueueAssessment })),
  { ssr: false },
)
const LazyHnQueueAssessmentForTxSummary = dynamic(
  () =>
    import('./components/HnQueueAssessment/HnQueueAssessmentForTxSummary').then((m) => ({
      default: m.HnQueueAssessmentForTxSummary,
    })),
  { ssr: false },
)
const LazyHnQueueAssessmentBanner = dynamic(
  () =>
    import('./components/HnQueueAssessmentBanner/HnQueueAssessmentBanner').then((m) => ({
      default: m.HnQueueAssessmentBanner,
    })),
  { ssr: false },
)
const LazyHnQueueAssessmentBannerForTxDetails = dynamic(
  () =>
    import('./components/HnQueueAssessmentBanner/HnQueueAssessmentBannerForTxDetails').then((m) => ({
      default: m.HnQueueAssessmentBannerForTxDetails,
    })),
  { ssr: false },
)

export const HnQueueAssessment = withFeatureGuard(LazyHnQueueAssessment, useIsHypernativeQueueScanEnabled)
// Self-contained TxSummary assessment - encapsulates visibility logic, assessment fetching, and auth
export const HnQueueAssessmentForTxSummary = withFeatureGuard(
  LazyHnQueueAssessmentForTxSummary,
  useIsHypernativeQueueScanEnabled,
)
export const HnQueueAssessmentBanner = withFeatureGuard(LazyHnQueueAssessmentBanner, useIsHypernativeQueueScanEnabled)
// Self-contained TxDetails banner - encapsulates visibility logic, assessment fetching, and auth
export const HnQueueAssessmentBannerForTxDetails = withFeatureGuard(
  LazyHnQueueAssessmentBannerForTxDetails,
  useIsHypernativeQueueScanEnabled,
)

// Login Card
const LazyHnLoginCard = dynamic(
  () => import('./components/HnLoginCard/HnLoginCard').then((m) => ({ default: m.HnLoginCard })),
  { ssr: false },
)

export const HnLoginCard = withFeatureGuard(LazyHnLoginCard, useIsHypernativeEnabled)
// Queue-specific login card with component-specific guard (eligibility + queue scan enabled)
export const HnLoginCardForQueue = withFeatureGuard(LazyHnLoginCard, useHnLoginCardForQueueVisible)

// Provider (no guard needed - internal state management)
// eslint-disable-next-line local-rules/require-feature-guard -- Context provider, not a UI component
export { QueueAssessmentProvider } from './components/QueueAssessmentProvider'

// Utility Components (no guard - used conditionally by consumers)
export const HypernativeTooltip = dynamic(() => import('./components/HypernativeTooltip/HypernativeTooltip'), {
  ssr: false,
})
export const HypernativeLogo = dynamic(() => import('./components/HypernativeLogo'), { ssr: false })

// ============================================================================
// HOOK EXPORTS (only hooks with legitimate cross-feature dependencies)
// ============================================================================

// Guard status - used by SafeHeaderInfo to show shield icon
export { useIsHypernativeGuard } from './hooks/useIsHypernativeGuard'

// Banner visibility - used by dashboard for "either/or" rendering (banner vs fallback)
export { useBannerVisibility } from './hooks/useBannerVisibility'

// Auth hooks - used by SafeShield for authenticated API calls
export { useAuthToken } from './hooks/useAuthToken'
export { useHypernativeOAuth, readPkce, clearPkce } from './hooks/useHypernativeOAuth'

// Eligibility - used by SafeShield to check if user can use Hypernative features
export { useIsHypernativeEligible } from './hooks/useIsHypernativeEligible'

// ============================================================================
// TYPE EXPORTS (zero runtime cost)
// ============================================================================

/* eslint-disable local-rules/require-feature-guard -- Type exports have zero runtime cost */
export type { HypernativeGuardCheckResult } from './hooks/useIsHypernativeGuard'
export type { BannerVisibilityResult } from './hooks/useBannerVisibility'
export type { HypernativeAuthStatus } from './hooks/useHypernativeOAuth'
export type { HypernativeEligibility } from './hooks/useIsHypernativeEligible'
export { BannerType } from './hooks/useBannerStorage'
/* eslint-enable local-rules/require-feature-guard */

// ============================================================================
// CONSTANT EXPORTS
// ============================================================================

export { hnBannerID, HYPERNATIVE_ALLOWLIST_OUTREACH_ID } from './constants'
export { HYPERNATIVE_OAUTH_CONFIG, getRedirectUri } from './config/oauth'

// ============================================================================
// STORE EXPORTS (for slices.ts compatibility)
// ============================================================================

// Note: Store is also exported from ./store/index.ts for backward compatibility
// The main store integration in src/store/slices.ts imports from '@/features/hypernative/store'
export * from './store'
