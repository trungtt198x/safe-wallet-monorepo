import { useEffect, useMemo, useCallback } from 'react'
import useAsync from '@safe-global/utils/hooks/useAsync'
import useSafeInfo from '@/hooks/useSafeInfo'
import { Errors, logError } from '@/services/exceptions'
import type { SpendingLimitState } from '../types'
import useChainId from '@/hooks/useChainId'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import useBalances from '@/hooks/useBalances'
import { loadSpendingLimits } from '../services/spendingLimitLoader'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectSpendingLimits, selectSpendingLimitsLoading, spendingLimitSlice } from '../store/spendingLimitsSlice'

/**
 * On-demand hook for loading spending limits.
 * Only fetches data when the hook is used, rather than on every page load.
 *
 * Use this hook in:
 * - Settings > Spending Limits page
 * - Token Transfer flow (when user might use spending limit)
 * - Components that need spending limit data
 */
export const useSpendingLimits = () => {
  const dispatch = useAppDispatch()
  const spendingLimits = useAppSelector(selectSpendingLimits)
  const loading = useAppSelector(selectSpendingLimitsLoading)
  const { safeAddress, safe, safeLoaded } = useSafeInfo()
  const chainId = useChainId()
  const provider = useWeb3ReadOnly()
  const { balances } = useBalances()

  const tokenInfoFromBalances = useMemo(
    () => balances?.items.map(({ tokenInfo }) => tokenInfo) ?? [],
    [balances?.items],
  )

  const [data, error, dataLoading] = useAsync<SpendingLimitState[] | undefined>(
    () => {
      if (!provider || !safeLoaded || !safe.modules || tokenInfoFromBalances.length === 0) return

      return loadSpendingLimits(provider, safe.modules, safeAddress, chainId, tokenInfoFromBalances)
    },
    // Need to check length of modules array to prevent new request every time Safe info polls
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider, safeLoaded, safe.modules?.length, tokenInfoFromBalances, safeAddress, chainId, safe.txHistoryTag],
    false,
  )

  useEffect(() => {
    if (error) {
      logError(Errors._609, error.message)
    }
  }, [error])

  // Update the store when data changes
  useEffect(() => {
    dispatch(
      spendingLimitSlice.actions.set({
        data,
        error: data ? undefined : error?.message,
        loading: dataLoading && !data,
        loaded: data !== undefined,
      }),
    )
  }, [dispatch, data, error, dataLoading])

  const refetch = useCallback(() => {
    // The useAsync hook will refetch when dependencies change
    // We can trigger a refetch by dispatching a loading state
    dispatch(spendingLimitSlice.actions.set({ data: spendingLimits, loading: true, loaded: true }))
  }, [dispatch, spendingLimits])

  return {
    spendingLimits,
    loading: loading || dataLoading,
    error,
    refetch,
  }
}
