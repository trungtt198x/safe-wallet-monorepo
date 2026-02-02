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
    },
  )

  const pendingDelegations = useMemo(() => {
    if (!messagesPage?.results || !parentSafeAddress) return []

    // Build set of current delegate addresses to detect already-submitted delegations
    const currentDelegates = new Set(proposers.data?.results.map((p) => p.delegate.toLowerCase()) ?? [])

    return messagesPage.results
      .filter((item): item is MessageItem => item.type === 'MESSAGE')
      .reduce<PendingDelegation[]>((acc, message) => {
        const origin = parseDelegationOrigin(message.origin)
        if (!origin || origin.nestedSafe.toLowerCase() !== safeAddress.toLowerCase()) {
          return acc
        }

        // Skip delegations that have already been submitted:
        // - "add" delegations where the delegate already exists in the proposers list
        // - "remove" delegations where the delegate no longer exists in the proposers list
        const delegateLower = origin.delegate.toLowerCase()
        if (origin.action === 'add' && currentDelegates.has(delegateLower)) return acc
        if (origin.action === 'remove' && !currentDelegates.has(delegateLower)) return acc

        // Extract TOTP from the delegate TypedData message
        const typedDataMessage = typeof message.message === 'object' ? message.message : null
        const rawTotp = typedDataMessage?.message?.totp
        const messageTotp = rawTotp !== undefined ? Number(rawTotp) : undefined
        if (messageTotp === undefined || isNaN(messageTotp)) return acc

        const status = deriveDelegationStatus(
          message.confirmationsSubmitted,
          message.confirmationsRequired,
          messageTotp,
        )

        // Filter out expired delegations - don't display them at all
        if (status === 'expired') return acc

        acc.push({
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
        })

        return acc
      }, [])
  }, [messagesPage, parentSafeAddress, safeAddress, proposers.data])

  return { pendingDelegations, isLoading, refetch }
}
