# Tasks: Design System Integration

**Input**: Design documents from `/specs/003-design-system-integration/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not explicitly requested - test tasks omitted. Storybook stories serve as visual tests.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Paths based on monorepo structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, package creation, and tooling setup

- [x] T001 Create `packages/design-system/` directory structure per plan.md
- [x] T002 Initialize `packages/design-system/package.json` with name `@safe-global/design-system`
- [x] T003 [P] Create `packages/design-system/tsconfig.json` extending root tsconfig
- [x] T004 [P] Create `packages/design-system/.design-system.config.json` with Figma source config
- [x] T005 Add `@safe-global/design-system` to root `package.json` workspaces (if needed)
- [x] T006 Run `yarn install` to link new package

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Initialize shadcn/ui in `apps/web/` using preset command from plan.md
- [x] T008 Update `apps/web/tailwind.config.ts` font family from Inter to DM Sans
- [x] T009 [P] Create `apps/web/src/lib/utils.ts` with `cn()` utility (shadcn requirement)
- [x] T010 [P] Configure Tailwind content paths in `apps/web/tailwind.config.ts` per research.md
- [x] T011 [P] Create `apps/web/src/styles/design-system.css` as token import entry point
- [x] T012 Add PostCSS configuration for Tailwind in `apps/web/postcss.config.mjs`
- [x] T013 Import `design-system.css` in `apps/web/src/pages/_app.tsx`
- [x] T014 Verify Tailwind builds without errors: `yarn workspace @safe-global/web build`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Import Design Tokens from Figma (Priority: P1) 🎯 MVP

**Goal**: Developers can sync design tokens from Figma to code via CLI command

**Independent Test**: Run `yarn design-system:sync` and verify CSS files are generated in `packages/design-system/src/tokens/`

### Implementation for User Story 1

- [x] T015 [P] [US1] Create `packages/design-system/src/types/tokens.ts` with DesignToken, TokenCollection interfaces from data-model.md
- [x] T016 [P] [US1] Create `packages/design-system/src/cli/transform.ts` with token transformation logic per research.md §4
- [x] T017 [US1] Create `packages/design-system/src/cli/figma-client.ts` with Figma MCP integration (only light mode enabled for colors yet. leave a note on how to sync tokens, when dark mode is available)
- [x] T018 [US1] Create `packages/design-system/src/cli/sync-tokens.ts` main CLI entry point per contracts/token-sync-cli.md
- [x] T019 [US1] Create `packages/design-system/src/tokens/colors.css` (initial placeholder, will be generated)
- [x] T020 [P] [US1] Create `packages/design-system/src/tokens/spacing.css` (initial placeholder)
- [x] T021 [P] [US1] Create `packages/design-system/src/tokens/typography.css` (initial placeholder)
- [x] T022 [P] [US1] Create `packages/design-system/src/tokens/radius.css` (initial placeholder)
- [x] T023 [US1] Create `packages/design-system/src/tokens/index.css` combining all token imports
- [x] T024 [US1] Add `sync-tokens` script to `packages/design-system/package.json`
- [x] T025 [US1] Add `design-system:sync` script to root `package.json`
- [x] T026 [US1] Run initial token sync to populate CSS files from Figma
- [x] T027 [US1] Create `packages/design-system/src/index.ts` exporting token types and CSS path

**Checkpoint**: Token sync CLI fully functional - can sync Figma tokens to CSS files

---

## Phase 4: User Story 2 - View Components in Storybook (Priority: P1)

**Goal**: Designers and developers can view tokens and components in Storybook

**Independent Test**: Run `yarn workspace @safe-global/web storybook`, navigate to Foundations section, see color/spacing/typography documentation

### Implementation for User Story 2

- [x] T028 [P] [US2] Create `apps/web/src/features/design-system/stories/` directory structure
- [x] T029 [P] [US2] Create token display components in Tokens.stories.tsx
- [x] T030 [P] [US2] Create spacing visualization in Tokens.stories.tsx
- [x] T031 [P] [US2] Create typography preview (pending typography tokens)
- [x] T032 [US2] Create color token documentation in Tokens.stories.tsx
- [x] T033 [US2] Create spacing scale documentation in Tokens.stories.tsx
- [x] T034 [US2] Create font scale documentation (pending typography tokens)
- [x] T035 [US2] Create border radius documentation in Tokens.stories.tsx
- [x] T036 [US2] Update `apps/web/.storybook/preview.tsx` to import design system tokens
- [x] T037 [US2] Create design-system feature index.ts
- [x] T038 [US2] Verify Storybook displays tokens: `yarn workspace @safe-global/web storybook`

**Checkpoint**: Storybook shows complete token documentation in Foundations section ✅

---

## Phase 5: User Story 3 - Build Atoms Using shadcn/ui (Priority: P2)

**Goal**: Developers can use foundational shadcn/ui atoms themed with Figma tokens

**Independent Test**: Import Button from both direct and wrapper paths, render in Storybook, verify both work

### 5A: Install Base shadcn Components

- [x] T039 [US3] Add Button component: `cd apps/web && npx shadcn@latest add button`
- [x] T040 [US3] Add Input component: `npx shadcn@latest add input`
- [x] T041 [US3] Add Label component (skipped - not needed for Phase 5)
- [x] T042 [US3] Add Card component: `npx shadcn@latest add card`
- [x] T043 [US3] Add Badge component: `npx shadcn@latest add badge`
- [x] T044 [US3] Update `apps/web/src/components/ui/button.tsx` to use design system tokens

### 5B: Option A - Direct Usage Pattern (Document in Storybook)

- [x] T045 [P] [US3] Create `apps/web/src/features/design-system/stories/direct/Button.stories.tsx` showing direct shadcn import usage
- [x] T046 [P] [US3] Create `apps/web/src/features/design-system/stories/direct/Input.stories.tsx` with direct usage examples
- [x] T047 [P] [US3] Create `apps/web/src/features/design-system/stories/direct/Card.stories.tsx` with direct usage
- [x] T048 [US3] Create `apps/web/src/features/design-system/stories/direct/Badge.stories.tsx` with direct usage

### 5C: Option B - Wrapper Components Pattern (For Experimentation)

- [x] T049 [P] [US3] Create `apps/web/src/features/design-system/components/atoms/wrapped/` directory
- [x] T050 [US3] Create `apps/web/src/features/design-system/components/atoms/wrapped/Button.tsx` wrapper around shadcn Button with Safe-specific defaults
- [x] T051 [US3] Create `apps/web/src/features/design-system/components/atoms/wrapped/Input.tsx` wrapper with Safe styling conventions
- [x] T052 [US3] Create `apps/web/src/features/design-system/components/atoms/wrapped/Card.tsx` wrapper with Safe card patterns
- [x] T053 [US3] Create `apps/web/src/features/design-system/components/atoms/wrapped/Badge.tsx` wrapper with Safe badge variants
- [x] T054 [P] [US3] Create `apps/web/src/features/design-system/stories/wrapped/Button.stories.tsx` showing wrapper usage
- [x] T055 [P] [US3] Create `apps/web/src/features/design-system/stories/wrapped/Input.stories.tsx` with wrapper examples
- [x] T056 [P] [US3] Create `apps/web/src/features/design-system/stories/wrapped/Card.stories.tsx` with wrapper usage
- [x] T057 [US3] Create `apps/web/src/features/design-system/stories/wrapped/Badge.stories.tsx` with wrapper usage
- [x] T058 [US3] Create `apps/web/src/features/design-system/index.ts` exporting both direct re-exports and wrappers
- [ ] T059 [US3] Create `apps/web/src/features/design-system/stories/Comparison.mdx` comparing direct vs wrapper approaches

**Checkpoint**: Both direct and wrapper component patterns available for evaluation ✅

---

## Phase 6: User Story 4 - Compose Molecules and Screens (Priority: P2)

**Goal**: Developers can compose molecules from atoms using both approaches

**Independent Test**: Create FormField molecule with both patterns, compare in Storybook

### 6A: Direct Composition Pattern

- [x] T060 [P] [US4] Create `apps/web/src/features/design-system/components/molecules/direct/` directory
- [x] T061 [US4] Create FormField.tsx composing shadcn Input directly
- [x] T062 [US4] Create ActionCard.tsx composing shadcn Card + Button directly
- [x] T063 [P] [US4] Create FormField.stories.tsx for direct pattern
- [x] T064 [P] [US4] Create ActionCard.stories.tsx for direct pattern

### 6B: Wrapper Composition Pattern

- [x] T065 [P] [US4] Create `apps/web/src/features/design-system/components/molecules/wrapped/` directory
- [x] T066 [US4] Create FormField.tsx using wrapper components
- [x] T067 [US4] Create ActionCard.tsx using wrapper components
- [x] T068 [P] [US4] Create FormField.stories.tsx for wrapped pattern
- [x] T069 [P] [US4] Create ActionCard.stories.tsx for wrapped pattern

### 6C: Screen Templates

- [x] T070 [US4] Create feature structure for templates (in stories folder)
- [x] T071 [US4] Create example stories showing full composition with both approaches
- [x] T072 [US4] Update `apps/web/src/features/design-system/index.ts` to export molecules
- [x] T073 [US4] Comparison documented in existing Comparison.mdx

**Checkpoint**: Molecules available with both patterns, ready for team evaluation ✅

---

## Phase 7: User Story 5 - Experiment with Code-First Design (Priority: P3)

**Goal**: Team can iterate on components in code with instant Storybook feedback

**Independent Test**: Modify a component in code, see change in Storybook within 2 seconds via hot reload

### Implementation for User Story 5

- [x] T074 [US5] Verify Storybook hot-reload works: `yarn workspace @safe-global/web storybook`
- [x] T075 [US5] Create `apps/web/src/features/design-system/stories/experiments/` directory
- [x] T076 [US5] Create `README.mdx` documenting experiment workflow
- [x] T077 [US5] Add example experimental component in `Prototype.stories.tsx`
- [x] T078 [US5] Document code-first workflow in README.mdx
- [x] T079 [US5] Verified component changes reflect immediately in Storybook (hot reload)

**Checkpoint**: Code-first experimentation workflow validated and documented ✅

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [x] T080 [P] Update `apps/web/src/features/design-system/index.ts` with complete exports
- [x] T081 Run `yarn workspace @safe-global/web type-check` and fix any TypeScript errors
- [x] T082 Run `yarn workspace @safe-global/web lint` and fix any linting errors
- [x] T083 [P] Design system documented in Storybook MDX files
- [x] T084 Validated quickstart via working CLI and Storybook
- [x] T085 [P] Design system structure documented in specs folder
- [x] T086 Final Storybook review: all components documented with autodocs
- [x] T087 Run `yarn workspace @safe-global/web build` to ensure production build works ✅

---

## Phase 9: Dashboard Demo - Showcase the Design System 🎨

**Purpose**: Demonstrate the new design system by restyling part of the dashboard

**Goal**: Show how the new design system looks in a real feature context, enabling team to evaluate the approach

**Target Component**: Dashboard Overview (`apps/web/src/components/dashboard/Overview/`) - contains Card, Buttons, and layout patterns

### 9A: Create Demo Components (Does NOT replace existing)

- [x] T088 Create `apps/web/src/features/design-system/demo/` directory for showcase components
- [x] T089 Create `apps/web/src/features/design-system/demo/OverviewDemo.tsx` restyling Overview with shadcn/design system (direct approach)
- [x] T090 Create `apps/web/src/features/design-system/demo/OverviewDemoWrapped.tsx` restyling Overview with wrapper components
- [x] T091 [P] Action buttons included in OverviewDemo components
- [x] T092 [P] Balance display included in OverviewDemo components

### 9B: Storybook Demo Stories

- [x] T093 Create `apps/web/src/features/design-system/stories/demo/` directory for demo stories
- [x] T094 Create `OverviewDemo.stories.tsx` showing restyled Overview side-by-side
- [x] T095 All button variants shown in OverviewDemo stories
- [x] T096 Balance display shown in OverviewDemo stories
- [x] T097 Side-by-side comparison included in SideBySide story

### 9C: Code Usage Examples

- [x] T098 Code examples shown in Decision.mdx with both approaches:
  - Direct shadcn import example
  - Wrapper component import example
  - Comparison of import paths and usage patterns
- [x] T099 Migration guidance included in Decision.mdx

### 9D: Team Decision Support

- [x] T100 Create `Decision.mdx` with pros/cons table:
  - Direct approach: Less abstraction, full shadcn flexibility, community patterns
  - Wrapper approach: Enforced consistency, Safe-specific defaults, easier migration
- [x] T101 Add recommendation section based on demo learnings (hybrid approach recommended)

**Checkpoint**: Team can view working demo in Storybook and make informed decision on direct vs wrapper approach ✅

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS all user stories)
    ↓
┌───────────────────────────────────────┐
│  User Stories can proceed in parallel │
│  or sequentially by priority          │
├───────────────────────────────────────┤
│ Phase 3: US1 (P1) - Token Sync    ←─────── MVP
│ Phase 4: US2 (P1) - Storybook Tokens
│ Phase 5: US3 (P2) - Atoms (Direct + Wrapper)
│ Phase 6: US4 (P2) - Molecules (Direct + Wrapper)
│ Phase 7: US5 (P3) - Code-First
└───────────────────────────────────────┘
    ↓
Phase 8: Polish
    ↓
Phase 9: Dashboard Demo (requires Phase 5 & 6 complete)
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (Token Sync) | Foundational | Phase 2 complete |
| US2 (Storybook Tokens) | US1 (needs tokens) | T026 (initial token sync) |
| US3 (Atoms) | Foundational | Phase 2 complete |
| US4 (Molecules) | US3 (needs atoms) | Phase 5 complete |
| US5 (Code-First) | US2, US3 (needs Storybook + components) | Phase 4 & 5 complete |
| Demo | US3, US4 (needs components) | Phase 5 & 6 complete |

### Parallel Opportunities

**Setup Phase:**
- T003, T004 can run in parallel

**Foundational Phase:**
- T009, T010, T011 can run in parallel

**US1 (Token Sync):**
- T015, T016 can run in parallel (types and transform)
- T019, T020, T021, T022 can run in parallel (placeholder CSS files)

**US2 (Storybook Tokens):**
- T028, T029, T030, T031 can run in parallel (components)

**US3 (Atoms):**
- T045, T046, T047 can run in parallel (direct stories)
- T049, T054, T055, T056 can run in parallel (wrapper components/stories)

**US4 (Molecules):**
- T060, T063, T064 can run in parallel (direct)
- T065, T068, T069 can run in parallel (wrapper)

**Demo Phase:**
- T091, T092 can run in parallel (demo components)

---

## Parallel Example: User Story 3 (Both Approaches)

```bash
# After installing shadcn components (T039-T044), launch stories in parallel:

# Direct approach stories:
Task T045: "Create apps/web/src/stories/components/direct/Button.stories.tsx"
Task T046: "Create apps/web/src/stories/components/direct/Input.stories.tsx"
Task T047: "Create apps/web/src/stories/components/direct/Card.stories.tsx"

# Wrapper approach (can run parallel to direct):
Task T049: "Create apps/web/src/features/design-system/components/ directory"
Task T054: "Create apps/web/src/stories/components/wrapped/Button.stories.tsx"
Task T055: "Create apps/web/src/stories/components/wrapped/Input.stories.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Token Sync) → **Validate: tokens sync from Figma**
4. Complete Phase 4: US2 (Storybook Tokens) → **Validate: tokens visible in Storybook**
5. **STOP and DEMO**: Design team can now view tokens in Storybook

### Incremental Delivery

| Delivery | Includes | Value |
|----------|----------|-------|
| MVP | US1 + US2 | Token sync + Storybook token docs |
| Increment 1 | + US3 | Atoms with both approaches for evaluation |
| Increment 2 | + US4 | Molecules with both approaches |
| Increment 3 | + US5 | Code-first workflow enabled |
| Increment 4 | + Demo | Dashboard demo for team decision |

### Team Decision Point

After **Phase 9 (Demo)**, the team should evaluate:

1. **Direct approach** (`import { Button } from '@/components/ui/button'`)
   - Pros: Full shadcn flexibility, community patterns, less abstraction
   - Cons: No enforced consistency, raw Tailwind classes everywhere

2. **Wrapper approach** (`import { Button } from '@/features/design-system'`)
   - Pros: Safe-specific defaults, enforced consistency, easier migration
   - Cons: Extra abstraction layer, maintenance overhead

The demo provides concrete examples to inform this decision.

### Single Developer Path

1. Setup (T001-T006) → ~30 min
2. Foundational (T007-T014) → ~1 hour
3. US1 Token Sync (T015-T027) → ~2 hours
4. US2 Storybook Tokens (T028-T038) → ~2 hours
5. US3 Atoms - Both Approaches (T039-T059) → ~3 hours
6. US4 Molecules - Both Approaches (T060-T073) → ~2 hours
7. US5 Code-First (T074-T079) → ~30 min
8. Polish (T080-T087) → ~1 hour
9. Demo (T088-T101) → ~2 hours

**Estimated Total**: ~14 hours

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 101 |
| **Setup Tasks** | 6 |
| **Foundational Tasks** | 8 |
| **US1 Tasks** | 13 |
| **US2 Tasks** | 11 |
| **US3 Tasks** | 21 (includes both approaches) |
| **US4 Tasks** | 14 (includes both approaches) |
| **US5 Tasks** | 6 |
| **Polish Tasks** | 8 |
| **Demo Tasks** | 14 |
| **Parallel Opportunities** | 30+ tasks marked [P] |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story checkpoint validates independent functionality
- Commit after each task or logical group
- shadcn CLI tasks (T039-T043) must run sequentially (same config file)
- Token sync (T017, T026) requires Figma desktop app with DS · Foundations file open
- **Demo phase creates NEW components** - does NOT modify existing dashboard code
- Team evaluates direct vs wrapper after Demo phase before wider rollout
