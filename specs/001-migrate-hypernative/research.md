# Research: Migrate Hypernative to Feature Architecture

**Branch**: `001-migrate-hypernative` | **Date**: 2026-01-26

## Overview

This research documents decisions and best practices for migrating the hypernative feature to comply with the feature architecture pattern. All technical context was clear from the specification; no NEEDS CLARIFICATION items required external research.

## Decisions

### 1. Barrel File Export Strategy

**Decision**: Use named exports for all externally-consumed items; lazy-load components via `next/dynamic`

**Rationale**:

- Named exports enable tree-shaking and clear API documentation
- `next/dynamic` with `ssr: false` ensures code-splitting for components
- Types are zero-runtime-cost and should be exported directly

**Alternatives Considered**:

- Default export for primary component: Rejected because the feature has multiple primary entry points (banners, tooltips, hooks)
- Re-export everything from sub-barrels: Rejected because it defeats tree-shaking and can include heavy internal modules

### 2. OAuth Callback Page Refactoring

**Decision**: Extract OAuth logic to `OAuthCallbackHandler` component inside feature directory; page becomes thin wrapper

**Rationale**:

- Keeps all feature logic within `src/features/hypernative/`
- Page file only handles Next.js routing concerns
- Avoids ESLint exceptions that could be misused
- Follows established pattern of feature-contained logic

**Alternatives Considered**:

- Export OAuth utilities from barrel: Rejected because `readPkce`, `clearPkce`, `HYPERNATIVE_OAUTH_CONFIG` are internal implementation details
- ESLint exception for pages/hypernative/: Rejected because it creates a maintenance burden and precedent for bypassing rules

### 3. Feature Flag Hook Naming

**Decision**: Rename `useIsHypernativeFeature` to `useIsHypernativeEnabled` with full migration

**Rationale**:

- Follows the documented convention in feature-architecture.md
- Improves discoverability and consistency across features
- Full rename (vs. alias) keeps codebase clean and avoids confusion

**Alternatives Considered**:

- Keep both names with alias: Rejected because it creates redundancy and potential confusion
- Only export new name from barrel: Rejected because internal code should also use consistent naming

### 4. ESLint Configuration Approach

**Decision**: Add rules to existing `eslint.config.mjs` using `no-restricted-imports` and `eslint-plugin-boundaries`

**Rationale**:

- `no-restricted-imports` is built-in and widely supported
- `eslint-plugin-boundaries` provides sophisticated element-type rules for internal imports
- Rules generate warnings (not errors) to allow gradual adoption

**Alternatives Considered**:

- Custom ESLint plugin: Rejected as overkill for standard import restriction patterns
- Manual code review only: Rejected because automation prevents regression

## Best Practices Applied

### Next.js Dynamic Imports for Lazy Loading

```typescript
// Pattern from feature-architecture.md
import dynamic from 'next/dynamic'

const HnBanner = dynamic(() => import('./components/HnBanner'), { ssr: false })
export { HnBanner }
```

**Source**: [Next.js Dynamic Imports Documentation](https://nextjs.org/docs/advanced-features/dynamic-import)

### Barrel File Anti-Patterns to Avoid

Per feature-architecture.md section "What NOT to Export":

- Do not export items only used internally
- Do not export heavy service instances (e.g., OAuth config objects with credentials)
- Do not export internal contexts that are only consumed within the feature

### Import Migration Strategy

1. Create barrel file first with all necessary exports
2. Update external consumers file-by-file
3. Run type-check after each major file group
4. Update tests in parallel with source files
5. Run full test suite before committing

## Dependencies Verified

| Dependency                       | Version | Purpose                          | Status              |
| -------------------------------- | ------- | -------------------------------- | ------------------- |
| next                             | 14.x    | Dynamic imports for lazy loading | Already installed   |
| eslint-plugin-boundaries         | ^4.x    | Internal import enforcement      | Verify installation |
| @typescript-eslint/eslint-plugin | ^6.x    | TypeScript-aware linting         | Already installed   |

## Risk Assessment

| Risk                             | Likelihood | Impact | Mitigation                                     |
| -------------------------------- | ---------- | ------ | ---------------------------------------------- |
| Breaking existing imports        | Low        | High   | Type-check after each file; CI validation      |
| Bundle size regression           | Low        | Medium | Compare bundle stats before/after              |
| Test failures from mock paths    | Medium     | Low    | Update mocks in same PR as source changes      |
| Circular dependency introduction | Low        | High   | ESLint rules + careful barrel export selection |

## Conclusion

All research items are resolved. The migration approach is well-documented in the feature-architecture.md guide, and the clarification session resolved the two ambiguous areas (OAuth callback handling and hook naming strategy). Proceed to Phase 1 design artifacts.
