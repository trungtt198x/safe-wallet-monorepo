# Feature Specification: Hypernative Feature Architecture Migration

**Feature Branch**: `001-hypernative-migration`
**Created**: 2026-01-28
**Status**: Draft
**Input**: User description: "migrate the hypernative feature to the new feature architecture"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Maintain Current User Experience (Priority: P1)

Safe{Wallet} users who have Hypernative Guard enabled on their Safe should continue to see all Hypernative-related UI elements (banners, badges, security reports) exactly as they do today, with no visible changes to functionality or appearance.

**Why this priority**: This is the core requirement - the migration must be transparent to end users. Any regression in user-facing functionality would defeat the purpose of a refactoring effort.

**Independent Test**: Can be verified by navigating through all pages where Hypernative UI appears (Dashboard, Settings, Transaction Queue, History) and confirming all features work identically before and after migration.

**Acceptance Scenarios**:

1. **Given** a Safe with Hypernative Guard enabled, **When** user navigates to Dashboard, **Then** the Hypernative promo banner displays with signup flow functionality
2. **Given** a Safe with Hypernative Guard enabled, **When** user views transaction queue, **Then** security assessment badges and banners appear correctly
3. **Given** a Safe without Hypernative Guard, **When** the HYPERNATIVE feature flag is enabled on the chain, **Then** promotional banners appear encouraging signup
4. **Given** a Safe on a chain without the HYPERNATIVE feature flag, **When** user navigates anywhere, **Then** no Hypernative UI elements are visible

---

### User Story 2 - Developer Experience: Clean Import Paths (Priority: P2)

Developers working on the Safe{Wallet} codebase should be able to import all public Hypernative functionality from a single barrel file (`@/features/hypernative`) rather than from deep internal paths.

**Why this priority**: Clean import patterns improve code maintainability and allow the feature to evolve its internal structure without breaking external consumers.

**Independent Test**: Can be verified by checking that all external imports come from the barrel file and ESLint rules block deep imports.

**Acceptance Scenarios**:

1. **Given** a developer needs to use HnBanner component, **When** they import from `@/features/hypernative`, **Then** they receive the properly guarded and lazy-loaded component
2. **Given** a developer tries to import from `@/features/hypernative/components/HnBanner`, **When** ESLint runs, **Then** an error is raised directing them to the barrel file
3. **Given** a developer works inside the hypernative feature, **When** they import internal modules, **Then** they use relative imports (not absolute feature paths)

---

### User Story 3 - Performance: Bundle Optimization (Priority: P3)

The application should only load Hypernative code when the feature is enabled and components are actually rendered, reducing initial bundle size for users who don't use Hypernative features.

**Why this priority**: Performance optimization improves user experience for all users, especially those on slower connections or devices. This aligns with the architecture goal of lazy-loading feature code.

**Independent Test**: Can be verified by analyzing bundle output and confirming Hypernative components are in separate chunks that load on demand.

**Acceptance Scenarios**:

1. **Given** the HYPERNATIVE feature flag is disabled, **When** page loads, **Then** no Hypernative component code is included in the initial bundle
2. **Given** the HYPERNATIVE feature flag is enabled, **When** user first visits a page with Hypernative UI, **Then** the component code is loaded dynamically
3. **Given** the application is analyzed with bundle analyzer, **When** examining chunk composition, **Then** Hypernative components appear in separate lazy-loaded chunks

---

### User Story 4 - Developer Experience: Self-Contained Component Visibility (Priority: P2)

Developers using Hypernative components should be able to place components directly in the React tree without computing visibility logic externally. The component itself (via its guard hook) should decide whether to render.

**Why this priority**: This completes the encapsulation goal - consumers shouldn't need deep knowledge of feature internals (balance thresholds, targeting rules, guard status) to use components correctly.

**Independent Test**: Can be verified by checking that consumer code only imports components (no visibility hooks) and uses the `wrapper` prop for layout.

**Acceptance Scenarios**:

1. **Given** a developer needs to show HnBannerForQueue, **When** they import from the barrel, **Then** they simply write `<HnBannerForQueue wrapper={(c) => <Box>{c}</Box>} />` without importing `useBannerVisibility` or computing `showBanner`
2. **Given** a developer needs to show HnLoginCard on queue page, **When** they import from the barrel, **Then** they simply write `<HnLoginCardForQueue />` without importing eligibility hooks
3. **Given** banner visibility depends on multiple conditions (balance, ownership, targeting, guard status), **When** the component is rendered, **Then** the component-specific guard hook handles all checks internally

---

### Edge Cases

- What happens when the feature flag status changes mid-session (e.g., chain switch)?
  - Components should reactively show/hide based on the new chain's feature flag state
- What happens when dynamic import fails (network error)?
  - Graceful degradation: no Hypernative UI shown, no application crash
- What happens when the user has already signed up for Hypernative but feature flag is disabled?
  - Feature flag takes precedence; no UI shown regardless of signup status

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The feature MUST expose a single barrel file (`index.ts` or `index.tsx`) as the public API
- **FR-002**: All component exports MUST use `withFeatureGuard` wrapping dynamically imported components
- **FR-003**: All component exports MUST be lazy-loaded via Next.js `dynamic()` imports at module level
- **FR-004**: The feature MUST provide separate feature flag hooks (`useIsHypernativeEnabled`, `useIsHypernativeQueueScanEnabled`) that each return `boolean | undefined`, allowing components to use the appropriate guard for their functionality
- **FR-005**: External code MUST only import from the feature barrel file or types file (not internal paths)
- **FR-006**: Internal code MUST use relative imports within the feature
- **FR-007**: ESLint rules MUST enforce import boundaries for the feature
- **FR-008**: The feature MUST support the `wrapper` prop pattern for layout composition
- **FR-009**: Redux store exports MUST remain compatible with existing store configuration in `src/store/slices.ts`
- **FR-010**: All existing Storybook stories MUST continue to function correctly
- **FR-011**: All existing unit tests MUST continue to pass
- **FR-012**: The existing `withHnFeature` HOC MUST be replaced by `withFeatureGuard`
- **FR-013**: Components with complex visibility logic MUST use component-specific guard hooks that encapsulate ALL visibility conditions (balance, ownership, targeting, guard status) rather than requiring consumers to import and compose multiple hooks
- **FR-014**: Component-specific guard hooks MUST return `boolean | undefined` where `undefined` indicates loading state, allowing consumers to simply place components in the tree without conditional rendering

### Key Entities

- **Feature Barrel**: The main `index.tsx` file that defines the public API surface
- **Guarded Component**: A component wrapped with `withFeatureGuard` that only renders when its guard hook returns `true`
- **Feature Flag Hooks**: `useIsHypernativeEnabled` and `useIsHypernativeQueueScanEnabled` - each returns `true`/`false`/`undefined` based on respective chain configuration flags
- **Component-Specific Guard Hook**: A hook that encapsulates ALL visibility logic for a specific component (e.g., `useHnBannerForQueueVisible`) - returns `boolean | undefined` and is used with `withFeatureGuard`
- **Internal Module**: Any file/folder within the feature that is not part of the public API

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of external imports to hypernative feature come from the barrel file only (excluding types)
- **SC-002**: 100% of public component exports use `dynamic()` + `withFeatureGuard` pattern
- **SC-003**: All existing unit tests pass without modification to test logic (only import path updates allowed)
- **SC-004**: All Storybook stories render correctly after migration
- **SC-005**: Bundle analysis shows Hypernative components in separate lazy-loaded chunks (not in main bundle)
- **SC-006**: Zero user-facing functional regressions in Hypernative features
- **SC-007**: ESLint configuration correctly flags violations of import boundary rules
- **SC-008**: Feature flag hook correctly returns `undefined` during loading, `true` when enabled, `false` when disabled

## Assumptions

- The existing `withHnFeature` HOC pattern is functionally equivalent to `withFeatureGuard` and can be replaced without behavioral changes
- The existing feature flag hooks (`useIsHypernativeFeature`, `useIsHypernativeQueueScanFeature`) will be kept separate and renamed to match the architecture naming convention (`useIsHypernativeEnabled`, `useIsHypernativeQueueScanEnabled`)
- The `safe-shield` feature's dependency on hypernative hooks/types is an acceptable external consumer pattern
- Redux store slice exports need to remain available via barrel re-export for the root store configuration
- Storybook stories may need updated import paths but no logic changes
- The migration can be completed without changing any component implementation code (only wiring/exports)
- Type exports from `@/features/hypernative/types` are allowed as they have zero runtime cost

## Clarifications

### Session 2026-01-28

- Q: How should multiple feature flags (HYPERNATIVE, HYPERNATIVE_QUEUE_SCAN) be handled? → A: Keep separate hooks - each guarded component uses the appropriate feature flag hook with `withFeatureGuard`
