import { useMemo } from 'react'
import { useMessagesGetMessagesBySafeV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/messages'
import type { MessageItem } from '@safe-global/store/gateway/AUTO_GENERATED/messages'
import useChainId from '@/hooks/useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'
import { useNestedSafeOwners } from '@/hooks/useNestedSafeOwners'
import useProposers from '@/hooks/useProposers'
import { isTotpValid } from '@/features/proposers/utils/totp'
import type { DelegationOrigin, PendingDelegation } from '@/features/proposers/types'

const parseDelegationOrigin = (originStr: string | null | undefined): DelegationOrigin | null => {
  if (!originStr) return null
  try {
    const parsed = JSON.parse(originStr)
    if (parsed.type === 'proposer-delegation') {
      return parsed as DelegationOrigin
    }
  } catch {
    // Not a valid delegation origin
  }
  return null
}

const deriveDelegationStatus = (
  confirmationsSubmitted: number,
  confirmationsRequired: number,
  messageTotp: number,
): 'pending' | 'ready' | 'expired' => {
  if (!isTotpValid(messageTotp)) return 'expired'
  if (confirmationsSubmitted >= confirmationsRequired) return 'ready'
  return 'pending'
}

type DelegationWithTimestamp = PendingDelegation & { _timestamp: number }

const parseMessageToDelegation = (
  message: MessageItem,
  safeAddress: string,
  parentSafeAddress: string,
): DelegationWithTimestamp | null => {
  const origin = parseDelegationOrigin(message.origin)
  if (!origin || origin.nestedSafe.toLowerCase() !== safeAddress.toLowerCase()) {
    return null
  }

  const typedDataMessage = typeof message.message === 'object' ? message.message : null
  const rawTotp = typedDataMessage?.message?.totp
  const messageTotp = rawTotp !== undefined ? Number(rawTotp) : undefined
  if (messageTotp === undefined || isNaN(messageTotp)) return null

  const status = deriveDelegationStatus(message.confirmationsSubmitted, message.confirmationsRequired, messageTotp)
  if (status === 'expired') return null

  return {
    messageHash: message.messageHash,
    action: origin.action,
    delegateAddress: origin.delegate,
    delegateLabel: origin.label,
    nestedSafeAddress: origin.nestedSafe,
    parentSafeAddress,
    totp: messageTotp,
    status,
    confirmationsSubmitted: message.confirmationsSubmitted,
    confirmationsRequired: message.confirmationsRequired,
    confirmations: message.confirmations,
    preparedSignature: message.preparedSignature ?? null,
    creationTimestamp: message.creationTimestamp,
    proposedBy: message.proposedBy,
    _timestamp: message.creationTimestamp,
  }
}

const keepLatestPerDelegate = (delegations: DelegationWithTimestamp[]): Map<string, DelegationWithTimestamp> => {
  const latestByDelegate = new Map<string, DelegationWithTimestamp>()
  for (const delegation of delegations) {
    const key = delegation.delegateAddress.toLowerCase()
    const existing = latestByDelegate.get(key)
    if (!existing || delegation._timestamp > existing._timestamp) {
      latestByDelegate.set(key, delegation)
    }
  }
  return latestByDelegate
}

const filterActedUponDelegations = (
  delegations: Map<string, DelegationWithTimestamp>,
  currentDelegates: Set<string>,
): PendingDelegation[] => {
  const result: PendingDelegation[] = []
  for (const delegation of delegations.values()) {
    const delegateLower = delegation.delegateAddress.toLowerCase()
    if (delegation.action === 'add' && currentDelegates.has(delegateLower)) continue
    if (delegation.action === 'remove' && !currentDelegates.has(delegateLower)) continue

    const { _timestamp, ...cleanDelegation } = delegation
    result.push(cleanDelegation)
  }
  return result
}

/**
 * Fetches pending delegation messages from the parent Safe and filters for the current nested Safe.
 * Returns parsed PendingDelegation objects with derived status.
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
      pollingInterval: 5000, // Poll every 5 seconds to detect new signatures
    },
  )

  const pendingDelegations = useMemo(() => {
    if (!messagesPage?.results || !parentSafeAddress) return []

    const currentDelegates = new Set(proposers.data?.results.map((p) => p.delegate.toLowerCase()) ?? [])

    const allDelegations = messagesPage.results
      .filter((item): item is MessageItem => item.type === 'MESSAGE')
      .map((message) => parseMessageToDelegation(message, safeAddress, parentSafeAddress))
      .filter((d): d is DelegationWithTimestamp => d !== null)

    const latestByDelegate = keepLatestPerDelegate(allDelegations)
    return filterActedUponDelegations(latestByDelegate, currentDelegates)
  }, [messagesPage, parentSafeAddress, safeAddress, proposers.data])

  return { pendingDelegations, isLoading, refetch }
}
