import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  spendingLimitSlice,
  selectSpendingLimitsLoaded,
  selectSpendingLimitsLoading,
} from '../store/spendingLimitsSlice'

/**
 * Lightweight hook that triggers loading of spending limits data.
 * Does NOT perform the actual fetch - that's done by SpendingLimitsLoader component.
 *
 * Use this when you need spending limits data to be available (e.g., for permission checks).
 * The actual loading happens in a globally-rendered, lazy-loaded component.
 *
 * @param enabled - If true, triggers loading. Default is true.
 */
export const useTriggerSpendingLimitsLoad = (enabled = true): void => {
  const dispatch = useAppDispatch()
  const loaded = useAppSelector(selectSpendingLimitsLoaded)
  const loading = useAppSelector(selectSpendingLimitsLoading)

  useEffect(() => {
    // Only trigger if enabled and not already loaded/loading
    if (enabled && !loaded && !loading) {
      dispatch(spendingLimitSlice.actions.set({ data: [], loading: true, loaded: false }))
    }
  }, [enabled, loaded, loading, dispatch])
}
