# Feature Specification: Enable Rspack for Production Builds

**Feature Branch**: `001-rspack-prod-build`
**Created**: 2026-02-03
**Status**: Draft
**Input**: User description: "I want to enable rspack for prod builds. The goal is to save at least >2min build time. Rspack is already in this codebase but not enabled for Production build. We want the backup build with the old build script similar to dev script. I want to document the build time difference."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Legal Content Renders Correctly (Priority: P1)

As a user or compliance officer, I need legal content (Terms, Cookie Policy, Privacy Policy) to render correctly in production builds so that the application remains compliant and users can access required disclosures.

**Why this priority**: Legal content is critical for regulatory compliance. The MDX files use GFM tables (cookie policy) and heading anchors (TOC navigation) that require specific remark plugins currently disabled for rspack.

**Independent Test**: Build with rspack and verify /terms, /cookie, and /privacy pages render correctly with working tables and TOC links.

**Acceptance Scenarios**:

1. **Given** a production build using rspack, **When** a user visits /cookie, **Then** all compliance tables render as proper HTML tables
2. **Given** a production build using rspack, **When** a user clicks a TOC link on /terms, **Then** the page navigates to the correct section
3. **Given** a production build using rspack, **When** comparing legal pages to webpack build, **Then** content is visually identical

---

### User Story 2 - Developer Runs Optimized Production Build (Priority: P1)

As a developer, I want production builds to complete significantly faster so that I can iterate more quickly during deployment cycles and reduce CI/CD pipeline duration.

**Why this priority**: This is the core value proposition of the feature. Faster builds directly impact developer productivity and CI/CD costs.

**Independent Test**: Can be fully tested by running the production build command and measuring completion time. Delivers immediate value through reduced wait times.

**Acceptance Scenarios**:

1. **Given** a developer initiates a production build, **When** the build completes, **Then** the build time is at least 2 minutes faster than the previous build method
2. **Given** a developer runs the production build, **When** the build completes successfully, **Then** all application functionality works identically to builds made with the previous method
3. **Given** a production build is triggered in CI/CD, **When** the build completes, **Then** the resulting artifacts are deployable and functionally equivalent

---

### User Story 3 - Developer Falls Back to Legacy Build (Priority: P2)

As a developer, I want access to the original build method so that I can fall back to a known-working build process if issues arise with the optimized build.

**Why this priority**: Provides risk mitigation and ensures business continuity. Critical for safe rollout of the new build process.

**Independent Test**: Can be fully tested by running the fallback build command and verifying it produces working artifacts using the original build method.

**Acceptance Scenarios**:

1. **Given** a developer needs to use the original build method, **When** they run the fallback build command, **Then** the build completes using the previous build tooling
2. **Given** the optimized build encounters an issue, **When** a developer switches to the fallback build, **Then** they can still produce deployable artifacts
3. **Given** a developer runs the fallback build, **When** the build completes, **Then** the output is identical to what the original build command produced before this feature

---

### User Story 4 - Developer Reviews Build Performance Documentation (Priority: P3)

As a developer or team lead, I want documented evidence of build time improvements so that I can verify the feature delivers its promised value and make informed decisions about the build process.

**Why this priority**: Provides transparency and accountability. Enables data-driven decisions about whether to keep the optimized build as default.

**Independent Test**: Can be fully tested by reviewing the documentation and verifying it contains measurable build time comparisons.

**Acceptance Scenarios**:

1. **Given** the feature is implemented, **When** a developer reads the documentation, **Then** they find clear comparisons of build times between the old and new methods
2. **Given** a team lead needs to evaluate the feature, **When** they review the documentation, **Then** they see quantified time savings (in minutes/seconds)
3. **Given** the documentation exists, **When** a developer looks for build commands, **Then** both the optimized and fallback commands are clearly documented

---

### Edge Cases

- What happens when the optimized build fails but the fallback build succeeds? Developer should be able to use fallback without code changes
- How does the system handle builds with different environment configurations? Both build methods should support all existing environment configurations
- What happens if build artifacts differ between methods? Should be flagged as a regression that needs investigation

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST render legal content (Terms, Cookie Policy, Privacy Policy) correctly in rspack production builds
- **FR-002**: System MUST support GFM tables in MDX files for rspack builds (required for cookie.md compliance tables)
- **FR-003**: System MUST support heading anchor syntax `{#id}` in MDX files for rspack builds (required for TOC navigation)
- **FR-004**: System MUST provide a production build command that uses the faster build tooling already present in the codebase
- **FR-005**: System MUST provide a fallback build command that uses the original build method
- **FR-006**: Production builds using the optimized method MUST produce functionally equivalent output to the original method
- **FR-007**: Build commands MUST support all existing environment configurations and variables
- **FR-008**: System MUST include documentation showing measured build time comparisons
- **FR-009**: The fallback build command naming convention MUST follow the existing pattern used for development scripts
- **FR-010**: Both build methods MUST work in CI/CD environments without additional configuration

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Legal pages (/terms, /cookie, /privacy) render identically in rspack and webpack builds
- **SC-002**: All GFM tables in cookie.md display with correct formatting (2 tables, 12+ rows)
- **SC-003**: Representative sample (5+) of TOC anchor links in terms.md navigate to correct sections; visual inspection confirms no broken anchor syntax
- **SC-004**: Production build time is reduced by at least 2 minutes compared to the original build method
- **SC-005**: 100% of existing build scenarios (local development, CI/CD) work with both build methods
- **SC-006**: Zero functional regressions in the deployed application when built with either method
- **SC-007**: Documentation clearly shows before/after build time measurements with specific durations

## Assumptions

- The faster build tooling (rspack) is already installed and configured in the codebase
- The development build already uses rspack successfully, providing a proven baseline
- Build artifacts from both methods can be validated for functional equivalence through existing test suites
- The project's package manager (Yarn) supports adding multiple build scripts
- MDX compatibility can be resolved via one of two approaches:
  - **Option A (preferred)**: Enable remark plugins (`remarkGfm`, `remarkHeadingId`) for rspack in next.config.mjs
  - **Option B (fallback)**: Convert MD files to TSX if remark plugins cause issues with rspack
