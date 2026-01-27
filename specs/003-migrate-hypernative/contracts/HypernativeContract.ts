/**
 * Hypernative Feature Contract
 *
 * This TypeScript interface defines the public API surface for the Hypernative feature
 * following the feature-architecture-v2 pattern.
 *
 * Naming Conventions:
 * - PascalCase → Component (stub renders null)
 * - useSomething → Hook (stub returns {})
 * - camelCase → Service (undefined when not ready, check $isReady)
 *
 * @see apps/web/docs/feature-architecture-v2.md
 */

// ═══════════════════════════════════════════════════════════════════════════
// Type Imports (for typeof pattern - enables IDE navigation)
// ═══════════════════════════════════════════════════════════════════════════

// Components
import type HnBanner from '../components/HnBanner'
import type HnBannerWithDismissal from '../components/HnBanner/HnBannerWithDismissal'
import type { HnBannerForCarousel, HnBannerForHistory, HnBannerForQueue } from '../components/HnBanner'
import type HnDashboardBanner from '../components/HnDashboardBanner'
import type HnDashboardBannerWithNoBalanceCheck from '../components/HnDashboardBanner/HnDashboardBannerWithNoBalanceCheck'
import type HnPendingBanner from '../components/HnPendingBanner'
import type HnMiniTxBanner from '../components/HnMiniTxBanner'
import type HnSignupFlow from '../components/HnSignupFlow'
import type HnSecurityReportBtn from '../components/HnSecurityReportBtn'
import type HnQueueAssessment from '../components/HnQueueAssessment'
import type HnQueueAssessmentBanner from '../components/HnQueueAssessmentBanner'
import type HnActivatedSettingsBanner from '../components/HnActivatedSettingsBanner'
import type { HnBannerForSettings, HnActivatedBannerForSettings } from '../components/HnBanner'
import type HnLoginCard from '../components/HnLoginCard'
import type HnFeature from '../components/HnFeature'
import type HypernativeLogo from '../components/HypernativeLogo'
import type HypernativeTooltip from '../components/HypernativeTooltip'

// HOC Wrappers
import type { withHnFeature } from '../components/withHnFeature'
import type { withHnBannerConditions } from '../components/withHnBannerConditions'
import type { withHnSignupFlow } from '../components/withHnSignupFlow'

// Hooks
import type { useIsHypernativeGuard } from '../hooks/useIsHypernativeGuard'
import type { useIsHypernativeFeature } from '../hooks/useIsHypernativeFeature'
import type { useIsHypernativeQueueScanFeature } from '../hooks/useIsHypernativeQueueScanFeature'
import type { useIsHypernativeEligible } from '../hooks/useIsHypernativeEligible'
import type { useBannerStorage } from '../hooks/useBannerStorage'
import type { useBannerVisibility } from '../hooks/useBannerVisibility'
import type { useTrackBannerEligibilityOnConnect } from '../hooks/useTrackBannerEligibilityOnConnect'
import type { useHypernativeOAuth } from '../hooks/useHypernativeOAuth'
import type { useAuthToken } from '../hooks/useAuthToken'
import type { useQueueAssessment } from '../hooks/useQueueAssessment'
import type { useQueueBatchAssessments } from '../hooks/useQueueBatchAssessments'
import type { useShowHypernativeAssessment } from '../hooks/useShowHypernativeAssessment'
import type { useHnAssessmentSeverity } from '../hooks/useHnAssessmentSeverity'
import type { useAssessmentUrl } from '../hooks/useAssessmentUrl'
import type { useCalendly } from '../hooks/useCalendly'

// Services
import type { hypernativeGuardCheck } from '../services/hypernativeGuardCheck'
import type { buildSecurityReportUrl } from '../services/buildSecurityReportUrl'

// Context Providers
import type { QueueAssessmentProvider } from '../contexts/QueueAssessmentContext'

// ═══════════════════════════════════════════════════════════════════════════
// Contract Interface
// ═══════════════════════════════════════════════════════════════════════════

/**
 * HypernativeContract defines all public exports of the Hypernative feature.
 *
 * This interface uses a FLAT structure (no nested categories).
 * The naming convention determines stub behavior when the feature is loading/disabled:
 *
 * - Components (PascalCase): Stub renders `null`
 * - Hooks (useSomething): Stub returns `{}` for safe destructuring
 * - Services (camelCase): `undefined` - check `$isReady` before calling
 */
export interface HypernativeContract {
  // ═══════════════════════════════════════════════════════════════
  // COMPONENTS
  // ═══════════════════════════════════════════════════════════════

  HnBanner: typeof HnBanner
  HnBannerWithDismissal: typeof HnBannerWithDismissal
  HnBannerForCarousel: typeof HnBannerForCarousel
  HnBannerForHistory: typeof HnBannerForHistory
  HnBannerForQueue: typeof HnBannerForQueue
  HnDashboardBanner: typeof HnDashboardBanner
  HnDashboardBannerWithNoBalanceCheck: typeof HnDashboardBannerWithNoBalanceCheck
  HnPendingBanner: typeof HnPendingBanner
  HnMiniTxBanner: typeof HnMiniTxBanner
  HnSignupFlow: typeof HnSignupFlow
  HnSecurityReportBtn: typeof HnSecurityReportBtn
  HnQueueAssessment: typeof HnQueueAssessment
  HnQueueAssessmentBanner: typeof HnQueueAssessmentBanner
  HnActivatedSettingsBanner: typeof HnActivatedSettingsBanner
  HnBannerForSettings: typeof HnBannerForSettings
  HnActivatedBannerForSettings: typeof HnActivatedBannerForSettings
  HnLoginCard: typeof HnLoginCard
  HnFeature: typeof HnFeature
  HypernativeLogo: typeof HypernativeLogo
  HypernativeTooltip: typeof HypernativeTooltip

  // ═══════════════════════════════════════════════════════════════
  // HOC WRAPPERS
  // ═══════════════════════════════════════════════════════════════

  withHnFeature: typeof withHnFeature
  withHnBannerConditions: typeof withHnBannerConditions
  withHnSignupFlow: typeof withHnSignupFlow

  // ═══════════════════════════════════════════════════════════════
  // HOOKS
  // ═══════════════════════════════════════════════════════════════

  useIsHypernativeGuard: typeof useIsHypernativeGuard
  useIsHypernativeFeature: typeof useIsHypernativeFeature
  useIsHypernativeQueueScanFeature: typeof useIsHypernativeQueueScanFeature
  useIsHypernativeEligible: typeof useIsHypernativeEligible
  useBannerStorage: typeof useBannerStorage
  useBannerVisibility: typeof useBannerVisibility
  useTrackBannerEligibilityOnConnect: typeof useTrackBannerEligibilityOnConnect
  useHypernativeOAuth: typeof useHypernativeOAuth
  useAuthToken: typeof useAuthToken
  useQueueAssessment: typeof useQueueAssessment
  useQueueBatchAssessments: typeof useQueueBatchAssessments
  useShowHypernativeAssessment: typeof useShowHypernativeAssessment
  useHnAssessmentSeverity: typeof useHnAssessmentSeverity
  useAssessmentUrl: typeof useAssessmentUrl
  useCalendly: typeof useCalendly

  // ═══════════════════════════════════════════════════════════════
  // SERVICES
  // ═══════════════════════════════════════════════════════════════

  hypernativeGuardCheck: typeof hypernativeGuardCheck
  buildSecurityReportUrl: typeof buildSecurityReportUrl

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT PROVIDERS
  // ═══════════════════════════════════════════════════════════════

  QueueAssessmentProvider: typeof QueueAssessmentProvider
}

// ═══════════════════════════════════════════════════════════════════════════
// Public Types (re-exported from types.ts)
// ═══════════════════════════════════════════════════════════════════════════

export type { BannerType } from '../types'
export type { HypernativeAuthStatus, HypernativeEligibility } from '../types'
