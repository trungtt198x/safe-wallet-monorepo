/**
 * WalletConnect Machine Event Contracts
 *
 * This file defines the TypeScript interfaces for all events
 * that the WalletConnectMachine accepts and emits.
 *
 * Generated: 2026-01-20
 * Feature: 001-xstate-state-management
 */

import type { SessionTypes, SignClientTypes } from '@walletconnect/types'

// =============================================================================
// Input Events (sent to machine)
// =============================================================================

export type WalletConnectMachineEvent =
  | InitEvent
  | InitializedEvent
  | InitFailedEvent
  | ConnectEvent
  | SessionEstablishedEvent
  | SessionDisconnectedEvent
  | RequestReceivedEvent
  | RequestHandledEvent
  | DisconnectEvent
  | ErrorEvent
  | UpdateSessionsEvent

export interface InitEvent {
  type: 'INIT'
}

export interface InitializedEvent {
  type: 'INITIALIZED'
  walletConnect: WalletConnectInstance
}

export interface InitFailedEvent {
  type: 'INIT_FAILED'
  error: Error
}

export interface ConnectEvent {
  type: 'CONNECT'
  uri: string
}

export interface SessionEstablishedEvent {
  type: 'SESSION_ESTABLISHED'
  session: SessionTypes.Struct
}

export interface SessionDisconnectedEvent {
  type: 'SESSION_DISCONNECTED'
  topic: string
}

export interface RequestReceivedEvent {
  type: 'REQUEST_RECEIVED'
  request: WalletConnectRequest
}

export interface RequestHandledEvent {
  type: 'REQUEST_HANDLED'
  requestId: number
  result?: unknown
  error?: Error
}

export interface DisconnectEvent {
  type: 'DISCONNECT'
  topic: string
}

export interface ErrorEvent {
  type: 'ERROR'
  error: Error
}

export interface UpdateSessionsEvent {
  type: 'UPDATE_SESSIONS'
  chainId: string
  safeAddress: string
}

// =============================================================================
// Supporting Types
// =============================================================================

export interface WalletConnectInstance {
  init: () => Promise<void>
  connect: (uri: string) => Promise<SessionTypes.Struct>
  disconnect: (topic: string) => Promise<void>
  updateSessions: (chainId: string, safeAddress: string) => Promise<void>
  onRequest: (handler: (event: SignClientTypes.EventArguments['session_request']) => Promise<void>) => () => void
  getSessions: () => SessionTypes.Struct[]
}

export interface WalletConnectRequest {
  id: number
  topic: string
  params: {
    request: {
      method: string
      params: unknown[]
    }
    chainId: string
  }
}

// =============================================================================
// Machine Context
// =============================================================================

export interface WalletConnectMachineContext {
  // Connection info
  chainId: string
  safeAddress: string

  // WalletConnect instance
  walletConnect: WalletConnectInstance | null

  // Session management
  sessions: SessionTypes.Struct[]

  // Pending request
  pendingRequest: WalletConnectRequest | null

  // Error state
  error: Error | null
}

// =============================================================================
// Machine Input (provided at creation)
// =============================================================================

export interface WalletConnectMachineInput {
  chainId: string
  safeAddress: string
}

// =============================================================================
// State Value Types
// =============================================================================

export type WalletConnectMachineState =
  | 'uninitialized'
  | 'initializing'
  | 'ready'
  | 'connecting'
  | 'connected'
  | 'error'

// =============================================================================
// Guard Types
// =============================================================================

export interface WalletConnectMachineGuards {
  hasActiveSessions: (context: WalletConnectMachineContext) => boolean
  isValidUri: (event: ConnectEvent) => boolean
  canHandleRequest: (context: WalletConnectMachineContext) => boolean
}

// =============================================================================
// Action Types
// =============================================================================

export interface WalletConnectMachineActions {
  addSession: (session: SessionTypes.Struct) => void
  removeSession: (topic: string) => void
  setPendingRequest: (request: WalletConnectRequest | null) => void
  logSessionEvent: (type: string, topic: string) => void
}
