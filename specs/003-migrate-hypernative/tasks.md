# Tasks: Migrate Hypernative Feature to Feature-Architecture-v2

**Input**: Design documents from `/specs/003-migrate-hypernative/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification. Test updates will be included where existing tests need modification.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- Include exact file paths in descriptions

## Path Conventions

- **Project root**: `apps/web/src/`
- **Feature location**: `apps/web/src/features/hypernative/`
- **Consumer locations**: Various (see plan.md Consumer Files section)

---

## Phase 1: Setup (Verification)

**Purpose**: Verify current structure and prepare for migration

- [x] T001 Verify current hypernative folder structure in `apps/web/src/features/hypernative/`
- [x] T002 Verify store slices exist in `apps/web/src/features/hypernative/store/` (confirm no relocation needed)
- [x] T003 List all current exports from `apps/web/src/features/hypernative/index.ts` and barrel files

---

## Phase 2: Foundational (Core Feature Infrastructure)

**Purpose**: Create the v2 architecture files that MUST be complete before consumer updates

**⚠️ CRITICAL**: No consumer updates can begin until this phase is complete

### US1+US5: Contract and Type Safety

- [x] T004 [P] Create `apps/web/src/features/hypernative/contract.ts` with HypernativeContract interface using typeof pattern for all components
- [x] T005 [P] Update `apps/web/src/features/hypernative/types.ts` to export BannerType, HypernativeAuthStatus, HypernativeEligibility types

### US1: Feature Implementation File

- [x] T006 Create `apps/web/src/features/hypernative/feature.ts` with direct imports of all components in flat structure
- [x] T007 Add all hook imports to `apps/web/src/features/hypernative/feature.ts` with flat export
- [x] T008 Add all service imports to `apps/web/src/features/hypernative/feature.ts` with flat export
- [x] T009 Add QueueAssessmentProvider to `apps/web/src/features/hypernative/feature.ts` exports

### US1+US2: Feature Handle

- [x] T010 Update `apps/web/src/features/hypernative/index.ts` to use createFeatureHandle with FEATURES.HYPERNATIVE
- [x] T011 Export HypernativeFeature and public types from `apps/web/src/features/hypernative/index.ts`

### US3: Store Integration

- [x] T012 Verify `apps/web/src/features/hypernative/store/index.ts` barrel exports all slices and selectors
- [x] T013 Update `apps/web/src/store/slices.ts` to import from new hypernative store location if needed

**Checkpoint**: Core feature infrastructure complete. Run `yarn workspace @safe-global/web type-check` to verify contract types.

---

## Phase 3: User Story 4 - Consumer Updates (Priority: P2) 🎯 Main Work

**Goal**: Update all 29 consumer files to use useLoadFeature() pattern with flat access

**Independent Test**: Each consumer component renders correctly with HypernativeFeature loaded

### Pages (2 files)

- [ ] T014 [P] [US4] Update `apps/web/src/pages/transactions/queue.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T015 [P] [US4] Update `apps/web/src/pages/transactions/history.tsx` to use useLoadFeature(HypernativeFeature)

### Dashboard Components (2 files)

- [ ] T016 [P] [US4] Update `apps/web/src/components/dashboard/index.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T017 [P] [US4] Update `apps/web/src/components/dashboard/FirstSteps/index.tsx` to use useLoadFeature(HypernativeFeature)

### Transaction Components (3 files)

- [ ] T018 [P] [US4] Update `apps/web/src/components/transactions/TxDetails/index.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T019 [P] [US4] Update `apps/web/src/components/transactions/TxSummary/index.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T020 [P] [US4] Update `apps/web/src/components/tx-flow/flows/NewTx/index.tsx` to use useLoadFeature(HypernativeFeature)

### Settings Components (2 files)

- [ ] T021 [P] [US4] Update `apps/web/src/components/settings/SecurityLogin/index.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T022 [P] [US4] Update `apps/web/src/components/settings/__tests__/SecurityLogin.test.tsx` to mock HypernativeFeature module

### Common Components (2 files)

- [ ] T023 [P] [US4] Update `apps/web/src/components/sidebar/SidebarHeader/SafeHeaderInfo.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T024 [P] [US4] Update `apps/web/src/components/common/EthHashInfo/SrcEthHashInfo/index.tsx` to use useLoadFeature(HypernativeFeature)

### Safe Shield Feature - Core (4 files)

- [ ] T025 [P] [US4] Update `apps/web/src/features/safe-shield/index.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T026 [P] [US4] Update `apps/web/src/features/safe-shield/SafeShieldContext.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T027 [P] [US4] Update `apps/web/src/features/safe-shield/components/SafeShieldDisplay.tsx` to import types from hypernative/types
- [ ] T028 [P] [US4] Update `apps/web/src/features/safe-shield/components/SafeShieldContent/index.tsx` to import types from hypernative/types

### Safe Shield Feature - Components (4 files)

- [ ] T029 [P] [US4] Update `apps/web/src/features/safe-shield/components/HypernativeInfo/index.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T030 [P] [US4] Update `apps/web/src/features/safe-shield/components/AnalysisGroupCard/AnalysisGroupCard.tsx` to use useLoadFeature(HypernativeFeature)
- [ ] T031 [P] [US4] Update `apps/web/src/features/safe-shield/components/ThreatAnalysis/ThreatAnalysis.tsx` to import types from hypernative/types
- [ ] T032 [P] [US4] Update `apps/web/src/features/safe-shield/components/HypernativeCustomChecks/HypernativeCustomChecks.tsx` to import types from hypernative/types

### Safe Shield Feature - Hooks (2 files)

- [ ] T033 [P] [US4] Update `apps/web/src/features/safe-shield/hooks/useThreatAnalysis.ts` to use useLoadFeature(HypernativeFeature)
- [ ] T034 [P] [US4] Update `apps/web/src/features/safe-shield/hooks/useNestedThreatAnalysis.ts` to use useLoadFeature(HypernativeFeature)

### Safe Shield Feature - Tests (6 files)

- [ ] T035 [P] [US4] Update `apps/web/src/features/safe-shield/__tests__/SafeShieldWidget.test.tsx` to mock HypernativeFeature module
- [ ] T036 [P] [US4] Update `apps/web/src/features/safe-shield/components/__tests__/HypernativeInfo.test.tsx` to mock HypernativeFeature module
- [ ] T037 [P] [US4] Update `apps/web/src/features/safe-shield/components/ThreatAnalysis/__tests__/ThreatAnalysis.test.tsx` to mock HypernativeFeature module
- [ ] T038 [P] [US4] Update `apps/web/src/features/safe-shield/components/HypernativeCustomChecks/__tests__/HypernativeCustomChecks.test.tsx` to mock HypernativeFeature module
- [ ] T039 [P] [US4] Update `apps/web/src/features/safe-shield/hooks/__tests__/useThreatAnalysis.test.tsx` to mock HypernativeFeature module
- [ ] T040 [P] [US4] Update `apps/web/src/features/safe-shield/hooks/__tests__/useNestedThreatAnalysis.test.tsx` to mock HypernativeFeature module

### Other Tests (1 file)

- [ ] T041 [P] [US4] Update `apps/web/src/tests/pages/hypernative-oauth-callback.test.tsx` to mock HypernativeFeature module

**Checkpoint**: All consumers updated. Run `yarn workspace @safe-global/web type-check` to verify all imports resolve.

---

## Phase 4: Polish & Verification

**Purpose**: Verify migration success and ensure no regressions

### Quality Gates

- [ ] T042 Run `yarn workspace @safe-global/web type-check` and fix any type errors
- [ ] T043 Run `yarn workspace @safe-global/web lint` and fix any ESLint warnings for feature architecture violations
- [ ] T044 Run `yarn workspace @safe-global/web prettier` and fix any formatting issues
- [ ] T045 Run `yarn workspace @safe-global/web test` and fix any failing tests

### Feature Verification

- [ ] T046 Verify HypernativeFeature lazy loading works when feature flag is enabled
- [ ] T047 Verify HypernativeFeature returns $isDisabled when feature flag is disabled
- [ ] T048 Verify proxy stubs work correctly (components render null, hooks return {})
- [ ] T049 Verify Redux state persistence works (banner dismissal, form completion)

### Documentation

- [ ] T050 Update `apps/web/docs/feature-architecture-v2.md` to add Hypernative as reference implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all consumer updates
- **Consumer Updates (Phase 3)**: All depend on Foundational phase completion
  - All consumer updates can proceed in parallel (different files)
- **Polish (Phase 4)**: Depends on all consumer updates being complete

### Task Dependencies Within Phases

**Phase 2 (Foundational)**:

```
T004 (contract.ts) ─────┐
T005 (types.ts) ────────┼──→ T006-T009 (feature.ts) ──→ T010-T011 (index.ts)
                        │
T012 (store verify) ────┘
T013 (slices.ts update) - can run in parallel
```

**Phase 3 (Consumer Updates)**:

- All T014-T041 can run in parallel (different files)
- No cross-file dependencies

**Phase 4 (Polish)**:

- T042-T045 must run sequentially (fix issues as found)
- T046-T049 can run in parallel (different verification scenarios)

### Parallel Opportunities

**Phase 2** - These can run in parallel:

- T004 (contract.ts) and T005 (types.ts)

**Phase 3** - ALL consumer tasks (T014-T041) can run in parallel:

- 28 files can be updated simultaneously
- Each file is independent

---

## Parallel Example: Consumer Updates

```bash
# Launch all page updates together:
Task: "Update apps/web/src/pages/transactions/queue.tsx"
Task: "Update apps/web/src/pages/transactions/history.tsx"

# Launch all dashboard updates together:
Task: "Update apps/web/src/components/dashboard/index.tsx"
Task: "Update apps/web/src/components/dashboard/FirstSteps/index.tsx"

# Launch all safe-shield updates together:
Task: "Update apps/web/src/features/safe-shield/index.tsx"
Task: "Update apps/web/src/features/safe-shield/SafeShieldContext.tsx"
# ... (all 13 safe-shield files)
```

---

## Implementation Strategy

### MVP First (Foundational Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T013)
3. **STOP and VALIDATE**: Run type-check to verify core infrastructure
4. Feature infrastructure is now usable

### Full Migration (All Consumers)

1. Complete Setup + Foundational → Core infrastructure ready
2. Complete Consumer Updates (T014-T041) → All in parallel
3. Complete Polish (T042-T050) → Verify everything works
4. **Result**: Fully migrated feature

### Recommended Approach

Since all consumer updates must be atomic (per clarification), run all Phase 3 tasks in parallel using batch execution:

```bash
# After Phase 2 is complete, launch all consumer updates:
for task in T014 T015 T016 ... T041; do
  launch_parallel "$task"
done

# Wait for all to complete, then run Phase 4
```

---

## Notes

- [P] tasks = different files, no dependencies
- [US4] = Consumer update tasks (main migration work)
- Contract.ts must use `typeof` pattern for IDE navigation
- Feature.ts uses direct imports (NOT lazy()) per v2 pattern
- All consumer updates are atomic - no partial migration allowed
- Tests use mock pattern: `jest.mock('@/features/hypernative', ...)`
- Commit after each phase completion for easy rollback
