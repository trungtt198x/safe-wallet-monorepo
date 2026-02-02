import { useCallback, useEffect, useRef } from 'react'
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
export const useDelegationPolling = ({ refetch, hasPendingDelegations, isEnabled }: UseDelegationPollingParams) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentIntervalMs = useRef(DELEGATION_POLLING_INTERVAL_MS)

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const scheduleNextPoll = useCallback(() => {
    clearCurrentInterval()

    if (!isEnabled) return

    intervalRef.current = setInterval(() => {
      refetch()

      // After polling, calculate next interval
      if (hasPendingDelegations) {
        // Reset to fast polling when there are pending delegations
        currentIntervalMs.current = DELEGATION_POLLING_INTERVAL_MS
      } else {
        // Apply exponential backoff when no pending delegations
        currentIntervalMs.current = Math.min(currentIntervalMs.current * BACKOFF_MULTIPLIER, MAX_POLLING_INTERVAL_MS)
      }

      // Reschedule with the new interval
      scheduleNextPoll()
    }, currentIntervalMs.current)
  }, [clearCurrentInterval, isEnabled, refetch, hasPendingDelegations])

  // Reset to fast polling when pending delegations appear
  useEffect(() => {
    if (hasPendingDelegations && currentIntervalMs.current !== DELEGATION_POLLING_INTERVAL_MS) {
      currentIntervalMs.current = DELEGATION_POLLING_INTERVAL_MS
      scheduleNextPoll()
    }
  }, [hasPendingDelegations, scheduleNextPoll])

  // Start/stop polling based on isEnabled
  useEffect(() => {
    if (isEnabled) {
      scheduleNextPoll()
    } else {
      clearCurrentInterval()
    }

    return clearCurrentInterval
  }, [isEnabled, scheduleNextPoll, clearCurrentInterval])

  // Reset interval when component unmounts
  useEffect(() => {
    return () => {
      currentIntervalMs.current = DELEGATION_POLLING_INTERVAL_MS
    }
  }, [])

  return {
    currentInterval: currentIntervalMs.current,
    resetToFastPolling: useCallback(() => {
      currentIntervalMs.current = DELEGATION_POLLING_INTERVAL_MS
      scheduleNextPoll()
    }, [scheduleNextPoll]),
  }
}
