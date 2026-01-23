import { hashTypedData, signTypedData } from '@safe-global/utils/utils/web3'
import { SigningMethod } from '@safe-global/protocol-kit'
import { adjustVInSignature } from '@safe-global/protocol-kit/dist/src/utils/signatures'
import type { JsonRpcSigner } from 'ethers'
import { AbiCoder, zeroPadValue } from 'ethers'
import { getDelegateTypedData } from '@safe-global/utils/services/delegates'

export const signProposerTypedData = async (chainId: string, proposerAddress: string, signer: JsonRpcSigner) => {
  const typedData = getDelegateTypedData(chainId, proposerAddress)
  return signTypedData(signer, typedData)
}

/**
 * Signs the delegate typed data as a Safe message for EIP-1271 validation.
 *
 * When the parent Safe's isValidSignature is called with the delegate hash,
 * the CompatibilityFallbackHandler wraps it in a SafeMessage EIP-712 structure:
 *   domain: { verifyingContract: parentSafeAddress, chainId }
 *   types: { SafeMessage: [{ type: 'bytes', name: 'message' }] }
 *   message: { message: delegateTypedDataHash }
 *
 * The EOA owner must sign this wrapped typed data so that checkSignatures
 * can recover the signer correctly.
 */
export const signProposerTypedDataForSafe = async (
  chainId: string,
  proposerAddress: string,
  parentSafeAddress: string,
  signer: JsonRpcSigner,
) => {
  // Step 1: Compute the delegate typed data hash
  const delegateTypedData = getDelegateTypedData(chainId, proposerAddress)
  const delegateHash = hashTypedData(delegateTypedData)

  // Step 2: Build the SafeMessage typed data that the CompatibilityFallbackHandler uses
  const safeMessageTypedData = {
    domain: {
      verifyingContract: parentSafeAddress,
      chainId: Number(chainId),
    },
    types: {
      SafeMessage: [{ type: 'bytes', name: 'message' }],
    },
    message: {
      message: delegateHash,
    },
    primaryType: 'SafeMessage' as const,
  }

  // Step 3: Sign the SafeMessage typed data with the EOA
  return signTypedData(signer, safeMessageTypedData)
}

const getProposerDataV1 = (proposerAddress: string) => {
  const totp = Math.floor(Date.now() / 1000 / 3600)

  return `${proposerAddress}${totp}`
}

export const signProposerData = async (proposerAddress: string, signer: JsonRpcSigner) => {
  const data = getProposerDataV1(proposerAddress)

  const signature = await signer.signMessage(data)

  return adjustVInSignature(SigningMethod.ETH_SIGN_TYPED_DATA, signature)
}

/**
 * Encodes an EOA signature in EIP-1271 contract signature format for a parent Safe.
 *
 * Format:
 * - bytes 0-31:  r = parentSafeAddress (left-padded to 32 bytes)
 * - bytes 32-63: s = 0x41 (65 decimal, offset to dynamic signature data)
 * - byte 64:     v = 0x00 (contract signature type)
 * - bytes 65+:   ABI-encoded bytes of the owner signature (length-prefixed)
 */
export const encodeEIP1271Signature = (parentSafeAddress: string, ownerSignature: string): string => {
  const abiCoder = AbiCoder.defaultAbiCoder()

  // r: parent Safe address left-padded to 32 bytes
  const r = zeroPadValue(parentSafeAddress, 32)

  // s: offset to dynamic data = 65 (0x41), left-padded to 32 bytes
  const s = zeroPadValue('0x41', 32)

  // v: 0x00 indicates contract signature
  const v = '00'

  // Dynamic part: ABI-encoded bytes of the owner signature
  // abi.encode(["bytes"], [signature]) produces: 32 bytes offset + 32 bytes length + padded data
  // We skip the first 32 bytes (offset pointer) since it's inline here
  const encodedSig = abiCoder.encode(['bytes'], [ownerSignature])
  // Remove the 0x prefix and the first 32 bytes (offset = 0x20) from abi.encode output
  const dynamicData = encodedSig.slice(66) // skip "0x" + 64 hex chars (32 bytes offset)

  return `${r}${s.slice(2)}${v}${dynamicData}`
}
