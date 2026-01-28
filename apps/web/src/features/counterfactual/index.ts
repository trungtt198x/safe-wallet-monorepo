/**
 * Counterfactual Feature Public API
 *
 * This barrel file exports:
 * - Guarded, lazy-loaded components (via withFeatureGuard)
 * - Types (tree-shakeable, no runtime code)
 * - Constants (no dependencies)
 * - Hooks (depend on store but not on components)
 *
 * @example
 * ```tsx
 * import { CounterfactualHooks, ActivateAccountButton } from '@/features/counterfactual'
 *
 * // No need to check feature flags - components handle it automatically
 * <CounterfactualHooks />
 * <ActivateAccountButton />
 * ```
 *
 * For services, import directly from sub-paths:
 * - Services: import from '@/features/counterfactual/services'
 */
import dynamic from 'next/dynamic'
import { withFeatureGuard } from '@/utils/withFeatureGuard'
import { useIsCounterfactualEnabled } from './hooks/useIsCounterfactualEnabled'

// =============================================================================
// Dynamic imports at module level - webpack can analyze these for code splitting
// =============================================================================

const LazyCounterfactualHooks = dynamic(() => import('./components/CounterfactualHooks'), { ssr: false })
const LazyActivateAccountButton = dynamic(() => import('./components/ActivateAccountButton'), { ssr: false })
const LazyCheckBalance = dynamic(() => import('./components/CheckBalance'), { ssr: false })
const LazyCounterfactualForm = dynamic(() => import('./components/CounterfactualForm'), { ssr: false })
const LazyCounterfactualStatusButton = dynamic(() => import('./components/CounterfactualStatusButton'), { ssr: false })
const LazyFirstTxFlow = dynamic(() => import('./components/FirstTxFlow'), { ssr: false })
const LazyPayNowPayLater = dynamic(() => import('./components/PayNowPayLater'), { ssr: false })

// =============================================================================
// Guarded, lazy-loaded component exports
// =============================================================================

/** Root-level side effects for counterfactual safe monitoring */
export const CounterfactualHooks = withFeatureGuard(LazyCounterfactualHooks, useIsCounterfactualEnabled)

/** Button to activate a counterfactual safe account */
export const ActivateAccountButton = withFeatureGuard(LazyActivateAccountButton, useIsCounterfactualEnabled)

/** Balance info alert for counterfactual safes */
export const CheckBalance = withFeatureGuard(LazyCheckBalance, useIsCounterfactualEnabled)

/** Form for executing transactions that activate a counterfactual safe */
export const CounterfactualForm = withFeatureGuard(LazyCounterfactualForm, useIsCounterfactualEnabled)

/** Status button showing counterfactual safe activation state */
export const CounterfactualStatusButton = withFeatureGuard(LazyCounterfactualStatusButton, useIsCounterfactualEnabled)

/** Modal for choosing first transaction type on a counterfactual safe */
export const FirstTxFlow = withFeatureGuard(LazyFirstTxFlow, useIsCounterfactualEnabled)

/** Pay now/pay later choice during safe creation */
export const PayNowPayLater = withFeatureGuard(LazyPayNowPayLater, useIsCounterfactualEnabled)

// =============================================================================
// Types - safe, tree-shakeable
// =============================================================================

export type {
  UndeployedSafe,
  UndeployedSafesState,
  UndeployedSafeStatus,
  UndeployedSafeProps,
  ReplayedSafeProps,
  PredictedSafeProps,
  PayMethod,
} from './types'

export { PendingSafeStatus } from './types'

// =============================================================================
// Constants - safe, no dependencies
// =============================================================================

export { CF_TX_GROUP_KEY } from './constants'

// =============================================================================
// Hooks - only export hooks that are used externally
// =============================================================================

export { useIsCounterfactualSafe, useCounterfactualBalances, safeCreationPendingStatuses } from './hooks'

// =============================================================================
// NOTE: Services are NOT exported from this barrel to prevent circular
// dependencies. Import them directly from their sub-path:
//
// Services: import { ... } from '@/features/counterfactual/services'
// =============================================================================
