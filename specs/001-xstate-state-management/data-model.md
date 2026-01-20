# Data Model: XState State Management

**Date**: 2026-01-20
**Feature**: 001-xstate-state-management

## Overview

This document defines the data model for XState state machines, including entity types, context shapes, event contracts, and state transitions.

---

## Entities

### 1. TransactionMachineContext

The context held by the transaction state machine throughout its lifecycle.

| Field         | Type                               | Required | Description                          |
| ------------- | ---------------------------------- | -------- | ------------------------------------ |
| txId          | `string`                           | Yes      | Unique transaction identifier        |
| chainId       | `string`                           | Yes      | Blockchain chain ID                  |
| safeAddress   | `Address`                          | Yes      | Safe wallet address                  |
| nonce         | `number`                           | No       | Transaction nonce                    |
| safeTx        | `SafeTransaction \| null`          | No       | Safe transaction object              |
| signerAddress | `Address \| null`                  | No       | Current signer's address             |
| signatures    | `SafeSignature[]`                  | Yes      | Collected signatures                 |
| txHash        | `string \| null`                   | No       | On-chain transaction hash            |
| taskId        | `string \| null`                   | No       | Gelato relay task ID                 |
| submittedAt   | `number \| null`                   | No       | Timestamp when tx entered processing |
| signerNonce   | `number \| null`                   | No       | Signer's account nonce               |
| gasLimit      | `bigint \| null`                   | No       | Gas limit for SafeTx                 |
| txType        | `'SAFE_TX' \| 'CUSTOM_TX' \| null` | No       | Transaction type                     |
| error         | `Error \| null`                    | No       | Error if failed                      |
| dispatchRedux | `Dispatch`                         | Yes      | Redux dispatch function              |
| threshold     | `number`                           | Yes      | Required signature count             |

**Validation Rules**:

- `txId` must be non-empty string
- `chainId` must be valid EIP-155 chain ID
- `safeAddress` must be valid Ethereum address
- `threshold` must be >= 1

---

### 2. WalletConnectMachineContext

The context held by the WalletConnect state machine.

| Field          | Type                            | Required | Description            |
| -------------- | ------------------------------- | -------- | ---------------------- |
| chainId        | `string`                        | Yes      | Current chain ID       |
| safeAddress    | `Address`                       | Yes      | Connected Safe address |
| walletConnect  | `WalletConnectInstance \| null` | No       | WC client instance     |
| sessions       | `SessionTypes.Struct[]`         | Yes      | Active sessions        |
| pendingRequest | `PendingRequest \| null`        | No       | Pending dApp request   |
| error          | `Error \| null`                 | No       | Error if failed        |

---

### 3. SafeCreationMachineContext

The context held by the Safe creation state machine.

| Field            | Type                 | Required | Description             |
| ---------------- | -------------------- | -------- | ----------------------- |
| chainId          | `string`             | Yes      | Target chain ID         |
| owners           | `Address[]`          | Yes      | Owner addresses         |
| threshold        | `number`             | Yes      | Signature threshold     |
| saltNonce        | `string`             | Yes      | Deployment salt         |
| predictedAddress | `Address \| null`    | No       | Predicted Safe address  |
| deploymentTxHash | `string \| null`     | No       | Deployment tx hash      |
| status           | `SafeCreationStatus` | Yes      | Current creation status |
| error            | `Error \| null`      | No       | Error if failed         |

---

## State Definitions

### TransactionMachine States

```typescript
type TransactionState =
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
```

**State Descriptions**:

| State              | Entry Condition          | Exit Condition      | Invariants                     |
| ------------------ | ------------------------ | ------------------- | ------------------------------ |
| idle               | Machine start            | INIT_TX event       | No pending tx                  |
| signing            | User initiates signature | Signature collected | signerAddress set              |
| proposing          | Signature complete       | Backend accepts     | safeTx exists                  |
| awaitingSignatures | Proposal successful      | Threshold met       | signatures.length < threshold  |
| executable         | Threshold met            | Execute initiated   | signatures.length >= threshold |
| submitting         | Execute starts           | Tx submitted        | -                              |
| processing         | Tx in mempool            | Tx mined            | txHash set                     |
| relaying           | Relay requested          | Relay complete      | taskId set                     |
| indexing           | Tx mined                 | Indexer confirms    | txHash set                     |
| nestedSigning      | Nested safe flow         | Parent executes     | parentSafeAddress set          |
| success            | Indexer confirms         | -                   | Final state                    |
| failed             | Any error                | -                   | error set, Final state         |

---

### WalletConnectMachine States

```typescript
type WalletConnectState = 'uninitialized' | 'initializing' | 'ready' | 'connecting' | 'connected' | 'error'
```

---

### SafeCreationMachine States

```typescript
type SafeCreationState = 'idle' | 'validating' | 'deploying' | 'processing' | 'indexing' | 'success' | 'failed'
```

---

## Event Types

### Transaction Events (Input)

| Event           | Payload                                      | Description                      |
| --------------- | -------------------------------------------- | -------------------------------- |
| INIT_TX         | `{ safeTx: SafeTransaction; nonce: number }` | Initialize transaction           |
| SIGN            | `{ signerAddress: Address }`                 | Request signature                |
| SIGNED          | `{ signature: SafeSignature }`               | Signature collected              |
| SIGN_FAILED     | `{ error: Error }`                           | Signing failed                   |
| PROPOSE         | -                                            | Submit to backend                |
| PROPOSED        | `{ txId: string }`                           | Backend accepted                 |
| PROPOSE_FAILED  | `{ error: Error }`                           | Proposal failed                  |
| SIGNATURE_ADDED | `{ signature: SafeSignature }`               | New signature from another owner |
| EXECUTE         | -                                            | Begin execution                  |
| EXECUTE_RELAY   | -                                            | Begin relay execution            |
| TX_SUBMITTED    | `{ txHash: string }`                         | Tx in mempool                    |
| TX_MINED        | `{ receipt: TransactionReceipt }`            | Tx confirmed                     |
| TX_REVERTED     | `{ error: Error }`                           | Tx reverted                      |
| INDEXED         | -                                            | Indexer confirmed                |
| CANCEL          | -                                            | User cancellation                |

### WalletConnect Events

| Event               | Payload                               | Description          |
| ------------------- | ------------------------------------- | -------------------- |
| INIT                | -                                     | Start initialization |
| INITIALIZED         | `{ instance: WalletConnectInstance }` | Init complete        |
| CONNECT             | `{ uri: string }`                     | Connect via URI      |
| SESSION_ESTABLISHED | `{ session: SessionTypes.Struct }`    | Session connected    |
| REQUEST_RECEIVED    | `{ request: PendingRequest }`         | dApp request         |
| REQUEST_HANDLED     | -                                     | Request processed    |
| DISCONNECT          | `{ topic: string }`                   | Disconnect session   |
| ERROR               | `{ error: Error }`                    | Any error            |

---

## State Transition Diagram

```
TransactionMachine State Flow:

                                  ┌──────────────────────┐
                                  │                      │
                     ┌────────────┤      idle            │
                     │            │                      │
                     │            └──────────────────────┘
                     │                      │
                     │                      │ INIT_TX
                     │                      ▼
                     │            ┌──────────────────────┐
                     │            │                      │
                     │            │      signing         │
                     │            │                      │
                     │            └──────────────────────┘
                     │                      │
                     │            SIGNED    │    SIGN_FAILED
                     │                      ▼         │
                     │            ┌──────────────────────┐
                     │            │                      │──────┐
                     │            │      proposing       │      │
                     │            │                      │      │
                     │            └──────────────────────┘      │
                     │                      │                   │
                     │            PROPOSED  │  PROPOSE_FAILED   │
                     │                      ▼         │         │
                     │            ┌──────────────────────┐      │
                     │            │                      │      │
           CANCEL    │  ┌────────►│  awaitingSignatures  │      │
                     │  │         │                      │      │
                     │  │         └──────────────────────┘      │
                     │  │                   │                   │
                     │  │ SIGNATURE_ADDED   │ [threshold met]   │
                     │  │ [< threshold]     ▼                   │
                     │  │         ┌──────────────────────┐      │
                     │  │         │                      │      │
                     │  └─────────│     executable       │      │
                     │            │                      │      │
                     │            └──────────────────────┘      │
                     │                      │                   │
                     │            EXECUTE   │  EXECUTE_RELAY    │
                     │                 │    │       │           │
                     │                 ▼    │       ▼           │
                     │    ┌────────────┐    │  ┌─────────────┐  │
                     │    │            │    │  │             │  │
                     │    │ submitting │    │  │  relaying   │  │
                     │    │            │    │  │             │  │
                     │    └────────────┘    │  └─────────────┘  │
                     │            │         │         │         │
                     │ TX_SUBMITTED│         │   RELAY_COMPLETE │
                     │            ▼         │         │         │
                     │    ┌──────────────────┘         │        │
                     │    │                            │        │
                     │    │       processing  ◄────────┘        │
                     │    │                                     │
                     │    └──────────────────────────────┐      │
                     │                      │            │      │
                     │            TX_MINED  │  TX_REVERTED      │
                     │                      ▼            │      │
                     │            ┌──────────────────────┐      │
                     │            │                      │      │
                     │            │      indexing        │      │
                     │            │                      │      │
                     │            └──────────────────────┘      │
                     │                      │                   │
                     │            INDEXED   │                   │
                     │                      ▼                   │
                     │            ┌──────────────────────┐      │
                     │            │                      │      │
                     └───────────►│      success         │      │
                                  │       (final)        │      │
                                  └──────────────────────┘      │
                                                                │
                                  ┌──────────────────────┐      │
                                  │                      │◄─────┘
                                  │      failed          │
                                  │       (final)        │
                                  └──────────────────────┘
```

---

## Relationships

### Machine-to-Redux Relationship

```
┌─────────────────────────────────────────────────────────────┐
│                        Redux Store                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ pendingTxsSlice │  │  txQueueSlice   │  │ txHistory   │  │
│  └────────▲────────┘  └────────▲────────┘  └──────▲──────┘  │
└───────────┼────────────────────┼─────────────────┼──────────┘
            │                    │                 │
            │ setPendingTx       │ RTK Query       │ Listener
            │ clearPendingTx     │                 │ Middleware
            │                    │                 │
┌───────────┴────────────────────┴─────────────────┴──────────┐
│                   TransactionMachine                         │
│                                                              │
│  entry/exit actions dispatch to Redux                        │
│  guards read from Redux selectors                            │
│  invoked services use Safe SDK                               │
└──────────────────────────────────────────────────────────────┘
```

### Machine-to-EventBus Bridge

```
┌─────────────────────────────────────────────────────────────┐
│                       EventBus                               │
│           txDispatch() / txSubscribe()                       │
└────────────────────────────▲────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────┴─────────┐         ┌─────────┴─────────┐
    │ Machine Entry     │         │ External Code     │
    │ Actions emit      │         │ subscribes to     │
    │ TxEvents          │         │ TxEvents          │
    └───────────────────┘         └───────────────────┘
```

---

## Uniqueness Rules

| Entity                | Unique Key                          | Scope     |
| --------------------- | ----------------------------------- | --------- |
| Transaction           | `${chainId}:${safeAddress}:${txId}` | Global    |
| PendingTx             | `txId`                              | Per Safe  |
| WalletConnect Session | `topic`                             | Global    |
| Safe Creation         | `${chainId}:${predictedAddress}`    | Per chain |

---

## Lifecycle Transitions

### Transaction Lifecycle

| From State         | To State           | Trigger         | Side Effects                              |
| ------------------ | ------------------ | --------------- | ----------------------------------------- |
| idle               | signing            | INIT_TX         | Set safeTx, signerAddress                 |
| signing            | proposing          | SIGNED          | Add signature                             |
| signing            | failed             | SIGN_FAILED     | Set error                                 |
| proposing          | awaitingSignatures | PROPOSED        | Set txId, emit TxEvent.SIGNATURE_PROPOSED |
| proposing          | failed             | PROPOSE_FAILED  | Set error                                 |
| awaitingSignatures | awaitingSignatures | SIGNATURE_ADDED | Add signature                             |
| awaitingSignatures | executable         | [threshold met] | (automatic)                               |
| executable         | submitting         | EXECUTE         | Emit TxEvent.EXECUTING                    |
| executable         | relaying           | EXECUTE_RELAY   | Emit TxEvent.RELAYING                     |
| submitting         | processing         | TX_SUBMITTED    | Set txHash, emit TxEvent.PROCESSING       |
| relaying           | processing         | RELAY_COMPLETE  | Set txHash                                |
| processing         | indexing           | TX_MINED        | Emit TxEvent.PROCESSED                    |
| processing         | failed             | TX_REVERTED     | Set error, emit TxEvent.REVERTED          |
| indexing           | success            | INDEXED         | Emit TxEvent.SUCCESS, clear Redux         |
| \*                 | failed             | ERROR           | Set error, emit TxEvent.FAILED            |
| \*                 | idle               | CANCEL          | Clear context                             |
