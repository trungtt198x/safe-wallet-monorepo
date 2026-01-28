# Quickstart: Hypernative Feature Architecture Migration

**Date**: 2026-01-28
**Feature**: 001-hypernative-migration

## Overview

This guide covers implementing the migration of the Hypernative feature to the new feature architecture pattern.

## Prerequisites

- Understanding of [Feature Architecture](../../../apps/web/docs/feature-architecture.md)
- Familiarity with Next.js `dynamic()` imports
- Understanding of `withFeatureGuard` utility

## Implementation Steps

### Step 1: Create Feature Flag Hooks

Rename existing hooks to match architecture naming convention:

```typescript
// hooks/useIsHypernativeEnabled.ts (rename from useIsHypernativeFeature.ts)
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'

export const useIsHypernativeEnabled = (): boolean | undefined => {
  return useHasFeature(FEATURES.HYPERNATIVE)
}
```

```typescript
// hooks/useIsHypernativeQueueScanEnabled.ts (rename from useIsHypernativeQueueScanFeature.ts)
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'

export const useIsHypernativeQueueScanEnabled = (): boolean | undefined => {
  return useHasFeature(FEATURES.HYPERNATIVE_QUEUE_SCAN)
}
```

**Note**: Return type changes from `boolean` to `boolean | undefined` to properly handle loading state.

### Step 2: Create Main Barrel File

Create `apps/web/src/features/hypernative/index.tsx` with the structure defined in [data-model.md](./data-model.md).

Key patterns:

```typescript
// Dynamic imports at module level (required by Next.js)
const LazyComponent = dynamic(() => import('./components/MyComponent'), { ssr: false })

// Wrap with feature guard
export const MyComponent = withFeatureGuard(LazyComponent, useIsHypernativeEnabled)
```

### Step 3: Update Internal Imports

Convert absolute imports within the feature to relative imports:

```typescript
// Before (in component file)
import { setBannerDismissed } from '@/features/hypernative/store/hnStateSlice'

// After
import { setBannerDismissed } from '../../store/hnStateSlice'
```

### Step 4: Update External Imports

Update all external consumers to import from the barrel:

```typescript
// Before
import { HnBannerForCarousel } from '@/features/hypernative/components/HnBanner'
import { useBannerVisibility } from '@/features/hypernative/hooks'
import { BannerType } from '@/features/hypernative/hooks/useBannerStorage'

// After
import { HnBannerForCarousel, useBannerVisibility, BannerType } from '@/features/hypernative'
```

### Step 5: Remove withHnFeature Usage

Replace `withHnFeature` with `withFeatureGuard` in component barrels:

```typescript
// Before (in component index.ts)
import { withHnFeature } from '../withHnFeature'
export default withHnFeature(HnBannerWithConditions)

// After (in main barrel index.tsx)
const LazyHnBanner = dynamic(() => import('./components/HnBanner/HnBanner'), { ssr: false })
export const HnBanner = withFeatureGuard(LazyHnBanner, useIsHypernativeEnabled)
```

### Step 6: Update Test Imports

Update test file imports to use the barrel:

```typescript
// Before
import * as useIsHypernativeFeatureHook from '@/features/hypernative/hooks/useIsHypernativeFeature'

// After
import * as hypernativeFeature from '@/features/hypernative'
// Or mock the barrel directly
jest.mock('@/features/hypernative', () => ({
  useIsHypernativeEnabled: jest.fn(),
}))
```

### Step 7: Verify ESLint Configuration

Ensure ESLint rules are configured in `eslint.config.mjs`:

```javascript
// no-restricted-imports for external boundaries
'no-restricted-imports': ['warn', {
  patterns: [{
    group: [
      '@/features/hypernative/components/*',
      '@/features/hypernative/hooks/*',
      '@/features/hypernative/services/*',
      // Note: @/features/hypernative/store is allowed for slices.ts
    ],
    message: 'Import from @/features/hypernative barrel only.',
  }],
}]
```

## Validation Checklist

- [ ] All external imports use barrel file
- [ ] All internal imports use relative paths
- [ ] Feature flag hooks return `boolean | undefined`
- [ ] All component exports use `dynamic()` + `withFeatureGuard`
- [ ] `withHnFeature` HOC is not used (replaced by withFeatureGuard)
- [ ] Type-check passes: `yarn workspace @safe-global/web type-check`
- [ ] Lint passes: `yarn workspace @safe-global/web lint`
- [ ] Tests pass: `yarn workspace @safe-global/web test`
- [ ] Storybook works: `yarn workspace @safe-global/web storybook`

## Common Issues

### Issue: Circular dependency errors

**Solution**: Ensure the barrel file doesn't import anything that imports from the barrel. Use relative imports for internal modules.

### Issue: Component not rendering

**Check**: Verify the guard hook returns `true` (not just truthy). The `withFeatureGuard` utility checks for strict `true`.

### Issue: Dynamic import loading forever

**Check**: Ensure the import path is correct and the component has a default export.

### Issue: Type errors after migration

**Check**: Ensure all type exports are included in the barrel. Types can be re-exported with `export type { }` syntax.

## File Changes Summary

| Action    | Files                                                                         |
| --------- | ----------------------------------------------------------------------------- |
| CREATE    | `index.tsx` (main barrel)                                                     |
| CREATE    | `types.ts` (consolidated types)                                               |
| RENAME    | `useIsHypernativeFeature.ts` → `useIsHypernativeEnabled.ts`                   |
| RENAME    | `useIsHypernativeQueueScanFeature.ts` → `useIsHypernativeQueueScanEnabled.ts` |
| MODIFY    | ~60 external import sites                                                     |
| MODIFY    | ~20 internal import sites (absolute → relative)                               |
| DEPRECATE | `withHnFeature` HOC                                                           |
| MODIFY    | Component barrel files (remove default exports, HOC composition)              |
