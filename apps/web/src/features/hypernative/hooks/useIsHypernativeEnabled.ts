import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'

/**
 * Hook to determine if Hypernative features should be enabled.
 * Checks if the HYPERNATIVE feature is enabled on the current chain.
 *
 * @returns true if enabled, false if disabled, undefined if loading
 */
export const useIsHypernativeEnabled = (): boolean | undefined => {
  return useHasFeature(FEATURES.HYPERNATIVE)
}
