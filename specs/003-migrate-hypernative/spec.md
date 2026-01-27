# Feature Specification: Migrate Hypernative Feature to Feature-Architecture-v2

**Feature Branch**: `003-migrate-hypernative`
**Created**: 2026-01-27
**Status**: Draft
**Input**: User description: "Migrate hypernative feature to feature-architecture-v2 pattern"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Developer Uses Hypernative Feature via useLoadFeature (Priority: P1)

A developer working on another feature (e.g., safe-shield, transaction queue) needs to access Hypernative components, hooks, or services. After migration, they use the standardized `useLoadFeature()` pattern with flat structure access instead of direct internal imports.

**Why this priority**: This is the core value proposition of the migration - enabling proper lazy loading and decoupled feature access for all consumers.

**Independent Test**: Can be fully tested by importing `HypernativeFeature` from the feature barrel, calling `useLoadFeature(HypernativeFeature)`, and accessing exports like `feature.HnBanner`, `feature.useIsHypernativeGuard()` with proper type inference.

**Acceptance Scenarios**:

1. **Given** a component that needs Hypernative UI, **When** the developer imports `{ HypernativeFeature }` from `@/features/hypernative` and calls `useLoadFeature(HypernativeFeature)`, **Then** they receive a typed object with all public components accessible via flat structure (e.g., `feature.HnBanner`, `feature.HnQueueAssessment`)
2. **Given** a component accessing Hypernative while the feature is loading, **When** the developer accesses `feature.HnBanner`, **Then** the proxy stub renders `null` without throwing errors
3. **Given** a component accessing Hypernative hooks while loading, **When** the developer calls `feature.useIsHypernativeGuard()`, **Then** the proxy stub returns `{}` allowing safe destructuring

---

### User Story 2 - Feature Flag Controls Hypernative Loading (Priority: P1)

The Hypernative feature should only load its code bundle when the feature flag is enabled for the current chain. When disabled, the feature code is never fetched, keeping the main bundle size optimal.

**Why this priority**: Bundle optimization is a key architectural goal - disabled features should not contribute to bundle size.

**Independent Test**: Can be tested by mocking the feature flag to disabled and verifying no network request is made for the Hypernative chunk.

**Acceptance Scenarios**:

1. **Given** a chain where Hypernative feature flag is disabled, **When** `useLoadFeature(HypernativeFeature)` is called, **Then** `feature.$isDisabled` returns `true` and no lazy import occurs
2. **Given** a chain where Hypernative feature flag is enabled, **When** `useLoadFeature(HypernativeFeature)` is called, **Then** the feature code loads lazily and `feature.$isReady` becomes `true` after loading
3. **Given** the feature is loading, **When** checking meta properties, **Then** `feature.$isLoading` is `true` until the chunk loads

---

### User Story 3 - Hypernative Redux Store Integration Works After Migration (Priority: P1)

The Hypernative feature's Redux slices (hnStateSlice, calendlySlice, cookieStorage) continue to function correctly after migration, maintaining per-Safe state persistence and OAuth token management.

**Why this priority**: State management is critical for the feature's core functionality - banner dismissal tracking, form completion state, and authentication must not regress.

**Independent Test**: Can be tested by dispatching actions to the Hypernative slices and verifying state changes persist correctly across component renders and page navigations.

**Acceptance Scenarios**:

1. **Given** a user dismisses the Hypernative banner, **When** the page reloads, **Then** the banner remains dismissed (state persisted via Redux)
2. **Given** a user completes the signup form, **When** navigating away and back, **Then** the form completion state is retained
3. **Given** a user authenticates with Hypernative OAuth, **When** the token is stored, **Then** subsequent API calls use the stored token correctly

---

### User Story 4 - Existing Hypernative Consumer Components Work After Migration (Priority: P2)

Components currently importing from Hypernative internal folders (e.g., dashboard, transaction queue, settings pages) continue to function after being updated to use the new pattern.

**Why this priority**: Ensures backward compatibility and smooth transition for all existing integration points.

**Independent Test**: Can be tested by rendering each consumer component and verifying the Hypernative functionality appears and behaves identically to pre-migration.

**Acceptance Scenarios**:

1. **Given** the dashboard page that shows HnDashboardBanner, **When** rendered after migration, **Then** the banner displays with identical styling and behavior
2. **Given** the transaction queue showing HnQueueAssessment, **When** viewing a pending transaction, **Then** threat assessments display correctly with proper authentication flow
3. **Given** the settings page with HnActivatedSettingsBanner, **When** the Hypernative guard is active, **Then** the appropriate banner renders

---

### User Story 5 - TypeScript Provides Full Type Safety and IDE Navigation (Priority: P2)

Developers get complete TypeScript type inference when using the migrated Hypernative feature, with IDE navigation (Cmd+click) working from feature access to implementation.

**Why this priority**: Developer experience is important for maintainability and catching errors at compile time.

**Independent Test**: Can be verified by checking that TypeScript reports no errors, autocomplete works for all feature exports, and Cmd+click navigates to source files.

**Acceptance Scenarios**:

1. **Given** a developer accessing `feature.useIsHypernativeGuard`, **When** they hover over it in their IDE, **Then** they see the correct return type and can Cmd+click to the source
2. **Given** a developer passing wrong props to `feature.HnBanner`, **When** TypeScript checks the code, **Then** it reports a type error with the expected props

---

### Edge Cases

- What happens when Hypernative OAuth popup is blocked by the browser? The existing popup-first with fallback behavior must be preserved.
- How does the system handle concurrent calls to `useLoadFeature(HypernativeFeature)` from multiple components? The module-level cache ensures single loading.
- What happens when the feature loads but the guard check RPC call fails? Error states must propagate correctly through the proxy system.
- How does the migration handle the QueueAssessmentContext provider pattern? Context providers remain internal, accessed via hooks exposed through the contract.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST export a `HypernativeFeature` handle from `@/features/hypernative/index.ts` that works with `useLoadFeature()`
- **FR-002**: System MUST create a `contract.ts` file defining `HypernativeContract` interface with flat structure using `typeof` pattern for IDE navigation
- **FR-003**: System MUST create a `feature.ts` file with direct imports (not `lazy()`) exporting all public components, hooks, and services in a flat structure
- **FR-004**: System MUST use naming conventions for proxy stub behavior: `useSomething` for hooks (stub returns `{}`), `PascalCase` for components (stub renders `null`), `camelCase` for services (undefined when not ready)
- **FR-005**: System MUST preserve all existing Redux slices (`hnStateSlice`, `calendlySlice`) and their selectors accessible via the store barrel export
- **FR-006**: System MUST update all consumer components atomically (in the same PR) to import from feature barrel and use `useLoadFeature()` pattern with flat access - no backward compatibility re-exports
- **FR-007**: System MUST ensure the Hypernative feature chunk loads lazily only when the feature flag is enabled
- **FR-008**: System MUST preserve the OAuth authentication flow (PKCE, popup-first with tab fallback)
- **FR-009**: System MUST preserve the guard detection service with its bytecode-based verification
- **FR-010**: System MUST maintain all existing analytics event tracking
- **FR-011**: System MUST organize internal code in `components/`, `hooks/`, `services/`, `store/` folders with ESLint blocking external direct imports

### Public API Definition

The following exports should be exposed through the `HypernativeContract`:

**Components** (PascalCase - stub renders `null`):

- `HnBanner` - Main promotional banner with variants
- `HnBannerWithDismissal` - Banner with dismissal tracking
- `HnDashboardBanner` - Dashboard-specific promotional card
- `HnPendingBanner` - Post-form completion status banner
- `HnMiniTxBanner` - Compact transaction-related banner
- `HnSignupFlow` - Multi-step signup modal
- `HnSecurityReportBtn` - Button linking to security reports
- `HnQueueAssessment` - Threat assessment display for transaction queue
- `HnQueueAssessmentBanner` - Banner wrapper for queue context
- `HnActivatedSettingsBanner` - Settings page banner
- `HnLoginCard` - OAuth login integration card
- `HnFeature` - Conditional rendering wrapper
- `HypernativeLogo` - SVG logo component
- `HypernativeTooltip` - Styled tooltip

**HOC Wrappers** (PascalCase functions):

- `withHnFeature` - Feature flag guard HOC
- `withHnBannerConditions` - Banner visibility HOC
- `withHnSignupFlow` - Signup flow wrapper HOC

**Hooks** (useSomething - stub returns `{}`):

- `useIsHypernativeGuard` - Check if Safe has HypernativeGuard installed
- `useIsHypernativeFeature` - Check if feature is enabled on current chain
- `useIsHypernativeEligible` - Determine Safe eligibility
- `useBannerStorage` - Read banner dismissal/completion state
- `useBannerVisibility` - Complex banner display logic
- `useTrackBannerEligibilityOnConnect` - Analytics tracking
- `useHypernativeOAuth` - OAuth 2.0 PKCE flow
- `useAuthToken` - Token lifecycle management
- `useQueueAssessment` - Get assessment for specific transaction
- `useQueueBatchAssessments` - Batch assessment fetching
- `useShowHypernativeAssessment` - Determine assessment UI visibility
- `useHnAssessmentSeverity` - Derive severity from results
- `useAssessmentUrl` - Build assessment report link
- `useCalendly` - Calendly widget management

**Services** (camelCase - undefined when not ready, check `$isReady`):

- `hypernativeGuardCheck` - Bytecode-based guard detection
- `buildSecurityReportUrl` - URL builder utility

### Key Entities

- **HypernativeContract**: TypeScript interface defining all public exports with flat structure
- **FeatureHandle**: Runtime object containing `name`, `useIsEnabled()`, and `load()` function
- **SafeHnState**: Per-Safe state tracking banner dismissal and form completion
- **QueueAssessmentContext**: React context providing assessment results to queue components

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All Hypernative functionality remains accessible to users with no visible regression in any UI flow
- **SC-002**: When the Hypernative feature flag is disabled, the feature's code chunk is not included in the network requests
- **SC-003**: Developers can access any public Hypernative export with full TypeScript type inference and IDE navigation
- **SC-004**: All existing unit tests pass after migration with minimal test file modifications
- **SC-005**: ESLint reports no warnings for feature architecture violations in the migrated feature
- **SC-006**: Type checking (`yarn workspace @safe-global/web type-check`) passes with no new errors
- **SC-007**: Consumer components using Hypernative render correctly when the feature is loading, disabled, or ready
- **SC-008**: The Hypernative banner visibility logic (balance threshold, owner status, targeted outreach) works identically after migration

## Clarifications

### Session 2026-01-27

- Q: Where should Hypernative Redux slices live after migration? → A: Move slices under `features/hypernative/store/` (follows v2 pattern)
- Q: How should consumer components be updated? → A: Atomic update - all consumers updated in same PR (no backward compatibility layer)

## Assumptions

- The existing Hypernative feature flag (`FEATURES.HYPERNATIVE` or similar) exists in the chain configuration
- The `__core__` feature infrastructure (`useLoadFeature`, `createFeatureHandle`, proxy stubs) is already implemented
- Redux slices (`hnStateSlice`, `calendlySlice`) will be moved to `features/hypernative/store/` following the v2 pattern
- All current Hypernative consumers are within the web app (`apps/web/src/`)
- The QueueAssessmentContext can remain an internal implementation detail, with its functionality exposed through hooks
