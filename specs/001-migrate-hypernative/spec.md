# Feature Specification: Migrate Hypernative to Feature Architecture

**Feature Branch**: `001-migrate-hypernative`
**Created**: 2026-01-26
**Status**: Draft
**Input**: User description: "I want to migrate the hypernative feature to the @apps/web/docs/feature-architecture.md spec"

## Clarifications

### Session 2026-01-26

- Q: How should the OAuth callback page (`src/pages/hypernative/oauth-callback.tsx`) import hypernative functionality given ESLint restrictions? → A: Move OAuth callback logic into the feature directory and have the page be a thin wrapper that imports from the barrel.
- Q: How should the feature flag hook naming be handled (current: `useIsHypernativeFeature`, convention: `useIsHypernativeEnabled`)? → A: Rename the hook to `useIsHypernativeEnabled` and update all usages and test mocks.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Create Public API Barrel File (Priority: P1)

As a developer working on the Safe{Wallet} codebase, I want the hypernative feature to expose a clean public API through a main barrel file (`index.ts`) so that external consumers can import from a single entry point and internal implementation details remain encapsulated.

**Why this priority**: This is the foundation of the feature architecture pattern. Without a proper barrel file, external code cannot import correctly, and the feature cannot be lazy-loaded for bundle optimization.

**Independent Test**: Can be verified by checking that `@/features/hypernative` resolves to a valid module that exports the necessary public API items.

**Acceptance Scenarios**:

1. **Given** the hypernative feature directory, **When** a developer imports from `@/features/hypernative`, **Then** they receive the default lazy-loaded component and named exports for hooks, types, and utilities needed externally
2. **Given** the barrel file exists, **When** the application builds, **Then** the hypernative components are code-split and not included in the main bundle
3. **Given** the barrel file, **When** running `yarn knip:exports`, **Then** no unused exports are flagged for items that are actually consumed externally

---

### User Story 2 - Migrate External Imports to Barrel (Priority: P1)

As a developer maintaining the codebase, I want all external imports of hypernative functionality to use the public barrel file so that the feature's internal structure can evolve without breaking consuming code.

**Why this priority**: External imports currently reach into internal paths (e.g., `@/features/hypernative/hooks/useHypernativeOAuth`), which violates the architecture pattern and creates tight coupling to implementation details.

**Independent Test**: Can be verified by running ESLint with the `no-restricted-imports` rule and confirming no violations for hypernative internal paths.

**Acceptance Scenarios**:

1. **Given** code in `src/pages/` that uses hypernative functionality, **When** the migration is complete, **Then** all imports come from `@/features/hypernative` or `@/features/hypernative/types`
2. **Given** code in `src/components/` that uses hypernative functionality, **When** the migration is complete, **Then** all imports come from the barrel file only
3. **Given** cross-feature imports in `src/features/safe-shield/`, **When** the migration is complete, **Then** imports come from the hypernative barrel file (not internal paths)

---

### User Story 3 - Standardize Feature Flag Hook Naming (Priority: P2)

As a developer following the feature architecture convention, I want the hypernative feature flag hook to follow the naming pattern `useIsHypernativeEnabled` so that it's consistent with other features and discoverable.

**Why this priority**: Naming consistency improves developer experience and makes the codebase more maintainable. The current hook `useIsHypernativeFeature` works but doesn't follow the documented pattern.

**Independent Test**: Can be verified by checking that `useIsHypernativeEnabled` is exported from the barrel and all previous usages of `useIsHypernativeFeature` have been updated.

**Acceptance Scenarios**:

1. **Given** the feature architecture naming convention, **When** a developer looks for the feature flag hook, **Then** they find `useIsHypernativeEnabled` exported from the barrel
2. **Given** the renamed hook, **When** searching for `useIsHypernativeFeature` in the codebase, **Then** no usages remain (fully migrated to new name)
3. **Given** test files that previously mocked `useIsHypernativeFeature`, **When** the migration is complete, **Then** all mocks reference `useIsHypernativeEnabled`

---

### User Story 4 - Enforce Internal Relative Imports (Priority: P2)

As a developer working within the hypernative feature, I want all internal imports to use relative paths so that the feature remains self-contained and the ESLint boundaries plugin can detect violations.

**Why this priority**: Internal code using absolute feature paths can cause circular dependencies and defeats the purpose of the barrel file separation.

**Independent Test**: Can be verified by running ESLint with the `boundaries/element-types` rule within the hypernative feature directory.

**Acceptance Scenarios**:

1. **Given** code inside `src/features/hypernative/components/`, **When** importing from other hypernative modules, **Then** relative imports are used (e.g., `../hooks/useAuthToken`)
2. **Given** code inside `src/features/hypernative/hooks/`, **When** importing shared utilities, **Then** relative imports are used (e.g., `../utils/buildSecurityReportUrl`)

---

### User Story 5 - Configure ESLint Import Boundaries (Priority: P3)

As a codebase maintainer, I want ESLint rules configured to enforce the hypernative import boundaries automatically so that future code changes don't regress the architecture.

**Why this priority**: Automated enforcement prevents architectural drift over time. Without ESLint rules, developers might accidentally import from internal paths.

**Independent Test**: Can be verified by intentionally adding a violating import and confirming ESLint reports a warning.

**Acceptance Scenarios**:

1. **Given** the ESLint configuration, **When** external code tries to import from `@/features/hypernative/hooks/useAuthToken`, **Then** ESLint warns "Import from feature barrel only"
2. **Given** the ESLint configuration, **When** internal code tries to import from `@/features/hypernative`, **Then** ESLint warns "Use relative imports within a feature"

---

### Edge Cases

- What happens when a hook is used both internally and externally? The hook should be exported from the barrel for external use, while internal code uses relative imports.
- How should types that are only used internally be handled? Types should remain unexported from the barrel; only types needed by external consumers should be exported.
- What if an external consumer needs a utility that's currently internal-only? Evaluate if the utility should be promoted to the public API or if the consumer's needs can be met differently.
- How to handle the OAuth callback page that imports internal modules? The page (`src/pages/hypernative/oauth-callback.tsx`) becomes a thin wrapper that imports an `OAuthCallbackHandler` component from the barrel. All OAuth logic (PKCE handling, token exchange) moves into the feature directory.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Feature MUST expose a public API through `src/features/hypernative/index.ts` barrel file
- **FR-002**: Barrel file MUST export a lazy-loaded default component using `next/dynamic` for primary UI entry points
- **FR-003**: Barrel file MUST export `useIsHypernativeEnabled` hook for feature flag checking
- **FR-004**: Barrel file MUST only export items that are consumed by code outside the feature
- **FR-005**: External consumers MUST import from `@/features/hypernative` or `@/features/hypernative/types` only
- **FR-006**: Internal feature code MUST use relative imports for all intra-feature dependencies
- **FR-007**: System MUST maintain existing functionality during and after migration (no regressions)
- **FR-008**: Feature MUST continue to be gated by the existing `FEATURES.HYPERNATIVE` feature flag
- **FR-009**: System MUST support tree-shaking by not re-exporting heavy internal modules through the barrel
- **FR-010**: Sub-barrels (`hooks/index.ts`, `store/index.ts`) MAY remain for organizing code but should not be imported directly by external code
- **FR-011**: OAuth callback page (`src/pages/hypernative/oauth-callback.tsx`) MUST be refactored to a thin wrapper that imports an `OAuthCallbackHandler` component from the barrel, with all OAuth logic moved into the feature directory
- **FR-012**: Feature flag hook MUST be renamed from `useIsHypernativeFeature` to `useIsHypernativeEnabled`, with all usages and test mocks updated accordingly

### Key Entities

- **Barrel File**: The `index.ts` file that defines the public API surface of the feature
- **External Consumer**: Any code outside `src/features/hypernative/` that uses hypernative functionality
- **Internal Module**: Any code inside `src/features/hypernative/` that should not be directly imported externally
- **Feature Flag Hook**: The `useIsHypernativeEnabled` hook that determines if the feature is available on the current chain

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All external imports of hypernative functionality use the barrel file (0 direct internal path imports from outside the feature)
- **SC-002**: ESLint runs without warnings related to hypernative import boundaries
- **SC-003**: Running `yarn knip:exports` reports no unused exports from the hypernative barrel file
- **SC-004**: The application bundle size does not increase as a result of the migration (lazy-loading preserved)
- **SC-005**: All existing tests pass without modification (except test mocking paths if needed)
- **SC-006**: The hypernative feature remains fully functional in all existing use cases (dashboard banners, transaction queue, settings, OAuth flow)

## Assumptions

- The existing hypernative feature implementation is correct and should not change behavior
- The `hooks/index.ts` and `store/index.ts` sub-barrels will remain as internal organization but won't be the external import target
- The OAuth callback page refactoring to a thin wrapper is a straightforward change with low risk
- ESLint configuration changes will be additive (won't break other parts of the codebase)
- Existing tests that mock hypernative modules may need path updates but not logic changes

## Current State Analysis

### Identified Issues

1. **No main barrel file**: `src/features/hypernative/index.ts` does not exist
2. **Deep external imports**: 50+ files import from internal paths like `@/features/hypernative/hooks/*`
3. **Feature flag hook naming**: Current hook is `useIsHypernativeFeature`, will be renamed to `useIsHypernativeEnabled` with all usages updated
4. **Mixed import patterns**: Some internal code uses absolute paths instead of relative imports

### Files Requiring Migration (External Consumers)

- `src/store/slices.ts` - exports from store
- `src/components/dashboard/` - multiple files importing hooks and components
- `src/components/transactions/` - TxSummary, TxDetails importing hooks and components
- `src/components/settings/` - SecurityLogin importing banners and hooks
- `src/components/sidebar/` - SafeHeaderInfo importing hooks
- `src/components/common/` - EthHashInfo importing tooltip
- `src/pages/transactions/` - queue.tsx and history.tsx importing multiple items
- `src/pages/hypernative/` - oauth-callback.tsx (special case - part of feature)
- `src/features/safe-shield/` - cross-feature imports of hooks, types, and components
- `src/components/tx-flow/` - NewTx importing banner

### Items to Export from Barrel

Based on external usage analysis:

- Default: Lazy-loaded primary component (if applicable)
- `useIsHypernativeEnabled` (renamed/aliased from `useIsHypernativeFeature`)
- `useIsHypernativeGuard`, `HypernativeGuardCheckResult` type
- `useIsHypernativeQueueScanFeature`
- `useBannerStorage`, `BannerType`
- `useBannerVisibility`, `BannerVisibilityResult` type, `MIN_BALANCE_USD`
- `useAuthToken`
- `useHypernativeOAuth`, `HypernativeAuthStatus` type, `readPkce`, `clearPkce`
- `useIsHypernativeEligible`, `HypernativeEligibility` type
- `useQueueAssessment`
- `useShowHypernativeAssessment`
- `useCalendly`
- `useAssessmentUrl`
- `useHnAssessmentSeverity`
- Components: HnDashboardBannerWithNoBalanceCheck, HnMiniTxBanner, HnBannerForCarousel, HnBannerForHistory, HnBannerForQueue, HnBannerForSettings, HnActivatedBannerForSettings, HnPendingBanner, HnLoginCard, HnQueueAssessment, HnQueueAssessmentBanner, QueueAssessmentProvider, HypernativeTooltip, HypernativeLogo, hnBannerID
- Store exports (already re-exported via `src/store/slices.ts`)
- OAuth config: `HYPERNATIVE_OAUTH_CONFIG`, `getRedirectUri`
