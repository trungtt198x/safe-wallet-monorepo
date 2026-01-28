# Research: Hypernative Feature Architecture Migration

**Date**: 2026-01-28
**Feature**: 001-hypernative-migration

## Research Questions

### 1. withHnFeature vs withFeatureGuard Equivalence

**Question**: Is `withHnFeature` functionally equivalent to `withFeatureGuard`?

**Findings**:

| Aspect                     | withHnFeature                 | withFeatureGuard             |
| -------------------------- | ----------------------------- | ---------------------------- |
| Feature flag check         | Yes (useIsHypernativeFeature) | Yes (accepts any guard hook) |
| Returns null when disabled | Yes                           | Yes                          |
| Wrapper prop support       | No                            | Yes                          |
| Dynamic import integration | No (wraps static component)   | Yes (designed for dynamic)   |

**Decision**: Replace `withHnFeature` with `withFeatureGuard` + `dynamic()` at module level
**Rationale**: `withFeatureGuard` provides the same feature gating plus wrapper prop support and is designed for lazy-loaded components
**Alternatives Considered**: Keep `withHnFeature` as alias → Rejected (adds confusion, doesn't enable lazy loading)

### 2. External Import Patterns

**Question**: What patterns exist for external imports that need updating?

**Findings** (from grep analysis):

| Pattern                | Count | Example                                              |
| ---------------------- | ----- | ---------------------------------------------------- |
| Component deep imports | ~25   | `@/features/hypernative/components/HnBanner`         |
| Hook deep imports      | ~20   | `@/features/hypernative/hooks/useIsHypernativeGuard` |
| Store imports          | 1     | `@/features/hypernative/store` (from slices.ts)      |
| Config imports         | 2     | `@/features/hypernative/config/oauth`                |
| Type imports           | ~10   | `@/features/hypernative/hooks/useHypernativeOAuth`   |

**Decision**: All external imports consolidate to barrel file except:

- Store exports remain at `@/features/hypernative/store` for slices.ts compatibility
- Type-only imports allowed from `@/features/hypernative/types`

**Rationale**: Barrel file pattern per feature-architecture.md; store exception needed for Redux integration pattern
**Alternatives Considered**: Re-export store from main barrel → Possible but would break current slices.ts pattern

### 3. Component Export Strategy

**Question**: Which components need public export vs internal-only?

**Findings** (based on external usage):

**Require Public Export (used externally)**:

- `HnBanner` variants (HnBannerForCarousel, HnBannerForQueue, HnBannerForHistory, HnBannerForSettings)
- `HnDashboardBanner`, `HnDashboardBannerWithNoBalanceCheck`
- `HnMiniTxBanner`
- `HnPendingBanner`
- `HnActivatedBannerForSettings`
- `HnQueueAssessment`, `HnQueueAssessmentBanner`
- `HnLoginCard`
- `QueueAssessmentProvider`
- `HypernativeTooltip`
- `HypernativeLogo`

**Internal Only (not imported externally)**:

- `HnSignupFlow`, `HnModal`, `HnSignupIntro` (used by HOCs internally)
- `withHnFeature`, `withHnBannerConditions`, `withHnSignupFlow` (internal composition)
- `HnSecurityReportBtn` variants (used only within feature)
- `HnFeature` component

**Decision**: Export only externally-used components via barrel; keep internal components as relative imports
**Rationale**: Minimizes barrel surface area per feature-architecture.md guidance

### 4. Hook Export Strategy

**Question**: Which hooks need public export?

**Findings** (based on external usage):

**Require Public Export**:

- `useIsHypernativeGuard` - used by sidebar, settings tests
- `useIsHypernativeEnabled` (renamed from useIsHypernativeFeature)
- `useIsHypernativeQueueScanEnabled` (renamed from useIsHypernativeQueueScanFeature)
- `useBannerVisibility`, `BannerType` - used by dashboard, pages
- `useAuthToken` - used by oauth callback page, safe-shield
- `useHypernativeOAuth` - used by safe-shield, tx components
- `useQueueAssessment` - used by TxDetails, TxSummary
- `useShowHypernativeAssessment` - used by TxDetails, TxSummary
- `useIsHypernativeEligible` - used by safe-shield

**Internal Only**:

- `useBannerStorage` - internal implementation detail
- `useCalendly` - internal to signup flow
- `useAssessmentUrl` - internal to queue components
- `useHnAssessmentSeverity` - internal to queue components
- `useTrackBannerEligibilityOnConnect` - internal tracking

**Decision**: Export externally-used hooks; feature flag hooks NOT exported (used internally by withFeatureGuard)
**Rationale**: Per feature-architecture.md, guard hooks should not be exported unless external code needs them

### 5. Safe-Shield Dependency Pattern

**Question**: How should safe-shield's dependency on hypernative be handled?

**Findings**:

- safe-shield imports: `useHypernativeOAuth`, `useIsHypernativeEligible`, `HypernativeTooltip`, various types
- These are legitimate cross-feature dependencies
- Types like `HypernativeAuthStatus`, `HypernativeEligibility` are imported for type safety

**Decision**: Export these items from hypernative barrel; safe-shield is a valid external consumer
**Rationale**: Cross-feature communication via barrel imports is the intended pattern
**Alternatives Considered**: Merge features → Rejected (different domains); shared package → Overkill

### 6. ESLint Rule Configuration

**Question**: What ESLint rules are needed?

**Findings** (from feature-architecture.md):

- `no-restricted-imports` for external import boundaries
- `boundaries/element-types` for internal relative imports
- `local-rules/require-feature-guard` for guarded exports

**Decision**: Hypernative feature should be added to existing ESLint configuration patterns
**Rationale**: Consistent enforcement across all features

## Summary

All research questions resolved. No NEEDS CLARIFICATION items remain. Ready for Phase 1 design.
