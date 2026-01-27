# Quickstart: Hypernative Feature Migration

**Date**: 2026-01-27
**Feature**: 003-migrate-hypernative

## Overview

This guide explains how to consume the migrated Hypernative feature using the feature-architecture-v2 pattern.

## Basic Usage

### Import and Load the Feature

```typescript
import { HypernativeFeature } from '@/features/hypernative'
import { useLoadFeature } from '@/features/__core__'

function MyComponent() {
  // Always returns an object - never null
  const hn = useLoadFeature(HypernativeFeature)

  // Flat access - no nested .components. or .hooks.
  return <hn.HnBanner />
}
```

### Access Hooks

```typescript
function MyComponent() {
  const hn = useLoadFeature(HypernativeFeature)

  // Hooks are always callable - return {} when not ready
  const { hasGuard } = hn.useIsHypernativeGuard()
  const eligibility = hn.useIsHypernativeEligible()

  return <div>{hasGuard && <span>Guard Active</span>}</div>
}
```

### Check Feature State

```typescript
function MyComponent() {
  const hn = useLoadFeature(HypernativeFeature)

  // Meta properties for explicit state handling
  if (hn.$isLoading) return <Skeleton />
  if (hn.$isDisabled) return null
  if (hn.$error) return <Error error={hn.$error} />

  // $isReady means loaded AND enabled
  return <hn.HnDashboardBanner />
}
```

### Call Services

```typescript
function MyComponent() {
  const hn = useLoadFeature(HypernativeFeature)

  const handleCheck = async () => {
    // Services are undefined when not ready - MUST check $isReady
    if (hn.$isReady) {
      const hasGuard = await hn.hypernativeGuardCheck(provider, safeAddress)
      console.log('Guard status:', hasGuard)
    }
  }

  return <button onClick={handleCheck}>Check Guard</button>
}
```

## Import Types

Types can be imported directly (not through useLoadFeature):

```typescript
import type { BannerType, HypernativeAuthStatus } from '@/features/hypernative/types'

function MyComponent({ bannerType }: { bannerType: BannerType }) {
  // ...
}
```

## Migration Examples

### Before: Direct Internal Imports

```typescript
// ❌ OLD PATTERN - Direct internal imports
import { HnBanner } from '@/features/hypernative/components/HnBanner'
import { useIsHypernativeGuard } from '@/features/hypernative/hooks/useIsHypernativeGuard'
import { useBannerVisibility, BannerType } from '@/features/hypernative/hooks'

function OldComponent() {
  const { hasGuard } = useIsHypernativeGuard()
  const { shouldShow } = useBannerVisibility(BannerType.Promo)

  if (!shouldShow) return null
  return <HnBanner />
}
```

### After: Feature Handle Pattern

```typescript
// ✅ NEW PATTERN - Feature handle with useLoadFeature
import { HypernativeFeature } from '@/features/hypernative'
import { useLoadFeature } from '@/features/__core__'
import type { BannerType } from '@/features/hypernative/types'

function NewComponent() {
  const hn = useLoadFeature(HypernativeFeature)

  // Hooks always callable, return {} when not ready
  const { hasGuard } = hn.useIsHypernativeGuard()
  const { shouldShow } = hn.useBannerVisibility(BannerType.Promo)

  // Component renders null when not ready
  return <hn.HnBanner />
}
```

## Common Patterns

### Conditional Rendering Based on Guard Status

```typescript
function SafeHeader() {
  const hn = useLoadFeature(HypernativeFeature)
  const { hasGuard } = hn.useIsHypernativeGuard()

  return (
    <Header>
      {hasGuard && <hn.HypernativeTooltip />}
    </Header>
  )
}
```

### Queue Assessment Integration

```typescript
function TransactionQueue() {
  const hn = useLoadFeature(HypernativeFeature)

  // Provider wraps children with assessment context
  return (
    <hn.QueueAssessmentProvider>
      <TransactionList />
    </hn.QueueAssessmentProvider>
  )
}

function TransactionItem({ safeTxHash }) {
  const hn = useLoadFeature(HypernativeFeature)

  // Get assessment from context
  const assessment = hn.useQueueAssessment(safeTxHash)
  const showAssessment = hn.useShowHypernativeAssessment()

  if (!showAssessment) return null
  return <hn.HnQueueAssessment assessment={assessment} />
}
```

### OAuth Integration

```typescript
function HypernativeLogin() {
  const hn = useLoadFeature(HypernativeFeature)

  const {
    isAuthenticated,
    isTokenExpired,
    initiateLogin,
    logout,
  } = hn.useHypernativeOAuth()

  if (isAuthenticated && !isTokenExpired) {
    return <button onClick={logout}>Logout</button>
  }

  return <button onClick={initiateLogin}>Login to Hypernative</button>
}
```

## Testing

### Mock the Feature Module

```typescript
jest.mock('@/features/hypernative', () => ({
  HypernativeFeature: {
    name: 'hypernative',
    useIsEnabled: () => true,
    load: () =>
      Promise.resolve({
        default: {
          HnBanner: () => <div data-testid="hn-banner">Mock Banner</div>,
          useIsHypernativeGuard: () => ({ hasGuard: true }),
          useBannerVisibility: () => ({ shouldShow: true }),
        },
      }),
  },
}))

describe('MyComponent', () => {
  it('renders banner when visible', async () => {
    render(<MyComponent />)
    await waitFor(() => {
      expect(screen.getByTestId('hn-banner')).toBeInTheDocument()
    })
  })
})
```

### Test Disabled Feature

```typescript
jest.mock('@/features/hypernative', () => ({
  HypernativeFeature: {
    name: 'hypernative',
    useIsEnabled: () => false, // Feature disabled
    load: () => Promise.resolve({ default: {} }),
  },
}))

it('renders nothing when feature disabled', () => {
  render(<MyComponent />)
  // Component stub renders null
  expect(screen.queryByTestId('hn-banner')).not.toBeInTheDocument()
})
```

## Stub Behavior Reference

| Access Pattern               | Stub Behavior  | Example                                                                       |
| ---------------------------- | -------------- | ----------------------------------------------------------------------------- |
| `hn.HnBanner`                | Renders `null` | `<hn.HnBanner />` shows nothing                                               |
| `hn.useIsHypernativeGuard()` | Returns `{}`   | `const { hasGuard } = hn.useIsHypernativeGuard()` → `hasGuard` is `undefined` |
| `hn.hypernativeGuardCheck`   | Is `undefined` | Must check `hn.$isReady` before calling                                       |

## Meta Properties

| Property      | Type                 | Description                          |
| ------------- | -------------------- | ------------------------------------ |
| `$isLoading`  | `boolean`            | `true` while feature code is loading |
| `$isDisabled` | `boolean`            | `true` if feature flag is off        |
| `$isReady`    | `boolean`            | `true` when loaded AND enabled       |
| `$error`      | `Error \| undefined` | Error if loading failed              |

## ESLint Enforcement

The following imports will trigger ESLint warnings:

```typescript
// ❌ Will warn - internal folder access
import { HnBanner } from '@/features/hypernative/components/HnBanner'
import { useIsHypernativeGuard } from '@/features/hypernative/hooks/useIsHypernativeGuard'

// ✅ Allowed - barrel imports
import { HypernativeFeature } from '@/features/hypernative'
import type { BannerType } from '@/features/hypernative/types'
```

## Troubleshooting

### Component Not Rendering

1. Check `$isDisabled` - feature flag may be off for this chain
2. Check `$isLoading` - feature may still be loading
3. Check `$error` - loading may have failed

### Hook Returns Undefined Values

Normal when feature is loading/disabled. Hooks return `{}` as stub, so destructured values are `undefined`. This is safe for conditional rendering.

### Service Throws TypeError

Services are `undefined` when not ready. Always check `$isReady`:

```typescript
// ❌ Throws "hypernativeGuardCheck is not a function"
hn.hypernativeGuardCheck(provider, address)

// ✅ Safe
if (hn.$isReady) {
  hn.hypernativeGuardCheck(provider, address)
}
```
