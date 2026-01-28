# Feature Architecture

This document defines the architecture pattern for domain features in the Safe{Wallet} web application.

## Overview

A **feature** is a self-contained domain module that:

- Resides in `src/features/{feature-name}/`
- Exposes a public API through a barrel file (`index.ts`)
- Is gated by a feature flag
- Is lazy-loaded for bundle optimization

## Directory Structure

```
src/features/{feature-name}/
├── index.ts                      # Public API (required, use .tsx only if JSX needed)
├── types.ts                      # Shared types
├── constants.ts                  # Constants
├── components/
│   └── {ComponentName}/
│       └── index.tsx
├── hooks/
│   ├── useIs{Feature}Enabled.ts  # Feature flag hook (required)
│   └── use{HookName}.ts
├── services/
│   └── {ServiceName}.ts
└── store/
    └── {sliceName}Slice.ts
```

## Public API Design

### The Barrel File (`index.ts` or `index.tsx`)

The barrel file defines what external consumers can import. **Only export what is actually needed by code outside the feature.**

```typescript
import dynamic from 'next/dynamic'
import { withFeatureGuard } from '@/utils/withFeatureGuard'
import { useIsFeatureEnabled } from './hooks/useIsFeatureEnabled'

// IMPORTANT: dynamic() must be at module level (Next.js requirement)
const LazyFeatureWidget = dynamic(() => import('./components/FeatureWidget'), { ssr: false })

// Guarded, lazy-loaded component (code-split, feature-gated)
export const FeatureWidget = withFeatureGuard(LazyFeatureWidget, useIsFeatureEnabled)

// NOTE: useIsFeatureEnabled is NOT exported - it's only used internally by withFeatureGuard.
// Only export the hook if external code has a legitimate need to check the feature flag.

// Types (zero runtime cost)
export type { FeatureConfig } from './types'

// Only export utilities/stores that ARE used externally
export { featureStore } from './store'
```

### What NOT to Export

Do not export items that are only used within the feature:

```typescript
// ❌ BAD: Internal-only items exported from barrel
export { InternalContext } from './components/InternalContext' // Only used inside feature
export { heavyServiceInstance } from './services/heavyService' // Only used inside feature
export { internalHelper } from './utils' // Only used inside feature
```

**Why this matters:** When you import _anything_ from a barrel, the bundler evaluates _all_ exports. If you export a heavy service that's only used internally, it ends up in the main bundle—even if external code only imports a small utility from that barrel.

**Real example:** Exporting `walletConnectInstance` from the walletconnect barrel added 600KB to the initial bundle, even though no external code imported it. The service was only used internally by components that were already lazy-loaded via `dynamic()`.

## Import Rules

### External Consumers

External code imports from the barrel only:

```typescript
// ✓ Main barrel
import Feature, { useIsFeatureEnabled } from '@/features/my-feature'

// ✓ Types
import type { FeatureConfig } from '@/features/my-feature/types'

// ✗ Internal paths are blocked by ESLint
import { InternalComponent } from '@/features/my-feature/components/InternalComponent'
```

### Internal Code

Code within a feature uses **relative imports**:

```typescript
// Inside src/features/my-feature/components/Widget.tsx

// ✓ Relative imports
import { FeatureContext } from '../FeatureContext'
import { helperFn } from '../../services/utils'

// ✗ Absolute feature paths are blocked by ESLint
import { something } from '@/features/my-feature'
```

This separation ensures:

1. Barrel exports are only consumed by external code
2. Tools like Knip can detect unused barrel exports
3. Internal refactoring doesn't affect external consumers

## Feature Flags

Every feature requires a flag hook:

```typescript
// hooks/useIsFeatureEnabled.ts
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'

export const useIsFeatureEnabled = (): boolean | undefined => {
  return useHasFeature(FEATURES.MY_FEATURE)
}
```

Return values:

- `undefined` — Loading state, render nothing
- `false` — Feature disabled, render nothing
- `true` — Feature enabled, render feature

## Guarded Exports

All component exports from feature barrels must use `withFeatureGuard`. This utility combines two concerns:

1. **Feature gating** — Component only renders when the guard hook returns `true`
2. **Layout composition** — Optional wrapper prop for layout containers

Lazy loading is handled separately via `dynamic()` at module level.

### Basic Usage

```typescript
// index.tsx
import dynamic from 'next/dynamic'
import { withFeatureGuard } from '@/utils/withFeatureGuard'
import { useIsFeatureEnabled } from './hooks/useIsFeatureEnabled'

// IMPORTANT: dynamic() must be at module level, not inside functions
// See: https://nextjs.org/docs/pages/guides/lazy-loading
const LazyFeatureWidget = dynamic(() => import('./components/FeatureWidget'), { ssr: false })

export const FeatureWidget = withFeatureGuard(LazyFeatureWidget, useIsFeatureEnabled)
```

### Consumer Benefits

Consumers no longer need to manually check feature flags:

```typescript
// Before - consumer handles feature flag check
const { isEnabled } = useIsFeatureEnabled()

{isEnabled && (
  <Box gridArea="feature" className={css.feature}>
    <FeatureWidget data={data} />
  </Box>
)}

// After - single component with composed wrapper
<FeatureWidget
  data={data}
  wrapper={(children) => (
    <Box gridArea="feature" className={css.feature}>
      {children}
    </Box>
  )}
/>
```

### The `wrapper` Prop

The `wrapper` prop allows consumers to provide layout containers that should only render when the feature is enabled:

```typescript
<FeatureWidget
  someProp="value"
  wrapper={(children) => (
    <Grid item xs={12} className={css.container}>
      {children}
    </Grid>
  )}
/>
```

When the feature is disabled, neither the component nor its wrapper renders — keeping the DOM clean.

### Dynamic Import Options

Options like `ssr` and `loading` are passed directly to `dynamic()`:

```typescript
// index.tsx
const LazyFeatureWidget = dynamic(
  () => import('./components/FeatureWidget'),
  {
    ssr: false,                    // Disable SSR (recommended for feature-gated components)
    loading: () => <Skeleton />,   // Show while loading
  }
)

export const FeatureWidget = withFeatureGuard(LazyFeatureWidget, useIsFeatureEnabled)
```

### Why `withFeatureGuard` Instead of Raw `dynamic()`?

Using `withFeatureGuard` instead of raw `dynamic()` provides:

1. **Consistent feature gating** — Can't forget to check the feature flag
2. **Cleaner consumer API** — No conditional rendering boilerplate
3. **Enforced by ESLint** — The `local-rules/require-feature-guard` rule warns when `dynamic()` is used without `withFeatureGuard` in barrel files

### When to Export the Feature Flag Hook

**Do NOT export the hook** if it's only used by `withFeatureGuard`:

```typescript
// index.tsx
import dynamic from 'next/dynamic'
import { withFeatureGuard } from '@/utils/withFeatureGuard'
import { useIsFeatureEnabled } from './hooks/useIsFeatureEnabled'

const LazyFeatureWidget = dynamic(() => import('./components/FeatureWidget'), { ssr: false })

// The hook is used internally - no need to export it
export const FeatureWidget = withFeatureGuard(LazyFeatureWidget, useIsFeatureEnabled)

// NOTE: useIsFeatureEnabled is NOT exported - consumers use FeatureWidget directly
```

**DO export the hook** only if external code needs to check the feature flag for other purposes (e.g., conditionally showing related UI, analytics, routing):

```typescript
// Only export if there's a real external use case
export { useIsFeatureEnabled } from './hooks/useIsFeatureEnabled'
```

This keeps the public API minimal and prevents consumers from bypassing the guarded component pattern.

## Cross-Feature Communication

| Need                     | Solution                         |
| ------------------------ | -------------------------------- |
| Share data               | Redux store                      |
| Share types              | Import from `@/features/x/types` |
| Use feature capabilities | Import from feature barrel       |

## Circular Dependencies

Circular dependencies occur when module A imports from module B, and module B imports from module A (directly or indirectly). They are a **code smell** indicating poor module boundaries.

### Symptoms

- Jest fails with "cannot access before initialization" errors
- Webpack warnings about circular imports
- Undefined values at runtime

### Common Causes in Features

1. **Barrel imports internal modules that import the barrel**

   ```typescript
   // index.ts exports ComponentA
   // ComponentA imports something else from index.ts
   ```

2. **Services and components with bidirectional dependencies**
   ```typescript
   // Service imports a component's types
   // Component imports the service
   ```

### Solutions

**Preferred: Restructure to eliminate the cycle**

- Move shared types to a separate `types.ts` file
- Extract shared utilities to a dedicated module
- Reconsider module boundaries

**Workaround: Sub-barrels**

If restructuring is impractical, split exports across multiple barrel files:

```
src/features/{feature-name}/
├── index.ts              # Main exports (no cycles)
├── components/
│   └── index.ts          # Component exports (breaks cycle)
├── services/
│   └── index.ts          # Service exports (breaks cycle)
```

```typescript
// External code imports from sub-barrel to avoid cycle
import { ComponentA } from '@/features/my-feature/components'
```

**Note:** Sub-barrels are a workaround, not a best practice. They add complexity and can cause the same bundling issues as the main barrel if misused. Prefer restructuring when possible.

## Automated Enforcement

The architecture is enforced by tooling, not discipline.

### ESLint: Guarded Exports

Requires proper use of `dynamic()` + `withFeatureGuard` in feature barrel files:

```javascript
// eslint.config.mjs
'local-rules/require-feature-guard': 'warn'
```

This rule catches three types of mistakes:

1. **Missing withFeatureGuard** — Using `dynamic()` without wrapping in `withFeatureGuard`
2. **Non-dynamic component** — Passing a regular import to `withFeatureGuard` (loses code splitting)
3. **Direct re-exports** — Re-exporting components directly from internal paths (bypasses both)

```typescript
// ❌ Bad: non-dynamic component passed to withFeatureGuard
import { Widget } from './components/Widget'
export const MyWidget = withFeatureGuard(Widget, useGuard) // Warning: loses code splitting

// ❌ Bad: direct re-export bypasses lazy loading
export { Widget } from './components/Widget' // Warning: bypasses both patterns

// ✅ Good: dynamic() at module level + withFeatureGuard
const LazyWidget = dynamic(() => import('./components/Widget'), { ssr: false })
export const MyWidget = withFeatureGuard(LazyWidget, useGuard)
```

### ESLint: External Import Boundaries

Blocks imports to internal feature paths:

```javascript
// eslint.config.mjs
'no-restricted-imports': ['warn', {
  patterns: [{
    group: [
      '@/features/*/components/*',
      '@/features/*/hooks/*',
      '@/features/*/services/*',
      '@/features/*/store/*',
    ],
    message: 'Import from feature barrel only.',
  }],
}]
```

### ESLint: Internal Relative Imports

Forces features to use relative imports internally (via `eslint-plugin-boundaries`):

```javascript
// eslint.config.mjs
'boundaries/element-types': ['warn', {
  rules: [{
    from: ['feature'],
    disallow: [['feature', { featureName: '${from.featureName}' }]],
    message: 'Use relative imports within a feature.',
  }],
}]
```

### Knip: Unused Export Detection

Detects barrel exports with no external consumers:

```bash
yarn knip:exports
```

Since internal code uses relative imports, any barrel export without external consumers is flagged as unused and should be removed.

## Enforcement Flow

```
Developer adds export to barrel
            │
            ▼
   Is it used externally?
            │
      ┌─────┴─────┐
      │           │
     Yes          No
      │           │
      ▼           ▼
   Correct    ESLint enforces
   export     relative imports
                   │
                   ▼
              Knip flags as
              unused export
                   │
                   ▼
              Remove from barrel
```

## Testing

Mock features at the barrel level. For guarded components, mock the component to handle the wrapper prop:

```typescript
import type { ReactNode } from 'react'

// Control the feature state in your tests
let isFeatureEnabled = false

jest.mock('@/features/my-feature', () => ({
  __esModule: true,
  FeatureWidget: function MockFeatureWidget({ wrapper }: { wrapper?: (children: ReactNode) => ReactNode }) {
    if (!isFeatureEnabled) return null
    const content = <div>MockedFeature</div>
    return wrapper ? wrapper(content) : content
  },
}))
```

## Checklist

### New Feature

- [ ] Create `index.ts` with `dynamic()` at module level and `withFeatureGuard` for component exports
- [ ] Create `useIs{Feature}Enabled` hook (used internally by `withFeatureGuard`)
- [ ] Add feature flag to `FEATURES` enum
- [ ] Export only items that are used externally (don't export the hook unless needed)

### Code Review

- [ ] Dynamic imports are at module level (not inside functions or components)
- [ ] Component exports use `withFeatureGuard` to wrap dynamic components
- [ ] Feature flag hook is NOT exported unless external code needs it
- [ ] Barrel exports only externally-used items
- [ ] Internal code uses relative imports
- [ ] No circular dependencies (or documented workaround)
- [ ] No unused barrel exports (`yarn knip:exports`)
