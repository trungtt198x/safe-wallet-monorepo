# Tasks: Enable Rspack for Production Builds

**Input**: Design documents from `/specs/001-rspack-prod-build/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Not explicitly requested - manual verification via build output inspection.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- All file paths are relative to `apps/web/`

---

## Phase 1: Setup (Baseline Measurement)

**Purpose**: Establish baseline metrics before making changes

- [x] T001 Record baseline webpack build time by running `time yarn workspace @safe-global/web build` and documenting the result
  - **Result**: 1 minute 42.81 seconds (102.81s)
- [x] T002 Verify current legal pages render correctly with webpack build by checking /terms, /cookie, /privacy in the output
  - **Result**: All 3 pages exist, cookie.html contains 2 tables

**Checkpoint**: Baseline established - proceed to user story implementation

---

## Phase 2: User Story 1 - Legal Content Renders Correctly (Priority: P1) 🎯 MVP

**Goal**: Ensure legal content (Terms, Cookie Policy, Privacy Policy) renders correctly with rspack builds

**Independent Test**: Build with `USE_RSPACK=1 next build` and verify /terms, /cookie, /privacy pages have working tables and TOC links

### Option A: Enable Remark Plugins (Preferred)

- [x] T003 [US1] Modify MDX config in `next.config.mjs:168-177` to enable `remarkGfm` and `remarkHeadingId` for rspack builds
  - **Result**: Config updated with remarkGfm and remarkHeadingId for rspack
- [x] T004 [US1] Test rspack build with remark plugins by running `cross-env USE_RSPACK=1 next build`
  - **Result**: FAILED - "Cannot read properties of undefined (reading 'get')" - remark plugins incompatible with rspack
  - **Decision**: Proceeding to Option B (convert MD to TSX)
- [ ] T005 [US1] Verify /cookie page: confirm 2 GFM tables render with proper HTML table formatting
- [ ] T006 [US1] Verify /terms page: test 3-5 TOC anchor links navigate to correct sections
- [ ] T007 [US1] Verify /privacy page: confirm content renders correctly without raw markdown syntax

### Option B: Convert MD to TSX (Fallback - only if Option A fails)

> **NOTE**: Skip this section if Option A succeeds. Only execute if remark plugins cause build errors with rspack.

- [ ] T008 [US1] [P] Convert `src/markdown/terms/terms.md` to `src/components/legal/Terms.tsx` with JSX markup and explicit heading IDs
- [ ] T009 [US1] [P] Convert `src/markdown/cookie/cookie.md` to `src/components/legal/CookiePolicy.tsx` with MUI Table components
- [ ] T010 [US1] [P] Convert `src/markdown/privacy/privacy.md` to `src/components/legal/PrivacyPolicy.tsx` with JSX markup
- [ ] T011 [US1] Update `src/pages/terms.tsx` to import from new TSX component
- [ ] T012 [US1] Update `src/pages/cookie.tsx` to import from new TSX component
- [ ] T013 [US1] Update `src/pages/privacy.tsx` to import from new TSX component
- [ ] T014 [US1] Remove old MD files from `src/markdown/` directory (terms.md, cookie.md, privacy.md)

**Checkpoint**: Legal content renders correctly with rspack - US1 complete

---

## Phase 3: User Story 2 - Optimized Production Build (Priority: P1)

**Goal**: Enable rspack as the default production build bundler with >2 minute time savings

**Independent Test**: Run `yarn workspace @safe-global/web build` and verify build time is >2 minutes faster than baseline

**Depends on**: US1 complete (legal content must work first)

### Implementation

- [ ] T015 [US2] Modify `package.json` build script from `"build": "next build"` to `"build": "cross-env USE_RSPACK=1 next build"`
- [ ] T016 [US2] Run rspack production build and record total build time
- [ ] T017 [US2] Verify build output directory (`out/`) contains all expected files
- [ ] T018 [US2] Verify SRI manifest is generated at `out/_next/static/chunks/chunks-sri-manifest.js`
- [ ] T019 [US2] Compare build time to baseline - confirm >2 minute improvement
- [ ] T020 [US2] Serve the build locally and verify application loads correctly

**Checkpoint**: Rspack production build working with >2 min improvement - US2 complete

---

## Phase 4: User Story 3 - Fallback Build (Priority: P2)

**Goal**: Provide webpack fallback build script for risk mitigation

**Independent Test**: Run `yarn workspace @safe-global/web build:webpack` and verify it produces working artifacts identical to pre-change behavior

### Implementation

- [ ] T021 [US3] Add `"build:webpack": "next build"` script to `package.json`
- [ ] T022 [US3] Run webpack fallback build and verify it completes successfully
- [ ] T023 [US3] Compare output of `build:webpack` to original baseline - confirm identical behavior
- [ ] T024 [US3] Verify both `build` and `build:webpack` scripts work with existing environment variables including CI-specific vars (NEXT*PUBLIC*\*, NODE_ENV=production, CI=true)

**Checkpoint**: Both build methods available and working - US3 complete

---

## Phase 5: User Story 4 - Build Performance Documentation (Priority: P3)

**Goal**: Document build time improvements with measurable data

**Independent Test**: Documentation file exists with actual measured build times for both methods

### Implementation

- [ ] T025 [US4] Create `docs/build-performance.md` with build time comparison table
- [ ] T026 [US4] Document rspack build time (actual measurement from T016)
- [ ] T027 [US4] Document webpack build time (baseline from T001)
- [ ] T028 [US4] Calculate and document time savings (target: >2 minutes)
- [ ] T029 [US4] Document both build commands with usage examples
- [ ] T030 [US4] Update `specs/001-rspack-prod-build/quickstart.md` with actual measured times

**Checkpoint**: Documentation complete with real measurements - US4 complete

---

## Phase 6: Polish & Verification

**Purpose**: Final verification across all user stories

- [ ] T031 Run full verification checklist from quickstart.md
- [ ] T032 Verify all legal pages (/terms, /cookie, /privacy) match webpack build output
- [ ] T033 Run existing test suite to confirm no regressions: `yarn workspace @safe-global/web test`
- [ ] T034 Update spec.md status from "Draft" to "Complete"

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (US1: Legal Content) → Phase 3 (US2: Rspack Build)
                                                          ↓
                                               Phase 4 (US3: Fallback)
                                                          ↓
                                               Phase 5 (US4: Documentation)
                                                          ↓
                                               Phase 6 (Polish)
```

### User Story Dependencies

| Story                | Priority | Depends On           | Can Parallelize                 |
| -------------------- | -------- | -------------------- | ------------------------------- |
| US1 - Legal Content  | P1       | Baseline (T001-T002) | No - must complete before US2   |
| US2 - Rspack Build   | P1       | US1 complete         | No - depends on US1             |
| US3 - Fallback Build | P2       | US2 complete         | Could start after US1 if needed |
| US4 - Documentation  | P3       | US2, US3 complete    | No - needs final measurements   |

### Critical Path

**US1 (Legal Content) blocks US2 (Rspack Build)** - Cannot enable rspack for production until legal content renders correctly.

### Within User Story 1 (Option A vs Option B)

- Try Option A first (T003-T007)
- If Option A fails: Execute Option B (T008-T014)
- Option B tasks T008-T010 can run in parallel (different files)

---

## Parallel Opportunities

### Phase 2 (US1) - Option B Only

```bash
# If Option A fails, these can run in parallel:
- [ ] T008 [US1] [P] Convert terms.md to Terms.tsx
- [ ] T009 [US1] [P] Convert cookie.md to CookiePolicy.tsx
- [ ] T010 [US1] [P] Convert privacy.md to PrivacyPolicy.tsx
```

### Limited Parallelism

This feature has limited parallel opportunities because:

1. US1 must complete before US2 (legal content blocks rspack enablement)
2. US2 must complete before US3 (need rspack build working before adding fallback)
3. US4 depends on actual measurements from US2 and US3

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup (baseline measurement)
2. Complete Phase 2: US1 - Legal Content (Option A preferred)
3. Complete Phase 3: US2 - Rspack Build
4. **STOP and VALIDATE**: >2 min build time improvement achieved
5. Deploy/demo if ready

### Full Implementation

1. MVP (US1 + US2) → Rspack builds working
2. Add US3 → Fallback available for safety
3. Add US4 → Documentation complete
4. Polish → All verification passed

### Decision Points

| After Task | Decision                                                          |
| ---------- | ----------------------------------------------------------------- |
| T004       | If remark plugins fail with rspack → Execute Option B (T008-T014) |
| T019       | If <2 min improvement → Investigate or adjust expectations        |
| T023       | If fallback differs from baseline → Debug before proceeding       |

---

## Task Summary

| Phase | Story          | Task Count | Files Modified                                         |
| ----- | -------------- | ---------- | ------------------------------------------------------ |
| 1     | Setup          | 2          | None (measurement only)                                |
| 2     | US1 (Option A) | 5          | `next.config.mjs`                                      |
| 2     | US1 (Option B) | 7          | `src/components/legal/*.tsx`, `src/pages/*.tsx`        |
| 3     | US2            | 6          | `package.json`                                         |
| 4     | US3            | 4          | `package.json`                                         |
| 5     | US4            | 6          | `docs/build-performance.md`, `specs/.../quickstart.md` |
| 6     | Polish         | 4          | `specs/.../spec.md`                                    |

**Total Tasks**:

- Option A path: 27 tasks
- Option B path: 34 tasks (if Option A fails)

---

## Notes

- Option A (remark plugins) is strongly preferred - simpler and maintains existing content structure
- Option B (TSX conversion) is fallback only if rspack has plugin compatibility issues
- All verification tasks (T005-T007, T020, T023, T031-T033) are manual inspection
- Commit after each logical group of tasks
- Build times may vary based on machine specs - document the test environment
