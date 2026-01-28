import { useSpendingLimits } from '../../hooks/useSpendingLimits'
import { useAppSelector } from '@/store'
import { selectShouldLoadSpendingLimits } from '../../store/spendingLimitsSlice'

/**
 * Global component that performs the actual spending limits data fetch.
 * Renders null - only used for its side effect of loading data.
 *
 * This component should be rendered once globally (e.g., in PageLayout).
 * It watches for the loading trigger (set by useTriggerSpendingLimitsLoad)
 * and performs the fetch when triggered.
 *
 * This pattern keeps the heavy loading logic lazy-loaded while allowing
 * lightweight hooks to trigger loading from anywhere in the app.
 */
const SpendingLimitsLoader = () => {
  const shouldLoad = useAppSelector(selectShouldLoadSpendingLimits)

  // This calls the heavy hook only when loading is triggered
  // The hook handles all the actual fetching logic
  useSpendingLimits(shouldLoad)

  return null
}

export default SpendingLimitsLoader
