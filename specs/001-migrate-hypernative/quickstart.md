# Quickstart: Migrate Hypernative to Feature Architecture

**Branch**: `001-migrate-hypernative` | **Date**: 2026-01-26

## Prerequisites

- Node.js 18+ and Yarn 4 (via corepack)
- Repository cloned and dependencies installed: `yarn install`
- On feature branch: `git checkout 001-migrate-hypernative`

## Quick Verification Commands

```bash
# Verify you're on the correct branch
git branch --show-current

# Run type-check to ensure codebase compiles
yarn workspace @safe-global/web type-check

# Run linter
yarn workspace @safe-global/web lint

# Run tests
yarn workspace @safe-global/web test

# Check for unused exports (after migration)
yarn workspace @safe-global/web knip:exports
```

## Migration Steps Overview

### Step 1: Create Barrel File

Create `apps/web/src/features/hypernative/index.ts`:

```typescript
import dynamic from 'next/dynamic'

// Feature flag hook (renamed)
export { useIsHypernativeFeature as useIsHypernativeEnabled } from './hooks/useIsHypernativeFeature'

// Other hooks
export { useIsHypernativeGuard } from './hooks/useIsHypernativeGuard'
export type { HypernativeGuardCheckResult } from './hooks/useIsHypernativeGuard'
// ... additional exports

// Lazy-loaded components
export const HnDashboardBannerWithNoBalanceCheck = dynamic(
  () => import('./components/HnDashboardBanner').then((mod) => ({ default: mod.HnDashboardBannerWithNoBalanceCheck })),
  { ssr: false },
)
// ... additional lazy-loaded components
```

### Step 2: Rename Feature Flag Hook

Rename `useIsHypernativeFeature.ts` to `useIsHypernativeEnabled.ts` and update the function name:

```bash
# In apps/web/src/features/hypernative/hooks/
mv useIsHypernativeFeature.ts useIsHypernativeEnabled.ts
```

Update the file content and all internal references.

### Step 3: Create OAuth Callback Handler Component

Create `apps/web/src/features/hypernative/components/OAuthCallbackHandler/index.tsx`:

Move the OAuth logic from `src/pages/hypernative/oauth-callback.tsx` into this component.

### Step 4: Update External Imports

For each external consumer file, update imports from:

```typescript
// Before
import { useIsHypernativeGuard } from '@/features/hypernative/hooks'
import { HnMiniTxBanner } from '@/features/hypernative/components/HnMiniTxBanner'
```

To:

```typescript
// After
import { useIsHypernativeGuard, HnMiniTxBanner } from '@/features/hypernative'
```

### Step 5: Update Test Mocks

For test files that mock hypernative modules:

```typescript
// Before
jest.mock('@/features/hypernative/hooks/useIsHypernativeFeature')

// After
jest.mock('@/features/hypernative', () => ({
  useIsHypernativeEnabled: jest.fn(),
}))
```

### Step 6: Configure ESLint Rules

Add to `apps/web/eslint.config.mjs`:

```javascript
// no-restricted-imports for external consumers
{
  rules: {
    'no-restricted-imports': ['warn', {
      patterns: [{
        group: [
          '@/features/hypernative/components/*',
          '@/features/hypernative/hooks/*',
          '@/features/hypernative/services/*',
          '@/features/hypernative/store/*',
          '@/features/hypernative/config/*',
        ],
        message: 'Import from @/features/hypernative barrel only.',
      }],
    }],
  },
}
```

## Validation Checklist

After completing migration:

- [ ] `yarn workspace @safe-global/web type-check` passes
- [ ] `yarn workspace @safe-global/web lint` passes (no import boundary warnings)
- [ ] `yarn workspace @safe-global/web test` passes
- [ ] `yarn workspace @safe-global/web knip:exports` shows no unused barrel exports
- [ ] Application runs and hypernative features work (manual verification)
- [ ] Bundle size has not increased (check build output)

## Common Issues

### Circular Dependencies

If you encounter "cannot access before initialization" errors:

1. Check for imports from the barrel file inside the feature
2. Use relative imports for all intra-feature dependencies

### Type Errors After Hook Rename

If TypeScript complains about missing `useIsHypernativeFeature`:

1. Ensure all usages are updated to `useIsHypernativeEnabled`
2. Check test mocks for old hook name

### Component Not Found

If a component import fails after migration:

1. Verify the component is exported from the barrel
2. Check if it's lazy-loaded (need to await dynamic import)

## Next Steps

After migration is complete:

1. Run `/speckit.tasks` to generate implementation tasks
2. Create PR following the PR template
3. Request code review
