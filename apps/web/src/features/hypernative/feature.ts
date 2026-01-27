/**
 * Hypernative Feature Implementation
 *
 * This file is lazy-loaded via createFeatureHandle. Uses direct imports with a
 * flat structure - naming conventions determine stub behavior:
 * - PascalCase → component (stub renders null)
 * - useSomething → hook (stub returns {})
 * - camelCase → service (undefined when not ready)
 *
 * @see apps/web/docs/feature-architecture-v2.md
 */

import type { HypernativeContract } from './contract'

// ═══════════════════════════════════════════════════════════════════════════
// Component Imports
// ═══════════════════════════════════════════════════════════════════════════

// HnBanner group
import { HnBanner, HnBannerForSettings, hnBannerID } from './components/HnBanner'
import { HnBannerWithDismissal } from './components/HnBanner/HnBannerWithDismissal'
import { HnBannerForCarousel } from './components/HnBanner/HnBannerForCarousel'
import { HnBannerForHistory } from './components/HnBanner/HnBannerForHistory'
import { HnBannerForQueue } from './components/HnBanner/HnBannerForQueue'

// Dashboard - raw and wrapped variants
import { HnDashboardBanner } from './components/HnDashboardBanner/HnDashboardBanner'
import { HnDashboardBannerWithNoBalanceCheck } from './components/HnDashboardBanner'

// Other banners - import wrapped versions (default exports) for ready-to-use components
import HnPendingBanner from './components/HnPendingBanner'
import HnMiniTxBanner from './components/HnMiniTxBanner'
import { HnActivatedSettingsBanner, HnActivatedBannerForSettings } from './components/HnActivatedSettingsBanner'

// Signup and Login
import { HnSignupFlow } from './components/HnSignupFlow'
import { HnLoginCard } from './components/HnLoginCard/HnLoginCard'

// Security Report
import { HnSecurityReportBtn } from './components/HnSecurityReportBtn/HnSecurityReportBtn'

// Queue Assessment
import { HnQueueAssessment } from './components/HnQueueAssessment/HnQueueAssessment'
import { HnQueueAssessmentBanner } from './components/HnQueueAssessmentBanner/HnQueueAssessmentBanner'

// Feature wrapper and UI
import { HnFeature } from './components/HnFeature/HnFeature'
import { HypernativeLogo } from './components/HypernativeLogo'
import { HypernativeTooltip } from './components/HypernativeTooltip/HypernativeTooltip'

// Provider
import { QueueAssessmentProvider } from './components/QueueAssessmentProvider'

// ═══════════════════════════════════════════════════════════════════════════
// HOC Imports
// ═══════════════════════════════════════════════════════════════════════════

import { withHnFeature } from './components/withHnFeature'
import { withHnBannerConditions } from './components/withHnBannerConditions'
import { withHnSignupFlow } from './components/withHnSignupFlow'

// ═══════════════════════════════════════════════════════════════════════════
// Hook Imports
// ═══════════════════════════════════════════════════════════════════════════

import { useIsHypernativeGuard } from './hooks/useIsHypernativeGuard'
import { useIsHypernativeFeature } from './hooks/useIsHypernativeFeature'
import { useIsHypernativeQueueScanFeature } from './hooks/useIsHypernativeQueueScanFeature'
import { useIsHypernativeEligible } from './hooks/useIsHypernativeEligible'
import { useBannerStorage } from './hooks/useBannerStorage'
import { useBannerVisibility } from './hooks/useBannerVisibility'
import { useTrackBannerEligibilityOnConnect } from './hooks/useTrackBannerEligibilityOnConnect'
import { useHypernativeOAuth } from './hooks/useHypernativeOAuth'
import { useAuthToken } from './hooks/useAuthToken'
import { useQueueAssessment } from './hooks/useQueueAssessment'
import { useQueueBatchAssessments } from './hooks/useQueueBatchAssessments'
import { useShowHypernativeAssessment } from './hooks/useShowHypernativeAssessment'
import { useHnAssessmentSeverity } from './hooks/useHnAssessmentSeverity'
import { useAssessmentUrl } from './hooks/useAssessmentUrl'
import { useCalendly } from './hooks/useCalendly'

// ═══════════════════════════════════════════════════════════════════════════
// Service Imports
// ═══════════════════════════════════════════════════════════════════════════

import { isHypernativeGuard } from './services/hypernativeGuardCheck'
import { buildSecurityReportUrl } from './utils/buildSecurityReportUrl'

// ═══════════════════════════════════════════════════════════════════════════
// Feature Implementation Export
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hypernative feature implementation.
 *
 * Flat structure with naming conventions determining stub behavior:
 * - PascalCase components render null when not ready
 * - useSomething hooks return {} when not ready
 * - camelCase services are undefined when not ready (check $isReady)
 */
const feature: HypernativeContract = {
  // Components
  HnBanner,
  HnBannerWithDismissal,
  HnBannerForCarousel,
  HnBannerForHistory,
  HnBannerForQueue,
  HnBannerForSettings,
  HnDashboardBanner,
  HnDashboardBannerWithNoBalanceCheck,
  HnPendingBanner,
  HnMiniTxBanner,
  HnActivatedSettingsBanner,
  HnActivatedBannerForSettings,
  HnSignupFlow,
  HnLoginCard,
  HnSecurityReportBtn,
  HnQueueAssessment,
  HnQueueAssessmentBanner,
  HnFeature,
  HypernativeLogo,
  HypernativeTooltip,
  QueueAssessmentProvider,

  // HOCs
  withHnFeature,
  withHnBannerConditions,
  withHnSignupFlow,

  // Hooks
  useIsHypernativeGuard,
  useIsHypernativeFeature,
  useIsHypernativeQueueScanFeature,
  useIsHypernativeEligible,
  useBannerStorage,
  useBannerVisibility,
  useTrackBannerEligibilityOnConnect,
  useHypernativeOAuth,
  useAuthToken,
  useQueueAssessment,
  useQueueBatchAssessments,
  useShowHypernativeAssessment,
  useHnAssessmentSeverity,
  useAssessmentUrl,
  useCalendly,

  // Services
  isHypernativeGuard,
  buildSecurityReportUrl,

  // Constants
  hnBannerID,
}

export default feature
