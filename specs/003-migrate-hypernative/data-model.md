# Data Model: Hypernative Feature Contract

**Date**: 2026-01-27
**Feature**: 003-migrate-hypernative

## Overview

This document defines the contract structure for the Hypernative feature following the feature-architecture-v2 pattern. The contract uses a flat structure with naming conventions to determine proxy stub behavior.

## Contract Structure

### Naming Convention Rules

| Pattern        | Type      | Stub Behavior                     |
| -------------- | --------- | --------------------------------- |
| `useSomething` | Hook      | Returns `{}` (safe destructuring) |
| `PascalCase`   | Component | Renders `null`                    |
| `camelCase`    | Service   | `undefined` (check `$isReady`)    |

### HypernativeContract Interface

```typescript
// Flat structure - no nested categories
export interface HypernativeContract {
  // ═══════════════════════════════════════════════════════════════
  // COMPONENTS (PascalCase → stub renders null)
  // ═══════════════════════════════════════════════════════════════

  /** Main promotional banner with context variants */
  HnBanner: typeof HnBanner

  /** Banner with built-in dismissal tracking */
  HnBannerWithDismissal: typeof HnBannerWithDismissal

  /** Banner variant for carousel context */
  HnBannerForCarousel: typeof HnBannerForCarousel

  /** Banner variant for history page */
  HnBannerForHistory: typeof HnBannerForHistory

  /** Banner variant for queue page */
  HnBannerForQueue: typeof HnBannerForQueue

  /** Dashboard-specific promotional card with image */
  HnDashboardBanner: typeof HnDashboardBanner

  /** Dashboard banner with no balance check */
  HnDashboardBannerWithNoBalanceCheck: typeof HnDashboardBannerWithNoBalanceCheck

  /** Post-form completion pending status banner */
  HnPendingBanner: typeof HnPendingBanner

  /** Compact transaction-related banner */
  HnMiniTxBanner: typeof HnMiniTxBanner

  /** Multi-step signup modal flow */
  HnSignupFlow: typeof HnSignupFlow

  /** Button linking to security reports */
  HnSecurityReportBtn: typeof HnSecurityReportBtn

  /** Threat assessment display for transaction queue */
  HnQueueAssessment: typeof HnQueueAssessment

  /** Banner wrapper providing queue assessment context */
  HnQueueAssessmentBanner: typeof HnQueueAssessmentBanner

  /** Settings page banner for activated guard */
  HnActivatedSettingsBanner: typeof HnActivatedSettingsBanner

  /** Settings banner variants */
  HnBannerForSettings: typeof HnBannerForSettings
  HnActivatedBannerForSettings: typeof HnActivatedBannerForSettings

  /** OAuth login integration card */
  HnLoginCard: typeof HnLoginCard

  /** Conditional rendering wrapper (checks flag + visibility) */
  HnFeature: typeof HnFeature

  /** SVG logo component */
  HypernativeLogo: typeof HypernativeLogo

  /** Styled tooltip for Hypernative info */
  HypernativeTooltip: typeof HypernativeTooltip

  // ═══════════════════════════════════════════════════════════════
  // HOC WRAPPERS (PascalCase functions → stub renders null)
  // ═══════════════════════════════════════════════════════════════

  /** Feature flag guard HOC */
  withHnFeature: typeof withHnFeature

  /** Banner visibility conditions HOC */
  withHnBannerConditions: typeof withHnBannerConditions

  /** Signup flow wrapper HOC */
  withHnSignupFlow: typeof withHnSignupFlow

  // ═══════════════════════════════════════════════════════════════
  // HOOKS (useSomething → stub returns {})
  // ═══════════════════════════════════════════════════════════════

  /** Check if Safe has HypernativeGuard installed */
  useIsHypernativeGuard: typeof useIsHypernativeGuard

  /** Check if Hypernative feature is enabled on current chain */
  useIsHypernativeFeature: typeof useIsHypernativeFeature

  /** Check if queue scan feature is enabled */
  useIsHypernativeQueueScanFeature: typeof useIsHypernativeQueueScanFeature

  /** Determine Safe eligibility (guard OR allowlist) */
  useIsHypernativeEligible: typeof useIsHypernativeEligible

  /** Read banner dismissal/completion state from Redux */
  useBannerStorage: typeof useBannerStorage

  /** Complex banner display logic (balance, owner, outreach) */
  useBannerVisibility: typeof useBannerVisibility

  /** Analytics tracking on wallet connection */
  useTrackBannerEligibilityOnConnect: typeof useTrackBannerEligibilityOnConnect

  /** OAuth 2.0 PKCE flow (popup-first with tab fallback) */
  useHypernativeOAuth: typeof useHypernativeOAuth

  /** Token lifecycle management with cookie storage */
  useAuthToken: typeof useAuthToken

  /** Get assessment for specific transaction from context */
  useQueueAssessment: typeof useQueueAssessment

  /** Batch assessment fetching for multiple transactions */
  useQueueBatchAssessments: typeof useQueueBatchAssessments

  /** Determine when to show assessment UI */
  useShowHypernativeAssessment: typeof useShowHypernativeAssessment

  /** Derive severity level from assessment results */
  useHnAssessmentSeverity: typeof useHnAssessmentSeverity

  /** Build link to full assessment report */
  useAssessmentUrl: typeof useAssessmentUrl

  /** Calendly widget management (load, state, events) */
  useCalendly: typeof useCalendly

  // ═══════════════════════════════════════════════════════════════
  // SERVICES (camelCase → undefined when not ready)
  // ═══════════════════════════════════════════════════════════════

  /** Bytecode-based guard detection service */
  hypernativeGuardCheck: typeof hypernativeGuardCheck

  /** URL builder for security reports */
  buildSecurityReportUrl: typeof buildSecurityReportUrl

  // ═══════════════════════════════════════════════════════════════
  // CONTEXT PROVIDERS (PascalCase → stub renders null)
  // ═══════════════════════════════════════════════════════════════

  /** Provider for queue assessment results */
  QueueAssessmentProvider: typeof QueueAssessmentProvider
}
```

## Key Entities

### SafeHnState (Redux)

Per-Safe state for banner and form tracking.

```typescript
interface SafeHnState {
  bannerDismissed: boolean // Has user dismissed promo banner?
  formCompleted: boolean // Has user completed signup form?
  pendingBannerDismissed: boolean // Has user dismissed pending banner?
  bannerEligibilityTracked: boolean // Has eligibility been tracked?
}
```

**Storage Key**: `${chainId}:${safeAddress}`

### CalendlyState (Redux)

Calendly widget state management.

```typescript
interface CalendlyState {
  isLoaded: boolean // Widget script loaded?
  isSecondStep: boolean // User on step 2?
  hasScheduled: boolean // Meeting scheduled?
  hasError: boolean // Error occurred?
}
```

### BannerType (Enum)

Banner type identifiers for visibility logic.

```typescript
enum BannerType {
  Promo = 'promo',
  Pending = 'pending',
  TxReportButton = 'txReportButton',
  NoBalanceCheck = 'noBalanceCheck',
  Settings = 'settings',
}
```

### HypernativeAuthStatus (Type)

OAuth authentication states.

```typescript
type HypernativeAuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'error'
```

### HypernativeEligibility (Type)

Safe eligibility determination result.

```typescript
interface HypernativeEligibility {
  isEligible: boolean
  hasGuard: boolean
  isOnAllowlist: boolean
}
```

## State Transitions

### Banner Lifecycle

```
┌─────────────────┐
│   Feature Off   │
└────────┬────────┘
         │ Feature flag enabled
         ▼
┌─────────────────┐
│  Promo Banner   │ ◄─── User sees promotional content
└────────┬────────┘
         │ User clicks CTA
         ▼
┌─────────────────┐
│   Signup Flow   │ ◄─── Multi-step modal
└────────┬────────┘
         │ Form completed
         ▼
┌─────────────────┐
│ Pending Banner  │ ◄─── Waiting for guard activation
└────────┬────────┘
         │ Guard detected
         ▼
┌─────────────────┐
│ Settings Banner │ ◄─── Active state shown in settings
└─────────────────┘
```

### OAuth Flow

```
┌─────────────────┐
│ Unauthenticated │
└────────┬────────┘
         │ initiateLogin()
         ▼
┌─────────────────┐
│    Loading      │ ◄─── Popup/tab opens
└────────┬────────┘
         │ OAuth callback
         ▼
┌─────────────────┐
│  Authenticated  │ ◄─── Token stored in cookie
└────────┬────────┘
         │ Token expires
         ▼
┌─────────────────┐
│ Unauthenticated │
└─────────────────┘
```

## Validation Rules

| Entity      | Field       | Rule                               |
| ----------- | ----------- | ---------------------------------- |
| SafeHnState | chainId     | Valid chain ID from config         |
| SafeHnState | safeAddress | Valid checksummed Ethereum address |
| OAuth Token | expiry      | Must be future timestamp           |
| Assessment  | safeTxHash  | Valid Safe transaction hash format |

## File Location Mapping

| Entity                | Current Location                                    | New Location                    |
| --------------------- | --------------------------------------------------- | ------------------------------- |
| hnStateSlice          | `features/hypernative/store/`                       | Same (already correct)          |
| calendlySlice         | `features/hypernative/store/`                       | Same (already correct)          |
| BannerType            | `features/hypernative/hooks/useBannerVisibility.ts` | `features/hypernative/types.ts` |
| HypernativeAuthStatus | `features/hypernative/hooks/useHypernativeOAuth.ts` | `features/hypernative/types.ts` |
