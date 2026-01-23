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
 * Creates a new off-chain delegation message on the parent Safe.
 * This initiates the multi-sig signature collection process.
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

  const createMessageDto: CreateMessageDto = {
    message: normalizedMessage,
    signature,
    safeAppId: null,
    origin,
  }

  await dispatch(
    cgwApi.endpoints.messagesCreateMessageV1.initiate({
      chainId,
      safeAddress: parentSafeAddress,
      createMessageDto,
    }),
  ).unwrap()
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
