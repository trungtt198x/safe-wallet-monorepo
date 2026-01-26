# Tasks: Migrate Hypernative to Feature Architecture

**Input**: Design documents from `/specs/001-migrate-hypernative/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested - existing tests will be updated as part of migration tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app path**: `apps/web/src/`
- **Feature path**: `apps/web/src/features/hypernative/`
- **ESLint config**: `apps/web/eslint.config.mjs`

---

## Phase 1: Setup (Analysis & Preparation)

**Purpose**: Verify prerequisites and prepare for migration

- [x] T001 Verify eslint-plugin-boundaries is installed in apps/web/package.json
- [x] T002 [P] Run `yarn workspace @safe-global/web type-check` to establish baseline
- [x] T003 [P] Document current bundle size for comparison after migration (Baseline: 1.55 MB First Load JS shared)

---

## Phase 2: User Story 1 - Create Public API Barrel File (Priority: P1) 🎯 MVP

**Goal**: Create the main barrel file that exposes the hypernative feature's public API with lazy-loaded components

**Independent Test**: Import from `@/features/hypernative` resolves and exports expected items

### Implementation for User Story 1

- [x] T004 [US1] Rename hook file from `apps/web/src/features/hypernative/hooks/useIsHypernativeFeature.ts` to `apps/web/src/features/hypernative/hooks/useIsHypernativeEnabled.ts`
- [x] T005 [US1] Update function name inside `apps/web/src/features/hypernative/hooks/useIsHypernativeEnabled.ts` from `useIsHypernativeFeature` to `useIsHypernativeEnabled`
- [x] T006 [US1] Update hooks sub-barrel to export renamed hook in `apps/web/src/features/hypernative/hooks/index.ts`
- [x] T007 [US1] Create OAuthCallbackHandler component directory `apps/web/src/features/hypernative/components/OAuthCallbackHandler/`
- [x] T008 [US1] Extract OAuth logic from `apps/web/src/pages/hypernative/oauth-callback.tsx` into `apps/web/src/features/hypernative/components/OAuthCallbackHandler/index.tsx`
- [x] T009 [US1] Create main barrel file `apps/web/src/features/hypernative/index.ts` with all hook exports (named exports)
- [x] T010 [US1] Add type exports to barrel file `apps/web/src/features/hypernative/index.ts`
- [x] T011 [US1] Add lazy-loaded component exports using next/dynamic in `apps/web/src/features/hypernative/index.ts`
- [x] T012 [US1] Add constant exports (MIN_BALANCE_USD, hnBannerID) to `apps/web/src/features/hypernative/index.ts`
- [x] T013 [US1] Add OAuth utilities (readPkce, clearPkce) to `apps/web/src/features/hypernative/index.ts`
- [x] T014 [US1] Update `apps/web/src/pages/hypernative/oauth-callback.tsx` to import OAuthCallbackHandler from barrel

**Checkpoint**: Barrel file exists and TypeScript compiles successfully

---

## Phase 3: User Story 2 - Migrate External Imports to Barrel (Priority: P1)

**Goal**: Update all external consumers to import from the barrel file instead of internal paths

**Independent Test**: No imports from `@/features/hypernative/hooks/*`, `@/features/hypernative/components/*` etc. outside the feature

### Implementation for User Story 2

#### Dashboard Components

- [x] T015 [P] [US2] Update imports in `apps/web/src/components/dashboard/FirstSteps/index.tsx` to use barrel
- [x] T016 [P] [US2] Update imports in `apps/web/src/components/dashboard/index.tsx` to use barrel

#### Transaction Components

- [x] T017 [P] [US2] Update imports in `apps/web/src/components/transactions/TxSummary/index.tsx` to use barrel
- [x] T018 [P] [US2] Update imports in `apps/web/src/components/transactions/TxDetails/index.tsx` to use barrel

#### Settings Components

- [x] T019 [P] [US2] Update imports in `apps/web/src/components/settings/SecurityLogin/index.tsx` to use barrel

#### Sidebar Components

- [x] T020 [P] [US2] Update imports in `apps/web/src/components/sidebar/SidebarHeader/SafeHeaderInfo.tsx` to use barrel

#### Common Components

- [x] T021 [P] [US2] Update imports in `apps/web/src/components/common/EthHashInfo/SrcEthHashInfo/index.tsx` to use barrel

#### Transaction Flow Components

- [x] T022 [P] [US2] Update imports in `apps/web/src/components/tx-flow/flows/NewTx/index.tsx` to use barrel

#### Pages

- [x] T023 [P] [US2] Update imports in `apps/web/src/pages/transactions/queue.tsx` to use barrel
- [x] T024 [P] [US2] Update imports in `apps/web/src/pages/transactions/history.tsx` to use barrel

#### Cross-Feature (Safe Shield)

- [x] T025 [P] [US2] Update imports in `apps/web/src/features/safe-shield/index.tsx` to use barrel
- [x] T026 [P] [US2] Update imports in `apps/web/src/features/safe-shield/SafeShieldContext.tsx` to use barrel
- [x] T027 [P] [US2] Update imports in `apps/web/src/features/safe-shield/hooks/useThreatAnalysis.ts` to use barrel
- [x] T028 [P] [US2] Update imports in `apps/web/src/features/safe-shield/hooks/useNestedThreatAnalysis.ts` to use barrel
- [x] T029 [P] [US2] Update imports in `apps/web/src/features/safe-shield/components/HypernativeInfo/index.tsx` to use barrel
- [x] T030 [P] [US2] Update imports in `apps/web/src/features/safe-shield/components/HypernativeCustomChecks/HypernativeCustomChecks.tsx` to use barrel
- [x] T031 [P] [US2] Update imports in `apps/web/src/features/safe-shield/components/ThreatAnalysis/ThreatAnalysis.tsx` to use barrel
- [x] T032 [P] [US2] Update imports in `apps/web/src/features/safe-shield/components/AnalysisGroupCard/AnalysisGroupCard.tsx` to use barrel
- [x] T033 [P] [US2] Update imports in `apps/web/src/features/safe-shield/components/SafeShieldContent/index.tsx` to use barrel
- [x] T034 [P] [US2] Update imports in `apps/web/src/features/safe-shield/components/SafeShieldDisplay.tsx` to use barrel

**Checkpoint**: All external imports use barrel; `yarn workspace @safe-global/web type-check` passes

---

## Phase 4: User Story 3 - Standardize Feature Flag Hook Naming (Priority: P2)

**Goal**: Complete migration of all usages from `useIsHypernativeFeature` to `useIsHypernativeEnabled`

**Independent Test**: `grep -r "useIsHypernativeFeature"` returns no results

### Implementation for User Story 3

- [x] T035 [P] [US3] Update test mock in `apps/web/src/components/settings/__tests__/SecurityLogin.test.tsx` to use `useIsHypernativeEnabled`
- [x] T036 [P] [US3] Search for and update any remaining usages of `useIsHypernativeFeature` in the codebase
- [x] T037 [US3] Verify no references to old hook name remain: run `grep -r "useIsHypernativeFeature" apps/web/src/`

**Checkpoint**: No references to `useIsHypernativeFeature` exist in codebase

---

## Phase 5: User Story 4 - Enforce Internal Relative Imports (Priority: P2)

**Goal**: Ensure all internal hypernative code uses relative imports instead of absolute feature paths

**Independent Test**: No imports from `@/features/hypernative` inside `src/features/hypernative/`

### Implementation for User Story 4

- [x] T038 [P] [US4] Audit `apps/web/src/features/hypernative/components/` for absolute imports and convert to relative
- [x] T039 [P] [US4] Audit `apps/web/src/features/hypernative/hooks/` for absolute imports and convert to relative
- [x] T040 [US4] Verify no internal absolute imports: run `grep -r "@/features/hypernative" apps/web/src/features/hypernative/`

**Checkpoint**: All internal imports are relative paths

---

## Phase 6: User Story 5 - Configure ESLint Import Boundaries (Priority: P3)

**Goal**: Add ESLint rules to automatically enforce import boundaries

**Independent Test**: ESLint warns when adding a violating import

### Implementation for User Story 5

- [x] T041 [US5] Add `no-restricted-imports` rule for hypernative internal paths in `apps/web/eslint.config.mjs` (already configured)
- [x] T042 [US5] Add `boundaries/element-types` rule for internal relative imports in `apps/web/eslint.config.mjs` (already configured)
- [x] T043 [US5] Run `yarn workspace @safe-global/web lint` to verify no violations (test file warnings expected)

**Checkpoint**: ESLint passes with new boundary rules

---

## Phase 7: Polish & Validation

**Purpose**: Final verification and cleanup

- [x] T044 Run `yarn workspace @safe-global/web type-check` - must pass ✓
- [x] T045 Run `yarn workspace @safe-global/web lint` - must pass (0 errors, warnings expected for unmigrated features) ✓
- [x] T046 Run `yarn workspace @safe-global/web test` - must pass (459 tests, 27 suites) ✓
- [ ] T047 Run `yarn workspace @safe-global/web knip:exports` - verify no unused exports from barrel (deferred)
- [x] T048 Compare bundle size with baseline from T003 - must not increase (1.54 MB vs 1.55 MB baseline - 10KB smaller) ✓
- [ ] T049 Manual verification: test OAuth flow in development environment (deferred to user)
- [ ] T050 Manual verification: test dashboard banners display correctly (deferred to user)
- [ ] T051 Manual verification: test transaction queue assessment features (deferred to user)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup - Creates barrel file (FOUNDATIONAL for all other stories)
- **User Story 2 (Phase 3)**: Depends on US1 - Cannot migrate imports until barrel exists
- **User Story 3 (Phase 4)**: Depends on US1 - Hook rename is in barrel file
- **User Story 4 (Phase 5)**: Can start after US1 - Independent of US2/US3
- **User Story 5 (Phase 6)**: Can start after US1 - Independent of US2/US3/US4
- **Polish (Phase 7)**: Depends on ALL user stories being complete

### User Story Dependencies

```
Phase 1: Setup
    │
    ▼
Phase 2: US1 - Create Barrel File 🎯 MVP (FOUNDATIONAL)
    │
    ├──────────────┬──────────────┬──────────────┐
    ▼              ▼              ▼              ▼
Phase 3: US2   Phase 4: US3   Phase 5: US4   Phase 6: US5
(Migrate       (Hook          (Internal      (ESLint
 Imports)       Rename)        Imports)       Rules)
    │              │              │              │
    └──────────────┴──────────────┴──────────────┘
                        │
                        ▼
                Phase 7: Polish & Validation
```

### Parallel Opportunities

**Within Phase 1 (Setup)**:

- T002 and T003 can run in parallel

**Within Phase 3 (US2 - Import Migration)**:

- ALL tasks T015-T034 can run in parallel (different files, no dependencies)

**Within Phase 4 (US3 - Hook Rename)**:

- T035 and T036 can run in parallel

**Within Phase 5 (US4 - Internal Imports)**:

- T038 and T039 can run in parallel

**Cross-Phase Parallelism (after Phase 2)**:

- US2, US3, US4, and US5 can all proceed in parallel once US1 is complete

---

## Parallel Example: User Story 2 (Import Migration)

```bash
# All these tasks can run simultaneously since they modify different files:
Task T015: "Update imports in apps/web/src/components/dashboard/FirstSteps/index.tsx"
Task T016: "Update imports in apps/web/src/components/dashboard/index.tsx"
Task T017: "Update imports in apps/web/src/components/transactions/TxSummary/index.tsx"
Task T018: "Update imports in apps/web/src/components/transactions/TxDetails/index.tsx"
# ... and so on for T019-T034
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: User Story 1 (T004-T014)
3. **STOP and VALIDATE**: Barrel file exists, TypeScript compiles
4. This creates the foundation for all other work

### Incremental Delivery

1. Complete Setup + US1 → Barrel file ready (MVP!)
2. Add US2 → External imports migrated → Test independently
3. Add US3 → Hook naming complete → Test independently
4. Add US4 → Internal imports fixed → Test independently
5. Add US5 → ESLint rules active → Test independently
6. Polish → Full validation suite

### Parallel Team Strategy

With multiple developers after US1 is complete:

- Developer A: User Story 2 (T015-T034) - High volume, parallelizable
- Developer B: User Story 3 + 4 (T035-T040) - Related internal changes
- Developer C: User Story 5 (T041-T043) - ESLint configuration

---

## Notes

- [P] tasks = different files, no dependencies on other tasks in same phase
- [Story] label maps task to specific user story for traceability
- Each user story after US1 is independently testable
- Commit after each task or logical group
- Stop at any checkpoint to validate progress
- US2 has the most tasks but all are parallelizable - ideal for batch processing
