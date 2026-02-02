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

type UsePendingDelegationsResult = {
  pendingDelegations: PendingDelegation[]
  isLoading: boolean
  refetch: () => void
}

/**
 * Fetches pending delegation messages from the parent Safe and filters for the current nested Safe.
 * Returns parsed PendingDelegation objects with derived status.
 * Uses exponential backoff for polling - fast when pending delegations exist, slower otherwise.
 */
export function usePendingDelegations(): UsePendingDelegationsResult {
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
    },
  )

  const delegateAddresses = proposers.data?.results.map((p) => p.delegate) ?? []

  const pendingDelegations = useMemo(() => {
    if (!messagesPage?.results || !parentSafeAddress) return []

    const currentDelegates = new Set(delegateAddresses.map((a) => a.toLowerCase()))

    const allDelegations = messagesPage.results
      .filter((item): item is MessageItem => item.type === 'MESSAGE')
      .map((message) => parseMessageToDelegation(message, safeAddress, parentSafeAddress))
      .filter((d): d is DelegationWithTimestamp => d !== null)

    const latestByDelegate = keepLatestPerDelegate(allDelegations)
    return filterActedUponDelegations(latestByDelegate, currentDelegates)
  }, [messagesPage, parentSafeAddress, safeAddress, delegateAddresses])

  useDelegationPolling({
    refetch,
    hasPendingDelegations: pendingDelegations.length > 0,
    isEnabled: !!parentSafeAddress,
  })

  return { pendingDelegations, isLoading, refetch }
}
