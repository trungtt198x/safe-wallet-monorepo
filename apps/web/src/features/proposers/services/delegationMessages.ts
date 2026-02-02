import type { DelegationOrigin } from '@/features/proposers/types'
import type { TypedData, CreateMessageDto } from '@safe-global/store/gateway/AUTO_GENERATED/messages'
import { cgwApi } from '@safe-global/store/gateway/AUTO_GENERATED/messages'
import { normalizeTypedData } from '@safe-global/utils/utils/web3'
import type { AppDispatch } from '@/store'

/**
 * Builds the origin metadata JSON string for a delegation off-chain message.
 */
export const buildDelegationOrigin = (
  action: 'add' | 'remove',
  delegate: string,
  nestedSafe: string,
  label: string,
): string => {
  const origin: DelegationOrigin = {
    type: 'proposer-delegation',
    action,
    delegate,
    nestedSafe,
    label,
  }
  return JSON.stringify(origin)
}

/**
 * Parses the origin from a message to extract the delegation action.
 */
const parseOriginAction = (originStr: string | null | undefined): 'add' | 'remove' | null => {
  if (!originStr) return null
  try {
    const parsed = JSON.parse(originStr)
    if (parsed.type === 'proposer-delegation') {
      return parsed.action
    }
  } catch {
    // Not a valid delegation origin
  }
  return null
}

/**
 * Creates a new off-chain delegation message on the parent Safe.
 * This initiates the multi-sig signature collection process.
 *
 * If a message already exists for the same delegate/totp:
 * - If the action matches, confirms the existing message instead
 * - If the action differs, throws an error (can't have add + remove in same TOTP window)
 */
export const createDelegationMessage = async (
  dispatch: AppDispatch,
  chainId: string,
  parentSafeAddress: string,
  delegateTypedData: TypedData,
  signature: string,
  origin: string,
): Promise<void> => {
  const normalizedMessage = normalizeTypedData(delegateTypedData)
  const requestedAction = parseOriginAction(origin)

  const createMessageDto: CreateMessageDto = {
    message: normalizedMessage,
    signature,
    safeAppId: null,
    origin,
  }

  try {
    await dispatch(
      cgwApi.endpoints.messagesCreateMessageV1.initiate({
        chainId,
        safeAddress: parentSafeAddress,
        createMessageDto,
      }),
    ).unwrap()
  } catch (error: unknown) {
    // Check if message already exists (400 error)
    const err = error as { status?: number; data?: { message?: string } }
    if (err.status === 400 && err.data?.message?.includes('already exists')) {
      // Fetch existing messages to find the conflicting one
      const messagesResult = await dispatch(
        cgwApi.endpoints.messagesGetMessagesBySafeV1.initiate({
          chainId,
          safeAddress: parentSafeAddress,
        }),
      ).unwrap()

      // Find the existing message for this delegate
      const delegateAddress = (
        delegateTypedData.message as { delegateAddress?: string }
      )?.delegateAddress?.toLowerCase()
      const existingMessage = messagesResult.results?.find((msg) => {
        if (msg.type !== 'MESSAGE') return false
        const msgOrigin = parseOriginAction(msg.origin)
        const msgDelegate = (
          msg.message as { message?: { delegateAddress?: string } }
        )?.message?.delegateAddress?.toLowerCase()
        return msgDelegate === delegateAddress && msgOrigin !== null
      })

      if (existingMessage && existingMessage.type === 'MESSAGE') {
        const existingAction = parseOriginAction(existingMessage.origin)

        if (existingAction === requestedAction) {
          // Same action - confirm the existing message instead
          await confirmDelegationMessage(dispatch, chainId, existingMessage.messageHash, signature)
          return
        } else {
          // Different action - can't have add + remove in same TOTP window
          throw new Error(
            `A pending "${existingAction}" delegation already exists for this proposer. ` +
              `Please wait for it to expire (~1 hour) before initiating a "${requestedAction}" action.`,
          )
        }
      }
    }
    // Re-throw other errors
    throw error
  }
}

/**
 * Adds a co-owner's signature to an existing delegation message.
 */
export const confirmDelegationMessage = async (
  dispatch: AppDispatch,
  chainId: string,
  messageHash: string,
  signature: string,
): Promise<void> => {
  await dispatch(
    cgwApi.endpoints.messagesUpdateMessageSignatureV1.initiate({
      chainId,
      messageHash,
      updateMessageSignatureDto: { signature },
    }),
  ).unwrap()
}
