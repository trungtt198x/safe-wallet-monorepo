import { useEffect, useRef } from 'react'
import {
  DELEGATION_POLLING_INTERVAL_MS,
  MAX_POLLING_INTERVAL_MS,
  BACKOFF_MULTIPLIER,
} from '@/features/proposers/constants'

type UseDelegationPollingParams = {
  refetch: () => void
  hasPendingDelegations: boolean
  isEnabled: boolean
}

/**
 * Custom polling hook with exponential backoff.
 * - Starts at DELEGATION_POLLING_INTERVAL_MS (5s)
 * - Multiplies by BACKOFF_MULTIPLIER (1.5) each poll when no pending delegations
 * - Caps at MAX_POLLING_INTERVAL_MS (60s)
 * - Resets to fast polling when pending delegations exist
 */
export function useDelegationPolling({ refetch, hasPendingDelegations, isEnabled }: UseDelegationPollingParams): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalMsRef = useRef(DELEGATION_POLLING_INTERVAL_MS)

  useEffect(() => {
    if (!isEnabled) return

    // Reset to fast polling when pending delegations exist
    if (hasPendingDelegations) {
      intervalMsRef.current = DELEGATION_POLLING_INTERVAL_MS
    }

    function scheduleNextPoll(): void {
      timeoutRef.current = setTimeout(() => {
        refetch()

        // Calculate next interval
        if (hasPendingDelegations) {
          intervalMsRef.current = DELEGATION_POLLING_INTERVAL_MS
        } else {
          intervalMsRef.current = Math.min(intervalMsRef.current * BACKOFF_MULTIPLIER, MAX_POLLING_INTERVAL_MS)
        }

        scheduleNextPoll()
      }, intervalMsRef.current)
    }

    scheduleNextPoll()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isEnabled, hasPendingDelegations, refetch])
}
