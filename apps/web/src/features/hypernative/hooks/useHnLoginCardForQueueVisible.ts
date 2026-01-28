import { useIsHypernativeEligible } from './useIsHypernativeEligible'
import { useIsHypernativeQueueScanEnabled } from './useIsHypernativeQueueScanEnabled'

/**
 * Component-specific visibility guard for HnLoginCard on the queue page.
 *
 * Encapsulates ALL visibility logic for the login card:
 * - HYPERNATIVE_QUEUE_SCAN feature flag enabled
 * - Safe has Hypernative guard installed OR is in allowlist
 *
 * @returns `true` to render, `false` to hide, `undefined` while loading
 */
export const useHnLoginCardForQueueVisible = (): boolean | undefined => {
  const isQueueScanEnabled = useIsHypernativeQueueScanEnabled()
  const { isHypernativeEligible, loading } = useIsHypernativeEligible()

  // Feature flag disabled
  if (isQueueScanEnabled === false) return false

  // Still loading
  if (isQueueScanEnabled === undefined || loading) return undefined

  return isHypernativeEligible
}
