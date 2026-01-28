# Implementation Plan: Hypernative Feature Architecture Migration

**Branch**: `001-hypernative-migration` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-hypernative-migration/spec.md`

## Summary

Migrate the existing Hypernative feature (~80 files) to the new feature architecture pattern. This involves creating a single barrel file (`index.tsx`) that exports all public components using `dynamic()` + `withFeatureGuard` pattern, updating ~60 external import sites, and configuring ESLint rules to enforce import boundaries. No functional changes to components.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14.x)
**Primary Dependencies**: Next.js (dynamic imports), React, Redux Toolkit, `withFeatureGuard` utility
**Storage**: N/A (no storage changes - Redux slices remain unchanged)
**Testing**: Jest, Storybook
**Target Platform**: Web (Next.js)
**Project Type**: Web application (monorepo feature)
**Performance Goals**: Lazy-load all Hypernative components to reduce initial bundle size
**Constraints**: Zero functional regressions, all tests must pass, maintain backward compatibility for store exports
**Scale/Scope**: ~80 internal files, ~60 external import sites, 2 feature flags

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle               | Status | Notes                                                                    |
| ----------------------- | ------ | ------------------------------------------------------------------------ |
| I. Type Safety          | PASS   | No `any` types introduced; migration preserves existing types            |
| II. Branch Protection   | PASS   | Using feature branch `001-hypernative-migration`; will run quality gates |
| III. Cross-Platform     | PASS   | Web-only feature; no shared package changes                              |
| IV. Testing Discipline  | PASS   | Existing tests preserved; import paths updated only                      |
| V. Feature Organization | PASS   | This migration implements the feature organization pattern               |
| VI. Theme System        | N/A    | No theme changes                                                         |

**Gate Result**: All applicable principles PASS. Proceed to Phase 0.

### Post-Design Re-Check (Phase 1 Complete)

| Principle               | Status | Notes                                                                     |
| ----------------------- | ------ | ------------------------------------------------------------------------- |
| I. Type Safety          | PASS   | All exports properly typed; `boolean \| undefined` return type for guards |
| II. Branch Protection   | PASS   | No changes to workflow                                                    |
| III. Cross-Platform     | PASS   | No shared package changes                                                 |
| IV. Testing Discipline  | PASS   | Test mocking patterns documented in quickstart.md                         |
| V. Feature Organization | PASS   | Barrel file follows feature-architecture.md exactly                       |
| VI. Theme System        | N/A    | No theme changes                                                          |

**Post-Design Gate Result**: All principles PASS. Ready for task generation.

## Project Structure

### Documentation (this feature)

```text
specs/001-hypernative-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (barrel file design)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
apps/web/src/features/hypernative/
├── index.tsx                    # NEW: Main barrel file (public API)
├── types.ts                     # NEW: Consolidated type exports
├── constants.ts                 # Existing
├── components/
│   ├── HnBanner/               # Existing (no changes to internals)
│   ├── HnDashboardBanner/      # Existing
│   ├── HnMiniTxBanner/         # Existing
│   ├── HnPendingBanner/        # Existing
│   ├── HnActivatedSettingsBanner/
│   ├── HnQueueAssessment/
│   ├── HnQueueAssessmentBanner/
│   ├── HnLoginCard/
│   ├── HnSecurityReportBtn/
│   ├── HnSignupFlow/
│   ├── HypernativeLogo/
│   ├── HypernativeTooltip/
│   ├── QueueAssessmentProvider/
│   ├── withHnFeature/          # DEPRECATED: Replace with withFeatureGuard
│   ├── withHnBannerConditions/
│   └── withHnSignupFlow/
├── hooks/
│   ├── index.ts                # Existing (internal use only after migration)
│   ├── useIsHypernativeFeature.ts      # Rename to useIsHypernativeEnabled
│   ├── useIsHypernativeQueueScanFeature.ts  # Rename to useIsHypernativeQueueScanEnabled
│   └── [other hooks]
├── services/
│   └── [unchanged]
├── store/
│   ├── index.ts                # Existing (re-exported via main barrel)
│   ├── hnStateSlice.ts
│   └── calendlySlice.ts
├── contexts/
│   └── QueueAssessmentContext.tsx
└── config/
    └── oauth.ts
```

**Structure Decision**: The existing feature folder structure is preserved. The migration adds a new root `index.tsx` barrel file and consolidates public exports. Internal component structure remains unchanged.

## Complexity Tracking

No constitution violations to justify. The migration follows the established feature architecture pattern.
