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
├── index.ts                      # Public API (required)
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

### The Barrel File (`index.ts`)

The barrel file defines what external consumers can import. **Only export what is actually needed by code outside the feature.**

```typescript
import dynamic from 'next/dynamic'

// Lazy-loaded component (code-split, loaded on demand)
const FeatureWidget = dynamic(() => import('./components/FeatureWidget'), { ssr: false })
export default FeatureWidget

// Feature flag hook
export { useIsFeatureEnabled } from './hooks/useIsFeatureEnabled'

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

Mock features at the barrel level:

```typescript
jest.mock('@/features/my-feature', () => ({
  __esModule: true,
  default: () => <div>MockedFeature</div>,
  useIsFeatureEnabled: jest.fn(),
}))
```

## Checklist

### New Feature

- [ ] Create `index.ts` with lazy-loaded default export
- [ ] Create `useIs{Feature}Enabled` hook
- [ ] Add feature flag to `FEATURES` enum
- [ ] Export only items that are used externally

### Code Review

- [ ] Barrel exports only externally-used items
- [ ] Internal code uses relative imports
- [ ] No circular dependencies (or documented workaround)
- [ ] No unused barrel exports (`yarn knip:exports`)
