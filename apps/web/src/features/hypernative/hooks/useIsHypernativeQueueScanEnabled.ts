import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'

/**
 * Hook to determine if Hypernative queue scan features should be enabled.
 * Checks if the HYPERNATIVE_QUEUE_SCAN feature is enabled on the current chain.
 *
 * @returns true if enabled, false if disabled, undefined if loading
 */
export const useIsHypernativeQueueScanEnabled = (): boolean | undefined => {
  return useHasFeature(FEATURES.HYPERNATIVE_QUEUE_SCAN)
}
