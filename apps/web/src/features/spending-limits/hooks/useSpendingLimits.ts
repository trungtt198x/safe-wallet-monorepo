import { useEffect, useMemo } from 'react'
import useAsync from '@safe-global/utils/hooks/useAsync'
import useSafeInfo from '@/hooks/useSafeInfo'
import { Errors, logError } from '@/services/exceptions'
import type { SpendingLimitState } from '../types'
import useChainId from '@/hooks/useChainId'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import useBalances from '@/hooks/useBalances'
import { loadSpendingLimits } from '../services/spendingLimitLoader'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  selectSpendingLimits,
  selectSpendingLimitsLoading,
  selectSpendingLimitsLoaded,
  spendingLimitSlice,
} from '../store/spendingLimitsSlice'

/**
 * Hook for loading spending limits data.
 * Data is loaded once on app start via SpendingLimitsLoader component.
 * This hook reads from the store and handles the initial fetch.
 */
export const useSpendingLimits = () => {
  const dispatch = useAppDispatch()
  const spendingLimits = useAppSelector(selectSpendingLimits)
  const storeLoading = useAppSelector(selectSpendingLimitsLoading)
  const storeLoaded = useAppSelector(selectSpendingLimitsLoaded)
  const { safeAddress, safe, safeLoaded } = useSafeInfo()
  const chainId = useChainId()
  const provider = useWeb3ReadOnly()
  const { balances } = useBalances()

  const tokenInfoFromBalances = useMemo(
    () => balances?.items.map(({ tokenInfo }) => tokenInfo) ?? [],
    [balances?.items],
  )

  // Skip fetch if already loaded (prevents duplicate requests)
  const shouldFetch = !storeLoaded && !storeLoading

  const [data, error, dataLoading] = useAsync<SpendingLimitState[] | undefined>(
    () => {
      // Skip fetch if not needed or missing required data
      if (!shouldFetch || !provider || !safeLoaded || !safe.modules || tokenInfoFromBalances.length === 0) return

      return loadSpendingLimits(provider, safe.modules, safeAddress, chainId, tokenInfoFromBalances)
    },
    // Need to check length of modules array to prevent new request every time Safe info polls
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      shouldFetch,
      provider,
      safeLoaded,
      safe.modules?.length,
      tokenInfoFromBalances,
      safeAddress,
      chainId,
      safe.txHistoryTag,
    ],
    false,
  )

  useEffect(() => {
    if (error) {
      logError(Errors._609, error.message)
    }
  }, [error])

  // Update the store when fetch completes
  useEffect(() => {
    if (data !== undefined || error) {
      dispatch(
        spendingLimitSlice.actions.set({
          data: data ?? [],
          error: error?.message,
          loading: false,
          loaded: true,
        }),
      )
    }
  }, [dispatch, data, error])

  return {
    spendingLimits,
    loading: storeLoading || dataLoading,
    error,
  }
}
