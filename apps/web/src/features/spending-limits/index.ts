import { createFeatureHandle } from '@/features/__core__'
import { FEATURES } from '@safe-global/utils/utils/chains'
import type { SpendingLimitsContract } from './contract'

export const SpendingLimitsFeature = createFeatureHandle<SpendingLimitsContract>(
  'spending-limits',
  FEATURES.SPENDING_LIMIT,
)

export type { SpendingLimitsContract } from './contract'
export type * from './types'
export { getResetTimeOptions } from './constants'

// Hooks exported directly (always loaded, not lazy)
export { useSpendingLimits } from './hooks/useSpendingLimits'
export { default as useSpendingLimit } from './hooks/useSpendingLimit'
export { default as useSpendingLimitGas } from './hooks/useSpendingLimitGas'
export {
  useIsSpendingLimitBeneficiary,
  default as useIsOnlySpendingLimitBeneficiary,
} from './hooks/useIsOnlySpendingLimitBeneficiary'

// Store exports for cross-feature access
export { spendingLimitSlice, selectSpendingLimits, selectSpendingLimitsLoading } from './store/spendingLimitsSlice'
