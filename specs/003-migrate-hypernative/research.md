# Research: Migrate Hypernative to Feature-Architecture-v2

**Date**: 2026-01-27
**Feature**: 003-migrate-hypernative

## Research Questions

### 1. Feature Flag Identification

**Question**: What are the exact Hypernative feature flags used in the codebase?

**Decision**: Three feature flags exist for Hypernative functionality:

- `FEATURES.HYPERNATIVE` - Primary flag for core Hypernative features
- `FEATURES.HYPERNATIVE_RELAX_GUARD_CHECK` - Enables relaxed guard detection (skips ABI verification)
- `FEATURES.HYPERNATIVE_QUEUE_SCAN` - Enables queue scan features specifically

**Rationale**: The primary flag `FEATURES.HYPERNATIVE` should be used in `createFeatureHandle()` since it controls the main feature enablement. The other two flags are used internally by specific hooks for additional feature gating.

**Location**: Defined in `packages/utils/src/utils/chains.ts` (lines 53-55 in FEATURES enum)

**Alternatives Considered**: None - these are the existing flags in use.

---

### 2. **core** Infrastructure Status

**Question**: Is the feature-architecture-v2 infrastructure ready for use?

**Decision**: The `__core__` infrastructure is **fully implemented and production-ready**.

**Rationale**: All required components exist and are complete:

- `useLoadFeature()` - Full implementation with proxy stubs, meta properties, error handling
- `createFeatureHandle()` - Three-tier flag resolution (explicit > semantic mapping > auto-derivation)
- Types - `FeatureHandle`, `FeatureMeta`, `FeatureContract`, `FeatureImplementation`
- Proxy stubs - Naming convention detection (hooks→`{}`, components→`null`, services→`undefined`)
- `withSuspense` helper - For rare giant internal dependencies
- Documentation - Comprehensive 1318-line guide in `apps/web/docs/feature-architecture-v2.md`

**Alternatives Considered**: Building custom infrastructure was considered unnecessary given the complete existing implementation.

---

### 3. Consumer Component Inventory

**Question**: Which files outside Hypernative import from it and need migration?

**Decision**: 29 consumer files identified across 6 categories:

| Category               | File Count | Key Dependencies                             |
| ---------------------- | ---------- | -------------------------------------------- |
| Pages                  | 2          | Banners, eligibility hooks, queue assessment |
| Dashboard              | 2          | Banner visibility, carousel integration      |
| Transaction Components | 3          | Queue assessment, mini banner                |
| Settings               | 2          | Security login banners, guard status         |
| Common Components      | 2          | Guard hook, tooltip                          |
| Safe Shield Feature    | 13         | Deep integration (OAuth, eligibility, types) |
| Store                  | 1          | Re-exports all slices                        |
| Tests                  | 4          | Mocked hooks and types                       |

**Rationale**: All consumers must be updated atomically (per clarification) to use `useLoadFeature()` pattern.

**Alternatives Considered**:

- Incremental migration with re-exports - Rejected per clarification decision
- Partial migration - Rejected; atomic update ensures consistent behavior

---

### 4. Store Slice Location Strategy

**Question**: How should Redux slices be handled during migration?

**Decision**: Move slices to `features/hypernative/store/` and update global store imports.

**Rationale**:

- Per clarification session: follow v2 pattern with store under feature folder
- Global store (`apps/web/src/store/slices.ts`) currently re-exports from hypernative
- After migration: global store will import from new location

**Implementation**:

1. Move `hnStateSlice.ts` and `calendlySlice.ts` to `features/hypernative/store/`
2. Create `features/hypernative/store/index.ts` barrel export
3. Update `apps/web/src/store/slices.ts` to import from new location

**Alternatives Considered**: Keeping slices in current location - Rejected per clarification decision.

---

### 5. Public API Surface

**Question**: Which exports should be in the HypernativeContract?

**Decision**: Based on consumer analysis, the following exports are required:

**Components (14)**: HnBanner, HnBannerWithDismissal, HnDashboardBanner, HnPendingBanner, HnMiniTxBanner, HnSignupFlow, HnSecurityReportBtn, HnQueueAssessment, HnQueueAssessmentBanner, HnActivatedSettingsBanner, HnLoginCard, HnFeature, HypernativeLogo, HypernativeTooltip

**HOCs (3)**: withHnFeature, withHnBannerConditions, withHnSignupFlow

**Hooks (14)**: useIsHypernativeGuard, useIsHypernativeFeature, useIsHypernativeEligible, useBannerStorage, useBannerVisibility, useTrackBannerEligibilityOnConnect, useHypernativeOAuth, useAuthToken, useQueueAssessment, useQueueBatchAssessments, useShowHypernativeAssessment, useHnAssessmentSeverity, useAssessmentUrl, useCalendly

**Services (2)**: hypernativeGuardCheck, buildSecurityReportUrl

**Types**: BannerType, HypernativeAuthStatus, HypernativeEligibility, QueueAssessmentProvider

**Rationale**: This list covers all externally consumed exports identified in consumer analysis.

**Alternatives Considered**: Exposing fewer exports - Rejected as consumers need all these.

---

### 6. Type Export Strategy

**Question**: How should types be exported for consumer use?

**Decision**: Types should be exported from `types.ts` barrel for direct import.

**Rationale**:

- Per feature-architecture-v2 docs, types can be directly imported
- Allows `import type { BannerType } from '@/features/hypernative/types'`
- Types are compile-time only, no lazy loading needed

**Implementation**:

- Keep public types in `features/hypernative/types.ts`
- Export from index.ts: `export type * from './types'`
- Consumers import types directly, not through useLoadFeature

---

## Best Practices Identified

### 1. Contract Structure Pattern

```typescript
// contract.ts
import type HnBanner from './components/HnBanner'
import type { useIsHypernativeGuard } from './hooks/useIsHypernativeGuard'

export interface HypernativeContract {
  // Components - PascalCase
  HnBanner: typeof HnBanner

  // Hooks - useSomething
  useIsHypernativeGuard: typeof useIsHypernativeGuard

  // Services - camelCase
  hypernativeGuardCheck: typeof hypernativeGuardCheck
}
```

### 2. Feature.ts Pattern

```typescript
// feature.ts - Direct imports, flat structure
import HnBanner from './components/HnBanner'
import { useIsHypernativeGuard } from './hooks/useIsHypernativeGuard'

export default {
  HnBanner,
  useIsHypernativeGuard,
  // ... all exports flat
}
```

### 3. Consumer Update Pattern

```typescript
// Before
import { HnBanner } from '@/features/hypernative/components/HnBanner'
import { useIsHypernativeGuard } from '@/features/hypernative/hooks'

// After
import { HypernativeFeature } from '@/features/hypernative'
import { useLoadFeature } from '@/features/__core__'

const hn = useLoadFeature(HypernativeFeature)
// Access: hn.HnBanner, hn.useIsHypernativeGuard()
```

### 4. Test Mocking Pattern

```typescript
jest.mock('@/features/hypernative', () => ({
  HypernativeFeature: {
    name: 'hypernative',
    useIsEnabled: () => true,
    load: () => Promise.resolve({
      default: {
        HnBanner: () => <div data-testid="hn-banner">Mock</div>,
        useIsHypernativeGuard: () => ({ hasGuard: false }),
      },
    }),
  },
}))
```

---

## Dependencies

| Dependency            | Version   | Purpose                             |
| --------------------- | --------- | ----------------------------------- |
| `@/features/__core__` | N/A       | useLoadFeature, createFeatureHandle |
| `@safe-global/utils`  | workspace | FEATURES enum, useAsync             |
| Redux Toolkit         | ^2.0      | State management                    |
| React                 | ^18.0     | Component framework                 |

---

## Risks and Mitigations

| Risk                               | Mitigation                                               |
| ---------------------------------- | -------------------------------------------------------- |
| Breaking consumer components       | Run full test suite after each consumer batch update     |
| Type inference failures            | Use `typeof` pattern in contract; verify with type-check |
| Bundle regression                  | Verify lazy loading with webpack bundle analyzer         |
| Missing exports in contract        | Cross-reference consumer imports with contract exports   |
| Test failures from mocking changes | Update test mocks to use new feature module pattern      |
