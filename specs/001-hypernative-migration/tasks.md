# Tasks: Hypernative Feature Architecture Migration

**Input**: Design documents from `/specs/001-hypernative-migration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Existing tests should pass after migration. No new test tasks - only import path updates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths are relative to `apps/web/src/features/hypernative/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the foundational files for the new architecture

- [x] T001 Create feature flag hook `useIsHypernativeEnabled` in hooks/useIsHypernativeEnabled.ts (rename from useIsHypernativeFeature.ts, change return type to `boolean | undefined`)
- [x] T002 [P] Create feature flag hook `useIsHypernativeQueueScanEnabled` in hooks/useIsHypernativeQueueScanEnabled.ts (rename from useIsHypernativeQueueScanFeature.ts, change return type to `boolean | undefined`)
- [x] T003 [P] Create consolidated types file at types.ts with all public type exports
- [x] T004 Create main barrel file skeleton at index.tsx with section comments (no exports yet)

**Checkpoint**: Feature hooks and barrel file structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update internal imports to use relative paths - MUST complete before barrel exports work

**⚠️ CRITICAL**: All internal imports must be converted to relative paths before the barrel file can be completed

### Internal Import Updates (within hypernative feature)

- [x] T005 [P] Update imports in components/HnBanner/\*.tsx to use relative paths for store imports
- [x] T006 [P] Update imports in components/HnDashboardBanner/\*.tsx to use relative paths
- [x] T007 [P] Update imports in components/HnMiniTxBanner/\*.tsx to use relative paths
- [x] T008 [P] Update imports in components/HnPendingBanner/\*.tsx to use relative paths
- [x] T009 [P] Update imports in components/HnActivatedSettingsBanner/\*.tsx to use relative paths
- [x] T010 [P] Update imports in components/HnQueueAssessment/\*.tsx to use relative paths
- [x] T011 [P] Update imports in components/HnQueueAssessmentBanner/\*.tsx to use relative paths
- [x] T012 [P] Update imports in components/HnLoginCard/\*.tsx to use relative paths
- [x] T013 [P] Update imports in components/HnSecurityReportBtn/\*.tsx to use relative paths
- [x] T014 [P] Update imports in components/HnSignupFlow/\*.tsx to use relative paths
- [x] T015 [P] Update imports in hooks/\*.ts to use relative paths for internal dependencies
- [x] T016 Update hooks/index.ts to export renamed hooks (useIsHypernativeEnabled, useIsHypernativeQueueScanEnabled)

**Checkpoint**: All internal imports use relative paths - barrel file can now be completed

---

## Phase 3: User Story 1 - Maintain Current User Experience (Priority: P1) 🎯 MVP

**Goal**: Ensure all Hypernative UI elements continue to work exactly as before

**Independent Test**: Navigate through Dashboard, Settings, Transaction Queue, History and confirm all Hypernative features work identically

### Implementation for User Story 1

- [x] T017 [US1] Add banner component exports to index.tsx: HnBannerForCarousel, HnBannerForQueue, HnBannerForHistory, HnBannerForSettings with dynamic() + withFeatureGuard
- [x] T018 [P] [US1] Add dashboard banner exports to index.tsx: HnDashboardBanner, HnDashboardBannerWithNoBalanceCheck with dynamic() + withFeatureGuard
- [x] T019 [P] [US1] Add transaction banner exports to index.tsx: HnMiniTxBanner, HnPendingBanner with dynamic() + withFeatureGuard
- [x] T020 [P] [US1] Add settings banner export to index.tsx: HnActivatedBannerForSettings with dynamic() + withFeatureGuard
- [x] T021 [P] [US1] Add queue assessment exports to index.tsx: HnQueueAssessment, HnQueueAssessmentBanner with dynamic() + withFeatureGuard(useIsHypernativeQueueScanEnabled)
- [x] T022 [P] [US1] Add login card export to index.tsx: HnLoginCard with dynamic() + withFeatureGuard
- [x] T023 [P] [US1] Add utility component exports to index.tsx: QueueAssessmentProvider, HypernativeTooltip, HypernativeLogo (lazy-loaded, no guard)
- [x] T024 [US1] Add hook exports to index.tsx: useIsHypernativeGuard, useBannerVisibility, useAuthToken, useHypernativeOAuth, useQueueAssessment, useShowHypernativeAssessment, useIsHypernativeEligible, useIsHypernativeEnabled, useIsHypernativeQueueScanEnabled
- [x] T025 [US1] Add type exports to index.tsx: HypernativeGuardCheckResult, BannerVisibilityResult, HypernativeAuthStatus, HypernativeEligibility, BannerType
- [x] T026 [US1] Add constant exports to index.tsx: hnBannerID, HYPERNATIVE_ALLOWLIST_OUTREACH_ID, MIN_BALANCE_USD
- [x] T027 [US1] Add store re-exports to index.tsx: export \* from './store'
- [x] T028 [US1] Remove withHnFeature from component/HnBanner/index.ts (exports now handled by main barrel)
- [x] T029 [P] [US1] Remove withHnFeature from components/HnDashboardBanner/index.ts
- [x] T030 [P] [US1] Remove withHnFeature from components/HnMiniTxBanner/index.ts
- [x] T031 [P] [US1] Remove withHnFeature from components/HnPendingBanner/index.ts
- [x] T032 [P] [US1] Remove withHnFeature from components/HnActivatedSettingsBanner/index.ts
- [x] T033 [US1] Run type-check to verify barrel file compiles: `yarn workspace @safe-global/web type-check`

**Checkpoint**: Barrel file complete with all exports - feature functionality preserved

---

## Phase 4: User Story 2 - Developer Experience: Clean Import Paths (Priority: P2)

**Goal**: All external code imports from barrel file, ESLint enforces boundaries

**Independent Test**: Run ESLint and verify deep import violations are flagged; verify all imports use barrel

### External Import Updates (outside hypernative feature)

- [ ] T034 [US2] Update imports in pages/hypernative/oauth-callback.tsx to use barrel
- [ ] T035 [P] [US2] Update imports in pages/transactions/history.tsx to use barrel
- [ ] T036 [P] [US2] Update imports in pages/transactions/queue.tsx to use barrel
- [ ] T037 [P] [US2] Update imports in components/dashboard/FirstSteps/index.tsx to use barrel
- [ ] T038 [P] [US2] Update imports in components/dashboard/index.tsx to use barrel
- [ ] T039 [P] [US2] Update imports in components/sidebar/SidebarHeader/SafeHeaderInfo.tsx to use barrel
- [ ] T040 [P] [US2] Update imports in components/settings/SecurityLogin/index.tsx to use barrel
- [ ] T041 [P] [US2] Update imports in components/tx-flow/flows/NewTx/index.tsx to use barrel
- [ ] T042 [P] [US2] Update imports in components/transactions/TxDetails/index.tsx to use barrel
- [ ] T043 [P] [US2] Update imports in components/transactions/TxSummary/index.tsx to use barrel
- [ ] T044 [P] [US2] Update imports in components/common/EthHashInfo/SrcEthHashInfo/index.tsx to use barrel
- [ ] T045 [P] [US2] Update imports in features/safe-shield/index.tsx to use barrel
- [ ] T046 [P] [US2] Update imports in features/safe-shield/SafeShieldContext.tsx to use barrel
- [ ] T047 [P] [US2] Update imports in features/safe-shield/components/SafeShieldContent/index.tsx to use barrel
- [ ] T048 [P] [US2] Update imports in features/safe-shield/components/SafeShieldDisplay.tsx to use barrel
- [ ] T049 [P] [US2] Update imports in features/safe-shield/components/HypernativeInfo/index.tsx to use barrel
- [ ] T050 [P] [US2] Update imports in features/safe-shield/components/HypernativeCustomChecks/\*.tsx to use barrel
- [ ] T051 [P] [US2] Update imports in features/safe-shield/components/ThreatAnalysis/\*.tsx to use barrel
- [ ] T052 [P] [US2] Update imports in features/safe-shield/components/AnalysisGroupCard/AnalysisGroupCard.tsx to use barrel
- [ ] T053 [P] [US2] Update imports in features/safe-shield/hooks/useThreatAnalysis.ts to use barrel
- [ ] T054 [P] [US2] Update imports in features/safe-shield/hooks/useNestedThreatAnalysis.ts to use barrel

### Test File Import Updates

- [ ] T055 [P] [US2] Update imports in tests/pages/hypernative-oauth-callback.test.tsx to use barrel
- [ ] T056 [P] [US2] Update imports in components/settings/**tests**/SecurityLogin.test.tsx to use barrel
- [ ] T057 [P] [US2] Update imports in features/safe-shield/**tests**/SafeShieldWidget.test.tsx to use barrel
- [ ] T058 [P] [US2] Update imports in features/safe-shield/hooks/**tests**/useThreatAnalysis.test.tsx to use barrel
- [ ] T059 [P] [US2] Update imports in features/safe-shield/hooks/**tests**/useNestedThreatAnalysis.test.tsx to use barrel
- [ ] T060 [P] [US2] Update imports in features/safe-shield/components/**tests**/HypernativeInfo.test.tsx to use barrel

### ESLint Configuration

- [ ] T061 [US2] Verify ESLint no-restricted-imports rule includes hypernative feature internal paths in eslint.config.mjs
- [ ] T062 [US2] Run lint to verify no deep import violations: `yarn workspace @safe-global/web lint`

**Checkpoint**: All external imports use barrel - ESLint enforces boundaries

---

## Phase 5: User Story 3 - Performance: Bundle Optimization (Priority: P3)

**Goal**: Hypernative components are lazy-loaded, not in initial bundle

**Independent Test**: Run bundle analyzer and verify Hypernative components are in separate chunks

### Implementation for User Story 3

- [ ] T063 [US3] Verify all component exports in index.tsx use dynamic() with { ssr: false }
- [ ] T064 [US3] Run build and verify no errors: `yarn workspace @safe-global/web build`
- [ ] T065 [US3] Analyze bundle to confirm lazy loading: `yarn workspace @safe-global/web analyze` (if available) or check .next/static chunks

**Checkpoint**: Bundle optimization verified - lazy loading confirmed

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [ ] T066 [P] Run full test suite: `yarn workspace @safe-global/web test`
- [ ] T067 [P] Verify Storybook works: `yarn workspace @safe-global/web storybook` (manual check)
- [ ] T068 Delete deprecated withHnFeature HOC in components/withHnFeature/ (after confirming no usages)
- [ ] T069 Update hooks/index.ts to remove old hook names and only export via main barrel
- [ ] T070 Run prettier: `yarn prettier:fix`
- [ ] T071 Final type-check: `yarn workspace @safe-global/web type-check`
- [ ] T072 Final lint: `yarn workspace @safe-global/web lint`
- [ ] T073 Manual verification: Navigate through app and test all Hypernative features per quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS barrel file completion
- **User Story 1 (Phase 3)**: Depends on Foundational - barrel file exports
- **User Story 2 (Phase 4)**: Depends on User Story 1 - external imports need barrel to exist
- **User Story 3 (Phase 5)**: Depends on User Story 1 - verification of dynamic imports
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Creates the barrel file
- **User Story 2 (P2)**: Depends on US1 (barrel must exist before external imports can use it)
- **User Story 3 (P3)**: Depends on US1 (verification task, dynamic imports already implemented)

### Within Each User Story

- T017-T023 (component exports) can run in parallel
- T028-T032 (remove withHnFeature) can run in parallel
- T034-T060 (external import updates) can all run in parallel

### Parallel Opportunities

**Phase 1 (Setup)**: T001, T002, T003 can run in parallel

**Phase 2 (Foundational)**: T005-T015 can all run in parallel

**Phase 3 (US1)**: T017-T023 can run in parallel; T028-T032 can run in parallel

**Phase 4 (US2)**: T034-T060 can all run in parallel (different files)

**Phase 6 (Polish)**: T066, T067, T070 can run in parallel

---

## Parallel Example: User Story 2 External Imports

```bash
# Launch all external import updates together (all different files):
Task: "Update imports in pages/transactions/history.tsx to use barrel"
Task: "Update imports in pages/transactions/queue.tsx to use barrel"
Task: "Update imports in components/dashboard/FirstSteps/index.tsx to use barrel"
Task: "Update imports in components/dashboard/index.tsx to use barrel"
# ... all T034-T060 can run simultaneously
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T016)
3. Complete Phase 3: User Story 1 (T017-T033)
4. **STOP and VALIDATE**: Run type-check, verify app still works
5. Commit as working state

### Incremental Delivery

1. Setup + Foundational → Internal structure ready
2. Add User Story 1 → Barrel file complete, feature still works → **MVP!**
3. Add User Story 2 → All imports migrated → Clean codebase
4. Add User Story 3 → Bundle verified → Performance confirmed
5. Polish → Final validation → Ready for PR

### Single Developer Sequence

1. T001-T004 (Setup)
2. T005-T016 (Foundational - all parallel)
3. T017-T033 (US1 - barrel file + cleanup)
4. T034-T062 (US2 - imports + ESLint)
5. T063-T065 (US3 - verification)
6. T066-T073 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies - safe to parallelize
- [Story] label tracks which user story the task serves
- Most external import updates (US2) are independent and parallelizable
- Run type-check after each phase to catch issues early
- Commit after completing each phase
- The `withHnFeature` HOC removal happens AFTER barrel exports are working
