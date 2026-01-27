# Implementation Plan: Migrate Hypernative Feature to Feature-Architecture-v2

**Branch**: `003-migrate-hypernative` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-migrate-hypernative/spec.md`

## Summary

Migrate the existing Hypernative feature (a security enhancement system with 13 component groups, 15+ hooks, OAuth integration, and Redux state management) to the feature-architecture-v2 pattern. This involves creating contract.ts, feature.ts, and updating index.ts to use `createFeatureHandle()`, then updating all 29 consumer files to use `useLoadFeature()` with flat structure access.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14.x)
**Primary Dependencies**: React 18, Redux Toolkit, MUI, feature-architecture-v2 (`__core__` infrastructure)
**Storage**: Redux slices (`hnStateSlice`, `calendlySlice`), cookies (OAuth tokens)
**Testing**: Jest + React Testing Library + MSW
**Target Platform**: Web (apps/web)
**Project Type**: Web application (monorepo)
**Performance Goals**: No regression in bundle size for disabled features; lazy loading when enabled
**Constraints**: Atomic consumer updates (all in same PR); no backward compatibility re-exports
**Scale/Scope**: 29 consumer files to update; 14 components, 3 HOCs, 14 hooks, 2 services to expose

**Feature Flags**:

- `FEATURES.HYPERNATIVE` - Primary flag for Hypernative features
- `FEATURES.HYPERNATIVE_RELAX_GUARD_CHECK` - Relaxed guard detection mode
- `FEATURES.HYPERNATIVE_QUEUE_SCAN` - Queue scan features

**Infrastructure Status**: The `__core__` feature infrastructure is **fully implemented and production-ready**:

- `useLoadFeature()` - Complete with proxy stubs, meta properties, error handling
- `createFeatureHandle()` - Complete with semantic flag mapping
- Types - Complete (`FeatureHandle`, `FeatureMeta`, `FeatureContract`)
- Proxy stubs - Complete (hooks→`{}`, components→`null`, services→`undefined`)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle               | Status  | Notes                                                                           |
| ----------------------- | ------- | ------------------------------------------------------------------------------- |
| I. Type Safety          | ✅ PASS | Using `typeof` pattern in contract for full type inference; no `any` types      |
| II. Branch Protection   | ✅ PASS | Working on feature branch `003-migrate-hypernative`; will run all quality gates |
| III. Cross-Platform     | ✅ PASS | Changes only affect `apps/web`; no shared package modifications                 |
| IV. Testing Discipline  | ✅ PASS | Will update existing tests to use mocked feature module pattern                 |
| V. Feature Organization | ✅ PASS | Following `src/features/hypernative/` structure with feature flag gating        |
| VI. Theme System        | ✅ PASS | No theme changes; preserving existing component styling                         |

**Gate Result**: PASS - No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-migrate-hypernative/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output - research findings
├── data-model.md        # Phase 1 output - contract structure
├── quickstart.md        # Phase 1 output - developer guide
├── contracts/           # Phase 1 output - TypeScript interfaces
│   └── HypernativeContract.ts
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
apps/web/src/features/hypernative/
├── index.ts              # Public API: HypernativeFeature export (UPDATE)
├── contract.ts           # NEW: HypernativeContract interface with typeof pattern
├── feature.ts            # NEW: Direct imports, flat structure export
├── types.ts              # Public types (existing, may need updates)
├── constants.ts          # Feature constants (existing)
├── components/           # Internal components (existing, ESLint protected)
│   ├── HnBanner/
│   ├── HnDashboardBanner/
│   ├── HnQueueAssessment/
│   └── ... (13 component groups)
├── hooks/                # Internal hooks (existing, ESLint protected)
│   ├── useIsHypernativeGuard.ts
│   ├── useHypernativeOAuth.ts
│   └── ... (14+ hooks)
├── services/             # Internal services (existing, ESLint protected)
│   ├── hypernativeGuardCheck.ts
│   └── buildSecurityReportUrl.ts
├── store/                # Redux slices (MOVE from current location)
│   ├── hnStateSlice.ts
│   ├── calendlySlice.ts
│   └── index.ts          # Store barrel export
└── contexts/             # Internal contexts (existing)
    └── QueueAssessmentContext.tsx
```

### Consumer Files to Update (29 files)

```text
# Pages
apps/web/src/pages/transactions/queue.tsx
apps/web/src/pages/transactions/history.tsx

# Dashboard
apps/web/src/components/dashboard/index.tsx
apps/web/src/components/dashboard/FirstSteps/index.tsx

# Transaction Components
apps/web/src/components/transactions/TxDetails/index.tsx
apps/web/src/components/transactions/TxSummary/index.tsx
apps/web/src/components/tx-flow/flows/NewTx/index.tsx

# Settings
apps/web/src/components/settings/SecurityLogin/index.tsx
apps/web/src/components/settings/__tests__/SecurityLogin.test.tsx

# Common Components
apps/web/src/components/sidebar/SidebarHeader/SafeHeaderInfo.tsx
apps/web/src/components/common/EthHashInfo/SrcEthHashInfo/index.tsx

# Safe Shield Feature (9 files + 4 test files)
apps/web/src/features/safe-shield/index.tsx
apps/web/src/features/safe-shield/SafeShieldContext.tsx
apps/web/src/features/safe-shield/components/SafeShieldDisplay.tsx
apps/web/src/features/safe-shield/components/SafeShieldContent/index.tsx
apps/web/src/features/safe-shield/components/HypernativeInfo/index.tsx
apps/web/src/features/safe-shield/components/AnalysisGroupCard/AnalysisGroupCard.tsx
apps/web/src/features/safe-shield/components/ThreatAnalysis/ThreatAnalysis.tsx
apps/web/src/features/safe-shield/components/HypernativeCustomChecks/HypernativeCustomChecks.tsx
apps/web/src/features/safe-shield/hooks/useThreatAnalysis.ts
apps/web/src/features/safe-shield/hooks/useNestedThreatAnalysis.ts
# (+ 4 test files in safe-shield)

# Store
apps/web/src/store/slices.ts

# Tests
apps/web/src/tests/pages/hypernative-oauth-callback.test.tsx
```

**Structure Decision**: Following the existing feature-architecture-v2 pattern with Hypernative feature folder structure. Store slices will be moved under `features/hypernative/store/` per clarification session.

## Complexity Tracking

No Constitution Check violations - table not required.
