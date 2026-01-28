import { useIsWalletProposer } from '@/hooks/useProposers'
import { useAppSelector } from '@/store'
import useWallet from '@/hooks/wallets/useWallet'
import useIsSafeOwner from '@/hooks/useIsSafeOwner'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'
import { selectSpendingLimits } from '../store/spendingLimitsSlice'
import { useTriggerSpendingLimitsLoad } from './useTriggerSpendingLimitsLoad'

/**
 * Check if the current wallet is a spending limit beneficiary.
 * @param triggerLoading - If true, triggers on-demand loading of spending limits data.
 *                         Use this when you need accurate beneficiary status (e.g., for UI permissions).
 *                         Default is false to avoid unnecessary network requests.
 */
export const useIsSpendingLimitBeneficiary = (triggerLoading = false): boolean => {
  const isEnabled = useHasFeature(FEATURES.SPENDING_LIMIT)

  // Trigger loading via lightweight hook (actual fetch happens in SpendingLimitsLoader)
  useTriggerSpendingLimitsLoad(triggerLoading)

  // Read data from store
  const spendingLimits = useAppSelector(selectSpendingLimits)
  const wallet = useWallet()

  if (!isEnabled || spendingLimits.length === 0) {
    return false
  }

  return spendingLimits.some(({ beneficiary }) => beneficiary === wallet?.address)
}

/**
 * Check if the current wallet is ONLY a spending limit beneficiary (not an owner or proposer).
 * @param triggerLoading - If true, triggers on-demand loading of spending limits data.
 */
const useIsOnlySpendingLimitBeneficiary = (triggerLoading = false): boolean => {
  const isSpendingLimitBeneficiary = useIsSpendingLimitBeneficiary(triggerLoading)
  const isSafeOwner = useIsSafeOwner()
  const isProposer = useIsWalletProposer()
  return !isSafeOwner && !isProposer && isSpendingLimitBeneficiary
}

export default useIsOnlySpendingLimitBeneficiary
