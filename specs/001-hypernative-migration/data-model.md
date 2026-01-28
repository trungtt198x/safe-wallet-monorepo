# Data Model: Hypernative Barrel File Design

**Date**: 2026-01-28
**Feature**: 001-hypernative-migration

## Overview

This document defines the public API surface for the hypernative feature barrel file (`index.tsx`).

## Barrel File Structure

```typescript
// apps/web/src/features/hypernative/index.tsx

import dynamic from 'next/dynamic'
import { withFeatureGuard } from '@/utils/withFeatureGuard'

// Internal guard hooks (not exported)
import { useIsHypernativeEnabled } from './hooks/useIsHypernativeEnabled'
import { useIsHypernativeQueueScanEnabled } from './hooks/useIsHypernativeQueueScanEnabled'

// ============================================================================
// GUARDED COMPONENT EXPORTS (lazy-loaded + feature-gated)
// ============================================================================

// Banner Components (HYPERNATIVE feature flag)
const LazyHnBannerForCarousel = dynamic(() => import('./components/HnBanner/HnBannerForCarousel'), { ssr: false })
const LazyHnBannerForQueue = dynamic(() => import('./components/HnBanner/HnBannerForQueue'), { ssr: false })
const LazyHnBannerForHistory = dynamic(() => import('./components/HnBanner/HnBannerForHistory'), { ssr: false })
const LazyHnBannerForSettings = dynamic(
  () => import('./components/HnBanner').then((m) => ({ default: m.HnBannerForSettings })),
  { ssr: false },
)

export const HnBannerForCarousel = withFeatureGuard(LazyHnBannerForCarousel, useIsHypernativeEnabled)
export const HnBannerForQueue = withFeatureGuard(LazyHnBannerForQueue, useIsHypernativeEnabled)
export const HnBannerForHistory = withFeatureGuard(LazyHnBannerForHistory, useIsHypernativeEnabled)
export const HnBannerForSettings = withFeatureGuard(LazyHnBannerForSettings, useIsHypernativeEnabled)

// Dashboard Banner
const LazyHnDashboardBanner = dynamic(() => import('./components/HnDashboardBanner/HnDashboardBanner'), { ssr: false })
const LazyHnDashboardBannerNoBalance = dynamic(
  () => import('./components/HnDashboardBanner').then((m) => ({ default: m.HnDashboardBannerWithNoBalanceCheck })),
  { ssr: false },
)

export const HnDashboardBanner = withFeatureGuard(LazyHnDashboardBanner, useIsHypernativeEnabled)
export const HnDashboardBannerWithNoBalanceCheck = withFeatureGuard(
  LazyHnDashboardBannerNoBalance,
  useIsHypernativeEnabled,
)

// Transaction Banners
const LazyHnMiniTxBanner = dynamic(() => import('./components/HnMiniTxBanner/HnMiniTxBanner'), { ssr: false })
const LazyHnPendingBanner = dynamic(() => import('./components/HnPendingBanner/HnPendingBanner'), { ssr: false })

export const HnMiniTxBanner = withFeatureGuard(LazyHnMiniTxBanner, useIsHypernativeEnabled)
export const HnPendingBanner = withFeatureGuard(LazyHnPendingBanner, useIsHypernativeEnabled)

// Settings Banner
const LazyHnActivatedBannerForSettings = dynamic(
  () => import('./components/HnActivatedSettingsBanner').then((m) => ({ default: m.HnActivatedBannerForSettings })),
  { ssr: false },
)

export const HnActivatedBannerForSettings = withFeatureGuard(LazyHnActivatedBannerForSettings, useIsHypernativeEnabled)

// Queue Assessment Components (HYPERNATIVE_QUEUE_SCAN feature flag)
const LazyHnQueueAssessment = dynamic(() => import('./components/HnQueueAssessment/HnQueueAssessment'), { ssr: false })
const LazyHnQueueAssessmentBanner = dynamic(
  () => import('./components/HnQueueAssessmentBanner/HnQueueAssessmentBanner'),
  { ssr: false },
)

export const HnQueueAssessment = withFeatureGuard(LazyHnQueueAssessment, useIsHypernativeQueueScanEnabled)
export const HnQueueAssessmentBanner = withFeatureGuard(LazyHnQueueAssessmentBanner, useIsHypernativeQueueScanEnabled)

// Login Card
const LazyHnLoginCard = dynamic(() => import('./components/HnLoginCard/HnLoginCard'), { ssr: false })

export const HnLoginCard = withFeatureGuard(LazyHnLoginCard, useIsHypernativeEnabled)

// Provider (no guard needed - internal state management)
export { QueueAssessmentProvider } from './components/QueueAssessmentProvider'

// Utility Components (no guard - used conditionally by consumers)
const LazyHypernativeTooltip = dynamic(() => import('./components/HypernativeTooltip/HypernativeTooltip'), {
  ssr: false,
})
const LazyHypernativeLogo = dynamic(() => import('./components/HypernativeLogo'), { ssr: false })

export const HypernativeTooltip = LazyHypernativeTooltip // No guard - consumer controls visibility
export const HypernativeLogo = LazyHypernativeLogo // No guard - consumer controls visibility

// ============================================================================
// HOOK EXPORTS
// ============================================================================

export { useIsHypernativeGuard } from './hooks/useIsHypernativeGuard'
export { useBannerVisibility, MIN_BALANCE_USD } from './hooks/useBannerVisibility'
export { useAuthToken } from './hooks/useAuthToken'
export { useHypernativeOAuth } from './hooks/useHypernativeOAuth'
export { useQueueAssessment } from './hooks/useQueueAssessment'
export { useShowHypernativeAssessment } from './hooks/useShowHypernativeAssessment'
export { useIsHypernativeEligible } from './hooks/useIsHypernativeEligible'

// Feature flag hooks exported for external conditional rendering
export { useIsHypernativeEnabled } from './hooks/useIsHypernativeEnabled'
export { useIsHypernativeQueueScanEnabled } from './hooks/useIsHypernativeQueueScanEnabled'

// ============================================================================
// TYPE EXPORTS (zero runtime cost)
// ============================================================================

export type { HypernativeGuardCheckResult } from './hooks/useIsHypernativeGuard'
export type { BannerVisibilityResult } from './hooks/useBannerVisibility'
export type { HypernativeAuthStatus } from './hooks/useHypernativeOAuth'
export type { HypernativeEligibility } from './hooks/useIsHypernativeEligible'
export { BannerType } from './hooks/useBannerStorage'

// ============================================================================
// CONSTANT EXPORTS
// ============================================================================

export { hnBannerID } from './components/HnBanner/HnBanner'
export { HYPERNATIVE_ALLOWLIST_OUTREACH_ID } from './constants'

// ============================================================================
// STORE EXPORTS (for slices.ts compatibility)
// ============================================================================

// Note: Store is also exported from ./store/index.ts for backward compatibility
// The main store integration in src/store/slices.ts imports from '@/features/hypernative/store'
export * from './store'
```

## Export Categories

### 1. Guarded Components

Components wrapped with `dynamic()` + `withFeatureGuard`:

| Component                           | Guard Hook                       | Description               |
| ----------------------------------- | -------------------------------- | ------------------------- |
| HnBannerForCarousel                 | useIsHypernativeEnabled          | Carousel promo banner     |
| HnBannerForQueue                    | useIsHypernativeEnabled          | Queue page banner         |
| HnBannerForHistory                  | useIsHypernativeEnabled          | History page banner       |
| HnBannerForSettings                 | useIsHypernativeEnabled          | Settings page banner      |
| HnDashboardBanner                   | useIsHypernativeEnabled          | Dashboard banner          |
| HnDashboardBannerWithNoBalanceCheck | useIsHypernativeEnabled          | Dashboard banner variant  |
| HnMiniTxBanner                      | useIsHypernativeEnabled          | Mini transaction banner   |
| HnPendingBanner                     | useIsHypernativeEnabled          | Pending state banner      |
| HnActivatedBannerForSettings        | useIsHypernativeEnabled          | Activated settings banner |
| HnQueueAssessment                   | useIsHypernativeQueueScanEnabled | Queue assessment display  |
| HnQueueAssessmentBanner             | useIsHypernativeQueueScanEnabled | Queue assessment banner   |
| HnLoginCard                         | useIsHypernativeEnabled          | Login card component      |

### 2. Unguarded Components

Lazy-loaded but not feature-gated (consumer controls visibility):

| Component               | Reason                                |
| ----------------------- | ------------------------------------- |
| QueueAssessmentProvider | Context provider, always available    |
| HypernativeTooltip      | Utility, consumer controls when shown |
| HypernativeLogo         | Utility, consumer controls when shown |

### 3. Hooks

| Hook                             | Purpose                             | External Use                   |
| -------------------------------- | ----------------------------------- | ------------------------------ |
| useIsHypernativeGuard            | Check if Safe has Hypernative guard | Sidebar, settings              |
| useBannerVisibility              | Banner visibility logic             | Dashboard, pages               |
| useAuthToken                     | OAuth token management              | OAuth callback                 |
| useHypernativeOAuth              | OAuth flow state                    | Safe-shield, tx components     |
| useQueueAssessment               | Queue assessment data               | TxDetails, TxSummary           |
| useShowHypernativeAssessment     | Assessment visibility               | TxDetails, TxSummary           |
| useIsHypernativeEligible         | Eligibility check                   | Safe-shield                    |
| useIsHypernativeEnabled          | Feature flag (HYPERNATIVE)          | External conditional rendering |
| useIsHypernativeQueueScanEnabled | Feature flag (QUEUE_SCAN)           | External conditional rendering |

### 4. Types

| Type                        | Source                   |
| --------------------------- | ------------------------ |
| HypernativeGuardCheckResult | useIsHypernativeGuard    |
| BannerVisibilityResult      | useBannerVisibility      |
| HypernativeAuthStatus       | useHypernativeOAuth      |
| HypernativeEligibility      | useIsHypernativeEligible |
| BannerType (enum)           | useBannerStorage         |

### 5. Constants

| Constant                          | Purpose                        |
| --------------------------------- | ------------------------------ |
| hnBannerID                        | Banner element ID for carousel |
| HYPERNATIVE_ALLOWLIST_OUTREACH_ID | Outreach tracking ID           |
| MIN_BALANCE_USD                   | Minimum balance threshold      |

## Internal Modules (NOT Exported)

These remain internal with relative imports:

- `withHnFeature` - Replaced by withFeatureGuard
- `withHnBannerConditions` - Internal HOC composition
- `withHnSignupFlow` - Internal HOC composition
- `HnSignupFlow/*` - Internal signup components
- `HnSecurityReportBtn/*` - Internal button variants
- `HnFeature` - Internal wrapper component
- `useBannerStorage` - Internal storage hook
- `useCalendly` - Internal calendly integration
- `useAssessmentUrl` - Internal URL builder
- `useHnAssessmentSeverity` - Internal severity logic
- `useTrackBannerEligibilityOnConnect` - Internal tracking

## Migration Notes

1. **Hook Renames**:
   - `useIsHypernativeFeature` → `useIsHypernativeEnabled`
   - `useIsHypernativeQueueScanFeature` → `useIsHypernativeQueueScanEnabled`

2. **Removed Exports**:
   - `default` exports from component barrels (use named exports)
   - `withHnFeature` (use withFeatureGuard directly)

3. **Store Compatibility**:
   - `@/features/hypernative/store` path preserved for slices.ts
   - Main barrel also re-exports store for convenience
