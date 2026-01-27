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

import type { ComponentType } from 'react'

// ═══════════════════════════════════════════════════════════════════════════
// Type Imports (for typeof pattern - enables IDE navigation)
// ═══════════════════════════════════════════════════════════════════════════

// Components - HnBanner group
import type { HnBanner } from './components/HnBanner'
import type { HnBannerWithDismissal } from './components/HnBanner/HnBannerWithDismissal'
import type { HnBannerForCarousel } from './components/HnBanner/HnBannerForCarousel'
import type { HnBannerForHistory } from './components/HnBanner/HnBannerForHistory'
import type { HnBannerForQueue } from './components/HnBanner/HnBannerForQueue'
import type { WithHnBannerConditionsProps } from './components/withHnBannerConditions'

// Components - Dashboard
import type { HnDashboardBanner } from './components/HnDashboardBanner/HnDashboardBanner'

// Components - Other banners (raw components for type reference)
import type { HnActivatedSettingsBanner } from './components/HnActivatedSettingsBanner/HnActivatedSettingsBanner'
// Note: HnPendingBanner and HnMiniTxBanner are exported as HOC-wrapped versions

// Components - Signup and Login
import type { HnSignupFlow } from './components/HnSignupFlow'
import type { HnLoginCard } from './components/HnLoginCard/HnLoginCard'

// Components - Security Report
import type { HnSecurityReportBtn } from './components/HnSecurityReportBtn/HnSecurityReportBtn'

// Components - Queue Assessment
import type { HnQueueAssessment } from './components/HnQueueAssessment/HnQueueAssessment'
import type { HnQueueAssessmentBanner } from './components/HnQueueAssessmentBanner/HnQueueAssessmentBanner'

// Components - Feature wrapper and UI
import type { HnFeature } from './components/HnFeature/HnFeature'
import type { HypernativeLogo } from './components/HypernativeLogo'
import type { HypernativeTooltip } from './components/HypernativeTooltip/HypernativeTooltip'

// Components - Provider
import type { QueueAssessmentProvider } from './components/QueueAssessmentProvider'

// HOC Wrappers
import type { withHnFeature } from './components/withHnFeature'
import type { withHnBannerConditions } from './components/withHnBannerConditions'
import type { withHnSignupFlow } from './components/withHnSignupFlow'

// Hooks
import type { useIsHypernativeGuard } from './hooks/useIsHypernativeGuard'
import type { useIsHypernativeFeature } from './hooks/useIsHypernativeFeature'
import type { useIsHypernativeQueueScanFeature } from './hooks/useIsHypernativeQueueScanFeature'
import type { useIsHypernativeEligible } from './hooks/useIsHypernativeEligible'
import type { useBannerStorage } from './hooks/useBannerStorage'
import type { useBannerVisibility } from './hooks/useBannerVisibility'
import type { useTrackBannerEligibilityOnConnect } from './hooks/useTrackBannerEligibilityOnConnect'
import type { useHypernativeOAuth } from './hooks/useHypernativeOAuth'
import type { useAuthToken } from './hooks/useAuthToken'
import type { useQueueAssessment } from './hooks/useQueueAssessment'
import type { useQueueBatchAssessments } from './hooks/useQueueBatchAssessments'
import type { useShowHypernativeAssessment } from './hooks/useShowHypernativeAssessment'
import type { useHnAssessmentSeverity } from './hooks/useHnAssessmentSeverity'
import type { useAssessmentUrl } from './hooks/useAssessmentUrl'
import type { useCalendly } from './hooks/useCalendly'

// Services
import type { isHypernativeGuard } from './services/hypernativeGuardCheck'
import type { buildSecurityReportUrl } from './utils/buildSecurityReportUrl'

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
  /** Wrapped component for Settings page - accepts isDismissable and label props */
  HnBannerForSettings: ComponentType<WithHnBannerConditionsProps>
  HnDashboardBanner: typeof HnDashboardBanner
  /** Wrapped component with HOCs - requires no props */
  HnDashboardBannerWithNoBalanceCheck: ComponentType<object>
  /** Wrapped component with HOCs - requires no props */
  HnPendingBanner: ComponentType<object>
  /** Wrapped component with HOCs - requires no props */
  HnMiniTxBanner: ComponentType<object>
  HnActivatedSettingsBanner: typeof HnActivatedSettingsBanner
  /** Wrapped component for Settings page - shows when guard is active and user is owner */
  HnActivatedBannerForSettings: ComponentType<object>
  HnSignupFlow: typeof HnSignupFlow
  HnLoginCard: typeof HnLoginCard
  HnSecurityReportBtn: typeof HnSecurityReportBtn
  HnQueueAssessment: typeof HnQueueAssessment
  HnQueueAssessmentBanner: typeof HnQueueAssessmentBanner
  HnFeature: typeof HnFeature
  HypernativeLogo: typeof HypernativeLogo
  HypernativeTooltip: typeof HypernativeTooltip
  QueueAssessmentProvider: typeof QueueAssessmentProvider

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

  isHypernativeGuard: typeof isHypernativeGuard
  buildSecurityReportUrl: typeof buildSecurityReportUrl

  // ═══════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════

  /** Banner element ID for carousel integration */
  hnBannerID: string
}
