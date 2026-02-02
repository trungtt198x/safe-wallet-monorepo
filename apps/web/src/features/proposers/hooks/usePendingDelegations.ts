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

    // Build set of current delegate addresses to detect already-submitted delegations
    const currentDelegates = new Set(proposers.data?.results.map((p) => p.delegate.toLowerCase()) ?? [])

    // First pass: collect all valid delegation messages
    const allDelegations: Array<PendingDelegation & { _timestamp: number }> = []

    for (const item of messagesPage.results) {
      if (item.type !== 'MESSAGE') continue
      const message = item as MessageItem

      const origin = parseDelegationOrigin(message.origin)
      if (!origin || origin.nestedSafe.toLowerCase() !== safeAddress.toLowerCase()) {
        continue
      }

      // Extract TOTP from the delegate TypedData message
      const typedDataMessage = typeof message.message === 'object' ? message.message : null
      const rawTotp = typedDataMessage?.message?.totp
      const messageTotp = rawTotp !== undefined ? Number(rawTotp) : undefined
      if (messageTotp === undefined || isNaN(messageTotp)) continue

      const status = deriveDelegationStatus(message.confirmationsSubmitted, message.confirmationsRequired, messageTotp)

      // Filter out expired delegations
      if (status === 'expired') continue

      allDelegations.push({
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
      })
    }

    // Second pass: keep only the most recent message per delegate (by creationTimestamp)
    // This prevents old messages from reappearing after add/remove cycles
    const latestByDelegate = new Map<string, PendingDelegation & { _timestamp: number }>()
    for (const delegation of allDelegations) {
      const key = delegation.delegateAddress.toLowerCase()
      const existing = latestByDelegate.get(key)
      if (!existing || delegation._timestamp > existing._timestamp) {
        latestByDelegate.set(key, delegation)
      }
    }

    // Third pass: filter out delegations that have already been acted upon
    const result: PendingDelegation[] = []
    for (const delegation of latestByDelegate.values()) {
      const delegateLower = delegation.delegateAddress.toLowerCase()
      // Skip "add" if delegate already exists, skip "remove" if delegate doesn't exist
      if (delegation.action === 'add' && currentDelegates.has(delegateLower)) continue
      if (delegation.action === 'remove' && !currentDelegates.has(delegateLower)) continue

      // Remove internal _timestamp field
      const { _timestamp, ...cleanDelegation } = delegation
      result.push(cleanDelegation)
    }

    return result
  }, [messagesPage, parentSafeAddress, safeAddress, proposers.data])

  return { pendingDelegations, isLoading, refetch }
}
