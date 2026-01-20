/**
 * Transaction Machine Event Contracts
 *
 * This file defines the TypeScript interfaces for all events
 * that the TransactionMachine accepts and emits.
 *
 * Generated: 2026-01-20
 * Feature: 001-xstate-state-management
 */

import type { SafeTransaction, SafeSignature } from '@safe-global/safe-core-sdk-types'
import type { TransactionReceipt } from 'ethers'

// =============================================================================
// Input Events (sent to machine)
// =============================================================================

export type TransactionMachineEvent =
  | InitTxEvent
  | SignEvent
  | SignedEvent
  | SignFailedEvent
  | ProposeEvent
  | ProposedEvent
  | ProposeFailedEvent
  | SignatureAddedEvent
  | ExecuteEvent
  | ExecuteRelayEvent
  | TxSubmittedEvent
  | TxMinedEvent
  | TxRevertedEvent
  | IndexedEvent
  | CancelEvent
  | ErrorEvent

export interface InitTxEvent {
  type: 'INIT_TX'
  safeTx: SafeTransaction
  nonce: number
}

export interface SignEvent {
  type: 'SIGN'
  signerAddress: string
}

export interface SignedEvent {
  type: 'SIGNED'
  signature: SafeSignature
}

export interface SignFailedEvent {
  type: 'SIGN_FAILED'
  error: Error
}

export interface ProposeEvent {
  type: 'PROPOSE'
}

export interface ProposedEvent {
  type: 'PROPOSED'
  txId: string
}

export interface ProposeFailedEvent {
  type: 'PROPOSE_FAILED'
  error: Error
}

export interface SignatureAddedEvent {
  type: 'SIGNATURE_ADDED'
  signature: SafeSignature
  signerAddress: string
}

export interface ExecuteEvent {
  type: 'EXECUTE'
}

export interface ExecuteRelayEvent {
  type: 'EXECUTE_RELAY'
}

export interface TxSubmittedEvent {
  type: 'TX_SUBMITTED'
  txHash: string
  signerNonce: number
}

export interface TxMinedEvent {
  type: 'TX_MINED'
  receipt: TransactionReceipt
}

export interface TxRevertedEvent {
  type: 'TX_REVERTED'
  error: Error
  receipt?: TransactionReceipt
}

export interface IndexedEvent {
  type: 'INDEXED'
}

export interface CancelEvent {
  type: 'CANCEL'
}

export interface ErrorEvent {
  type: 'ERROR'
  error: Error
}

// =============================================================================
// Machine Context
// =============================================================================

export interface TransactionMachineContext {
  // Identifiers
  txId: string | null
  chainId: string
  safeAddress: string
  nonce: number | null

  // Transaction data
  safeTx: SafeTransaction | null
  signatures: SafeSignature[]
  threshold: number

  // Signer info
  signerAddress: string | null
  signerNonce: number | null

  // Execution tracking
  txHash: string | null
  taskId: string | null
  submittedAt: number | null
  gasLimit: bigint | null
  txType: 'SAFE_TX' | 'CUSTOM_TX' | null

  // Error state
  error: Error | null

  // Redux bridge
  dispatchRedux: (action: unknown) => void
}

// =============================================================================
// Machine Input (provided at creation)
// =============================================================================

export interface TransactionMachineInput {
  chainId: string
  safeAddress: string
  threshold: number
  dispatch: (action: unknown) => void
}

// =============================================================================
// Machine Output (emitted on completion)
// =============================================================================

export interface TransactionMachineOutput {
  txId: string
  txHash: string | null
  status: 'success' | 'failed'
  error?: Error
}

// =============================================================================
// State Value Types
// =============================================================================

export type TransactionMachineState =
  | 'idle'
  | 'signing'
  | 'proposing'
  | 'awaitingSignatures'
  | 'executable'
  | 'submitting'
  | 'processing'
  | 'relaying'
  | 'indexing'
  | 'nestedSigning'
  | 'success'
  | 'failed'

// =============================================================================
// Guard Types
// =============================================================================

export interface TransactionMachineGuards {
  hasAllSignatures: (context: TransactionMachineContext) => boolean
  isRelayedTx: (context: TransactionMachineContext) => boolean
  isNestedSafe: (context: TransactionMachineContext) => boolean
  isAlreadyIndexed: (context: TransactionMachineContext) => boolean
}

// =============================================================================
// Action Types
// =============================================================================

export interface TransactionMachineActions {
  dispatchTxEvent: (event: string, payload: unknown) => void
  updateReduxPending: (context: TransactionMachineContext) => void
  clearReduxPending: (txId: string) => void
  logTransition: (from: string, to: string, event: string) => void
}
