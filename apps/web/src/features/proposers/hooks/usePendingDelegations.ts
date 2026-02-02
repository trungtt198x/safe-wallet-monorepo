import { useMemo } from 'react'
import { useMessagesGetMessagesBySafeV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/messages'
import type { MessageItem } from '@safe-global/store/gateway/AUTO_GENERATED/messages'
import useChainId from '@/hooks/useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'
import { useNestedSafeOwners } from '@/hooks/useNestedSafeOwners'
import useProposers from '@/hooks/useProposers'
import { parseMessageToDelegation, type DelegationWithTimestamp } from '@/features/proposers/utils/delegationParsing'
import { keepLatestPerDelegate, filterActedUponDelegations } from '@/features/proposers/utils/delegationFilters'
import { useDelegationPolling } from '@/features/proposers/hooks/useDelegationPolling'
import type { PendingDelegation } from '@/features/proposers/types'

/**
 * Fetches pending delegation messages from the parent Safe and filters for the current nested Safe.
 * Returns parsed PendingDelegation objects with derived status.
 * Uses exponential backoff for polling - fast when pending delegations exist, slower otherwise.
 */
export const usePendingDelegations = (): {
  pendingDelegations: PendingDelegation[]
  isLoading: boolean
  refetch: () => void
} => {
  const chainId = useChainId()
  const safeAddress = useSafeAddress()
  const nestedSafeOwners = useNestedSafeOwners()
  const parentSafeAddress = nestedSafeOwners?.[0]
  const proposers = useProposers()

  const {
    data: messagesPage,
    isLoading,
    refetch,
  } = useMessagesGetMessagesBySafeV1Query(
    {
      chainId,
      safeAddress: parentSafeAddress || '',
    },
    {
      skip: !parentSafeAddress,
      // Polling is handled by useDelegationPolling hook with exponential backoff
    },
  )

  // Extract delegate addresses with stable reference for dependency comparison
  const delegateAddresses = useMemo(
    () => proposers.data?.results.map((p) => p.delegate) ?? [],
    [proposers.data?.results],
  )

  // Create a stable key for dependency comparison
  const delegatesKey = useMemo(
    () =>
      delegateAddresses
        .map((a) => a.toLowerCase())
        .sort()
        .join(','),
    [delegateAddresses],
  )

  const pendingDelegations = useMemo(() => {
    if (!messagesPage?.results || !parentSafeAddress) return []

    // Build set of current delegates (using lowercase for consistent hashing)
    const currentDelegates = new Set(delegateAddresses.map((a) => a.toLowerCase()))

    const allDelegations = messagesPage.results
      .filter((item): item is MessageItem => item.type === 'MESSAGE')
      .map((message) => parseMessageToDelegation(message, safeAddress, parentSafeAddress))
      .filter((d): d is DelegationWithTimestamp => d !== null)

    const latestByDelegate = keepLatestPerDelegate(allDelegations)
    return filterActedUponDelegations(latestByDelegate, currentDelegates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesPage, parentSafeAddress, safeAddress, delegatesKey])

  // Use custom polling with exponential backoff
  useDelegationPolling({
    refetch,
    hasPendingDelegations: pendingDelegations.length > 0,
    isEnabled: !!parentSafeAddress,
  })

  return { pendingDelegations, isLoading, refetch }
}
