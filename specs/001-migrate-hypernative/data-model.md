# Data Model: Migrate Hypernative to Feature Architecture

**Branch**: `001-migrate-hypernative` | **Date**: 2026-01-26

## Overview

This migration does not introduce new data entities or storage. The "data model" for this feature describes the **module structure and export relationships** that define the public API surface of the hypernative feature.

## Module Structure

### Public API (Barrel File)

```
src/features/hypernative/index.ts
├── Default Export: None (multiple entry points)
├── Hooks (named exports)
│   ├── useIsHypernativeEnabled      # Feature flag hook (renamed)
│   ├── useIsHypernativeGuard        # Guard detection hook
│   ├── useIsHypernativeQueueScanFeature
│   ├── useBannerStorage
│   ├── useBannerVisibility
│   ├── useAuthToken
│   ├── useHypernativeOAuth
│   ├── useIsHypernativeEligible
│   ├── useQueueAssessment
│   ├── useQueueBatchAssessments
│   ├── useShowHypernativeAssessment
│   ├── useCalendly
│   ├── useAssessmentUrl
│   └── useHnAssessmentSeverity
├── Components (lazy-loaded via next/dynamic)
│   ├── HnDashboardBannerWithNoBalanceCheck
│   ├── HnMiniTxBanner
│   ├── HnBannerForCarousel
│   ├── HnBannerForHistory
│   ├── HnBannerForQueue
│   ├── HnBannerForSettings
│   ├── HnActivatedBannerForSettings
│   ├── HnPendingBanner
│   ├── HnLoginCard
│   ├── HnQueueAssessment
│   ├── HnQueueAssessmentBanner
│   ├── QueueAssessmentProvider
│   ├── HypernativeTooltip
│   ├── HypernativeLogo
│   └── OAuthCallbackHandler          # NEW: extracted from page
├── Types (zero-cost exports)
│   ├── HypernativeGuardCheckResult
│   ├── BannerVisibilityResult
│   ├── HypernativeAuthStatus
│   ├── HypernativeEligibility
│   └── BannerType (enum)
├── Constants
│   ├── MIN_BALANCE_USD
│   └── hnBannerID
└── Utilities
    ├── readPkce                       # OAuth utility
    └── clearPkce                      # OAuth utility
```

### Internal Modules (Not Exported)

```
src/features/hypernative/
├── config/
│   └── oauth.ts                       # HYPERNATIVE_OAUTH_CONFIG (internal)
├── services/
│   ├── hypernativeGuardCheck.ts       # Guard detection service (internal)
│   └── safeTxHashCalculation.ts       # Hash calculation (internal)
├── store/
│   ├── hnStateSlice.ts                # Redux slice (exported via src/store/slices.ts)
│   ├── calendlySlice.ts               # Redux slice (exported via src/store/slices.ts)
│   └── cookieStorage.ts               # Storage utility (internal)
├── contexts/
│   └── QueueAssessmentContext.tsx     # Internal context
└── utils/
    └── buildSecurityReportUrl.ts      # Internal utility
```

## Export Relationships

### External Consumer Categories

| Consumer Location              | Imports Used             | Migration Target                              |
| ------------------------------ | ------------------------ | --------------------------------------------- |
| `src/pages/transactions/`      | Hooks, Components, Types | `@/features/hypernative`                      |
| `src/components/dashboard/`    | Hooks, Banner Components | `@/features/hypernative`                      |
| `src/components/transactions/` | Hooks, Components        | `@/features/hypernative`                      |
| `src/components/settings/`     | Banner Components        | `@/features/hypernative`                      |
| `src/components/sidebar/`      | useIsHypernativeGuard    | `@/features/hypernative`                      |
| `src/components/common/`       | HypernativeTooltip       | `@/features/hypernative`                      |
| `src/components/tx-flow/`      | HnMiniTxBanner           | `@/features/hypernative`                      |
| `src/features/safe-shield/`    | Hooks, Types, Components | `@/features/hypernative`                      |
| `src/store/slices.ts`          | Store exports            | `@/features/hypernative/store` (special case) |
| `src/pages/hypernative/`       | OAuthCallbackHandler     | `@/features/hypernative`                      |

### Store Export Pattern

The Redux store slices follow a special pattern where `src/store/slices.ts` re-exports them:

```typescript
// src/store/slices.ts
export * from '@/features/hypernative/store' // Remains unchanged
```

This is acceptable because:

1. It's the established pattern for Redux store composition
2. The store slice is designed to be globally accessible
3. The barrel file will NOT re-export store slices (to avoid duplication)

## Type Definitions

### Key Types to Export

```typescript
// From hooks/useIsHypernativeGuard.ts
export type HypernativeGuardCheckResult = {
  hasGuard: boolean | undefined
  isLoading: boolean
  error: Error | null
}

// From hooks/useBannerVisibility.ts
export type BannerVisibilityResult = {
  isVisible: boolean
  reason?: string
}

// From hooks/useHypernativeOAuth.ts
export type HypernativeAuthStatus = {
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
}

// From hooks/useIsHypernativeEligible.ts
export type HypernativeEligibility = {
  isEligible: boolean
  hasGuard: boolean
  isTargeted: boolean
}

// From hooks/useBannerStorage.ts
export enum BannerType {
  DASHBOARD = 'dashboard',
  QUEUE = 'queue',
  HISTORY = 'history',
  SETTINGS = 'settings',
}
```

## Validation Rules

### Import Boundary Rules

| Rule                                    | Scope                               | Enforcement                       |
| --------------------------------------- | ----------------------------------- | --------------------------------- |
| External code must use barrel           | Outside `src/features/hypernative/` | ESLint `no-restricted-imports`    |
| Internal code must use relative imports | Inside `src/features/hypernative/`  | ESLint `boundaries/element-types` |
| Types can be imported from `/types`     | External consumers                  | Allowed by ESLint config          |

### Barrel Export Rules

| Rule                                | Validation              |
| ----------------------------------- | ----------------------- |
| No unused exports                   | `yarn knip:exports`     |
| No heavy internal modules           | Manual review during PR |
| All external dependencies satisfied | TypeScript compilation  |

## State Transitions

Not applicable - this migration does not introduce runtime state changes. The feature's existing state management (Redux slices, cookie storage) remains unchanged.
