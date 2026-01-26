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

- [ ] T001 Create `packages/design-system/` directory structure per plan.md
- [ ] T002 Initialize `packages/design-system/package.json` with name `@safe-global/design-system`
- [ ] T003 [P] Create `packages/design-system/tsconfig.json` extending root tsconfig
- [ ] T004 [P] Create `packages/design-system/.design-system.config.json` with Figma source config
- [ ] T005 Add `@safe-global/design-system` to root `package.json` workspaces (if needed)
- [ ] T006 Run `yarn install` to link new package

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Initialize shadcn/ui in `apps/web/` using preset command from plan.md
- [ ] T008 Update `apps/web/tailwind.config.ts` font family from Inter to DM Sans
- [ ] T009 [P] Create `apps/web/src/lib/utils.ts` with `cn()` utility (shadcn requirement)
- [ ] T010 [P] Configure Tailwind content paths in `apps/web/tailwind.config.ts` per research.md
- [ ] T011 [P] Create `apps/web/src/styles/design-system.css` as token import entry point
- [ ] T012 Add PostCSS configuration for Tailwind in `apps/web/postcss.config.js` (if not exists)
- [ ] T013 Import `design-system.css` in `apps/web/src/app/layout.tsx` or equivalent entry point
- [ ] T014 Verify Tailwind builds without errors: `yarn workspace @safe-global/web build`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Import Design Tokens from Figma (Priority: P1) 🎯 MVP

**Goal**: Developers can sync design tokens from Figma to code via CLI command

**Independent Test**: Run `yarn design-system:sync` and verify CSS files are generated in `packages/design-system/src/tokens/`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Create `packages/design-system/src/types/tokens.ts` with DesignToken, TokenCollection interfaces from data-model.md
- [ ] T016 [P] [US1] Create `packages/design-system/src/cli/transform.ts` with token transformation logic per research.md §4
- [ ] T017 [US1] Create `packages/design-system/src/cli/figma-client.ts` with Figma MCP integration (only light mode enabled for colors yet. leave a note on how to sync tokens, when dark mode is available)
- [ ] T018 [US1] Create `packages/design-system/src/cli/sync-tokens.ts` main CLI entry point per contracts/token-sync-cli.md
- [ ] T019 [US1] Create `packages/design-system/src/tokens/colors.css` (initial placeholder, will be generated)
- [ ] T020 [P] [US1] Create `packages/design-system/src/tokens/spacing.css` (initial placeholder)
- [ ] T021 [P] [US1] Create `packages/design-system/src/tokens/typography.css` (initial placeholder)
- [ ] T022 [P] [US1] Create `packages/design-system/src/tokens/radius.css` (initial placeholder)
- [ ] T023 [US1] Create `packages/design-system/src/tokens/index.css` combining all token imports
- [ ] T024 [US1] Add `sync-tokens` script to `packages/design-system/package.json`
- [ ] T025 [US1] Add `design-system:sync` script to root `package.json`
- [ ] T026 [US1] Run initial token sync to populate CSS files from Figma
- [ ] T027 [US1] Create `packages/design-system/src/index.ts` exporting token types and CSS path

**Checkpoint**: Token sync CLI fully functional - can sync Figma tokens to CSS files

---

## Phase 4: User Story 2 - View Components in Storybook (Priority: P1)

**Goal**: Designers and developers can view tokens and components in Storybook

**Independent Test**: Run `yarn workspace @safe-global/web storybook`, navigate to Foundations section, see color/spacing/typography documentation

### Implementation for User Story 2

- [ ] T028 [P] [US2] Create `apps/web/src/stories/foundations/` directory structure
- [ ] T029 [P] [US2] Create `apps/web/src/stories/foundations/TokenSwatch.tsx` reusable token display component
- [ ] T030 [P] [US2] Create `apps/web/src/stories/foundations/SpacingScale.tsx` spacing visualization component
- [ ] T031 [P] [US2] Create `apps/web/src/stories/foundations/TypographyScale.tsx` typography preview component
- [ ] T032 [US2] Create `apps/web/src/stories/foundations/Colors.mdx` with color token documentation
- [ ] T033 [US2] Create `apps/web/src/stories/foundations/Spacing.mdx` with spacing scale documentation
- [ ] T034 [US2] Create `apps/web/src/stories/foundations/Typography.mdx` with font scale documentation
- [ ] T035 [US2] Create `apps/web/src/stories/foundations/Radius.mdx` with border radius documentation
- [ ] T036 [US2] Update `apps/web/.storybook/preview.tsx` to import design system tokens
- [ ] T037 [US2] Configure Storybook sidebar ordering to show Foundations first
- [ ] T038 [US2] Verify Storybook displays tokens: `yarn workspace @safe-global/web storybook`

**Checkpoint**: Storybook shows complete token documentation in Foundations section

---

## Phase 5: User Story 3 - Build Atoms Using shadcn/ui (Priority: P2)

**Goal**: Developers can use foundational shadcn/ui atoms themed with Figma tokens

**Independent Test**: Import Button from both direct and wrapper paths, render in Storybook, verify both work

### 5A: Install Base shadcn Components

- [ ] T039 [US3] Add Button component: `cd apps/web && npx shadcn@latest add button`
- [ ] T040 [US3] Add Input component: `npx shadcn@latest add input`
- [ ] T041 [US3] Add Label component: `npx shadcn@latest add label`
- [ ] T042 [US3] Add Card component: `npx shadcn@latest add card`
- [ ] T043 [US3] Add Badge component: `npx shadcn@latest add badge`
- [ ] T044 [US3] Update `apps/web/src/components/ui/button.tsx` to use design system tokens

### 5B: Option A - Direct Usage Pattern (Document in Storybook)

- [ ] T045 [P] [US3] Create `apps/web/src/stories/components/direct/Button.stories.tsx` showing direct shadcn import usage
- [ ] T046 [P] [US3] Create `apps/web/src/stories/components/direct/Input.stories.tsx` with direct usage examples
- [ ] T047 [P] [US3] Create `apps/web/src/stories/components/direct/Card.stories.tsx` with direct usage
- [ ] T048 [US3] Create `apps/web/src/stories/components/direct/README.mdx` documenting direct import pattern

### 5C: Option B - Wrapper Components Pattern (For Experimentation)

- [ ] T049 [P] [US3] Create `apps/web/src/features/design-system/components/` directory
- [ ] T050 [US3] Create `apps/web/src/features/design-system/components/Button.tsx` wrapper around shadcn Button with Safe-specific defaults
- [ ] T051 [US3] Create `apps/web/src/features/design-system/components/Input.tsx` wrapper with Safe styling conventions
- [ ] T052 [US3] Create `apps/web/src/features/design-system/components/Card.tsx` wrapper with Safe card patterns
- [ ] T053 [US3] Create `apps/web/src/features/design-system/components/Badge.tsx` wrapper with Safe badge variants
- [ ] T054 [P] [US3] Create `apps/web/src/stories/components/wrapped/Button.stories.tsx` showing wrapper usage
- [ ] T055 [P] [US3] Create `apps/web/src/stories/components/wrapped/Input.stories.tsx` with wrapper examples
- [ ] T056 [P] [US3] Create `apps/web/src/stories/components/wrapped/Card.stories.tsx` with wrapper usage
- [ ] T057 [US3] Create `apps/web/src/stories/components/wrapped/README.mdx` documenting wrapper pattern
- [ ] T058 [US3] Create `apps/web/src/features/design-system/index.ts` exporting both direct re-exports and wrappers
- [ ] T059 [US3] Create `apps/web/src/stories/components/Comparison.mdx` comparing direct vs wrapper approaches

**Checkpoint**: Both direct and wrapper component patterns available for evaluation

---

## Phase 6: User Story 4 - Compose Molecules and Screens (Priority: P2)

**Goal**: Developers can compose molecules from atoms using both approaches

**Independent Test**: Create FormField molecule with both patterns, compare in Storybook

### 6A: Direct Composition Pattern

- [ ] T060 [P] [US4] Create `apps/web/src/components/ui/molecules/` directory
- [ ] T061 [US4] Create `apps/web/src/components/ui/molecules/FormField.tsx` composing shadcn Label + Input directly
- [ ] T062 [US4] Create `apps/web/src/components/ui/molecules/ActionCard.tsx` composing shadcn Card + Button directly
- [ ] T063 [P] [US4] Create `apps/web/src/stories/molecules/direct/FormField.stories.tsx`
- [ ] T064 [P] [US4] Create `apps/web/src/stories/molecules/direct/ActionCard.stories.tsx`

### 6B: Wrapper Composition Pattern

- [ ] T065 [P] [US4] Create `apps/web/src/features/design-system/molecules/` directory
- [ ] T066 [US4] Create `apps/web/src/features/design-system/molecules/FormField.tsx` using wrapper components
- [ ] T067 [US4] Create `apps/web/src/features/design-system/molecules/ActionCard.tsx` using wrapper components
- [ ] T068 [P] [US4] Create `apps/web/src/stories/molecules/wrapped/FormField.stories.tsx`
- [ ] T069 [P] [US4] Create `apps/web/src/stories/molecules/wrapped/ActionCard.stories.tsx`

### 6C: Screen Templates

- [ ] T070 [US4] Create `apps/web/src/stories/templates/` directory for screen examples
- [ ] T071 [US4] Create `apps/web/src/stories/templates/ExampleScreen.stories.tsx` showing full composition with both approaches
- [ ] T072 [US4] Update `apps/web/src/features/design-system/index.ts` to export molecules
- [ ] T073 [US4] Create `apps/web/src/stories/molecules/Comparison.mdx` comparing molecule composition approaches

**Checkpoint**: Molecules available with both patterns, ready for team evaluation

---

## Phase 7: User Story 5 - Experiment with Code-First Design (Priority: P3)

**Goal**: Team can iterate on components in code with instant Storybook feedback

**Independent Test**: Modify a component in code, see change in Storybook within 2 seconds via hot reload

### Implementation for User Story 5

- [ ] T074 [US5] Verify Storybook hot-reload works: `yarn workspace @safe-global/web storybook`
- [ ] T075 [US5] Create `apps/web/src/stories/experiments/` directory for prototypes
- [ ] T076 [US5] Create `apps/web/src/stories/experiments/README.mdx` documenting experiment workflow
- [ ] T077 [US5] Add example experimental component in `apps/web/src/stories/experiments/Prototype.stories.tsx`
- [ ] T078 [US5] Document code-first workflow in quickstart.md or Storybook docs
- [ ] T079 [US5] Verify component changes reflect immediately (<2s) in Storybook

**Checkpoint**: Code-first experimentation workflow validated and documented

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T080 [P] Update `apps/web/src/features/design-system/index.ts` with complete exports
- [ ] T081 Run `yarn workspace @safe-global/web type-check` and fix any TypeScript errors
- [ ] T082 Run `yarn workspace @safe-global/web lint` and fix any linting errors
- [ ] T083 [P] Add design system entry to `apps/web/docs/` or update existing docs
- [ ] T084 Validate quickstart.md instructions end-to-end
- [ ] T085 [P] Add design system section to root README.md or AGENTS.md
- [ ] T086 Final Storybook review: verify all components documented with controls
- [ ] T087 Run `yarn workspace @safe-global/web build` to ensure production build works

---

## Phase 9: Dashboard Demo - Showcase the Design System 🎨

**Purpose**: Demonstrate the new design system by restyling part of the dashboard

**Goal**: Show how the new design system looks in a real feature context, enabling team to evaluate the approach

**Target Component**: Dashboard Overview (`apps/web/src/components/dashboard/Overview/`) - contains Card, Buttons, and layout patterns

### 9A: Create Demo Components (Does NOT replace existing)

- [ ] T088 Create `apps/web/src/features/design-system/demo/` directory for showcase components
- [ ] T089 Create `apps/web/src/features/design-system/demo/OverviewDemo.tsx` restyling Overview with shadcn/design system (direct approach)
- [ ] T090 Create `apps/web/src/features/design-system/demo/OverviewDemoWrapped.tsx` restyling Overview with wrapper components
- [ ] T091 [P] Create `apps/web/src/features/design-system/demo/ActionButtons.tsx` Send/Swap/Receive buttons in new design system
- [ ] T092 [P] Create `apps/web/src/features/design-system/demo/BalanceCard.tsx` total balance card in new design system

### 9B: Storybook Demo Stories

- [ ] T093 Create `apps/web/src/stories/demo/` directory for demo stories
- [ ] T094 Create `apps/web/src/stories/demo/OverviewDemo.stories.tsx` showing restyled Overview side-by-side
- [ ] T095 Create `apps/web/src/stories/demo/ActionButtons.stories.tsx` with all button variants
- [ ] T096 Create `apps/web/src/stories/demo/BalanceCard.stories.tsx` showing balance display
- [ ] T097 Create `apps/web/src/stories/demo/BeforeAfter.mdx` visual comparison of MUI vs new design system

### 9C: Code Usage Examples

- [ ] T098 Create `apps/web/src/stories/demo/UsageExamples.mdx` showing code snippets for both approaches:
  - Direct shadcn import example
  - Wrapper component import example
  - Comparison of import paths and usage patterns
- [ ] T099 Create `apps/web/src/stories/demo/MigrationGuide.mdx` documenting how to migrate an existing MUI component

### 9D: Team Decision Support

- [ ] T100 Create `apps/web/src/stories/demo/Decision.mdx` with pros/cons table:
  - Direct approach: Less abstraction, full shadcn flexibility, community patterns
  - Wrapper approach: Enforced consistency, Safe-specific defaults, easier migration
- [ ] T101 Add recommendation section based on demo learnings

**Checkpoint**: Team can view working demo in Storybook and make informed decision on direct vs wrapper approach

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
