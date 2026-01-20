# Quickstart: XState State Management

**Date**: 2026-01-20
**Feature**: 001-xstate-state-management

## Prerequisites

- Node.js 18+
- Yarn 4 (via corepack)
- Familiarity with TypeScript and React hooks

## Installation

```bash
# Install XState v5 and React bindings
yarn workspace @safe-global/web add xstate @xstate/react

# Install dev dependencies for testing
yarn workspace @safe-global/web add -D @xstate/graph
```

## Quick Example: Transaction Machine

### 1. Define the Machine

```typescript
// apps/web/src/features/tx-flow/machines/transactionMachine.ts
import { createMachine, assign, fromPromise } from 'xstate'
import type { TransactionMachineContext, TransactionMachineEvent } from './types'

export const transactionMachine = createMachine({
  id: 'transaction',
  initial: 'idle',
  types: {} as {
    context: TransactionMachineContext
    events: TransactionMachineEvent
  },
  context: ({ input }) => ({
    txId: null,
    chainId: input.chainId,
    safeAddress: input.safeAddress,
    nonce: null,
    safeTx: null,
    signatures: [],
    threshold: input.threshold,
    signerAddress: null,
    txHash: null,
    error: null,
    dispatchRedux: input.dispatch,
  }),
  states: {
    idle: {
      on: {
        INIT_TX: {
          target: 'signing',
          actions: assign({
            safeTx: ({ event }) => event.safeTx,
            nonce: ({ event }) => event.nonce,
          }),
        },
      },
    },
    signing: {
      invoke: {
        id: 'signTransaction',
        src: fromPromise(async ({ input, signal }) => {
          // Request signature from wallet
          const signature = await requestSignature(input.safeTx, { signal })
          return signature
        }),
        input: ({ context }) => ({ safeTx: context.safeTx }),
        onDone: {
          target: 'proposing',
          actions: assign({
            signatures: ({ context, event }) => [...context.signatures, event.output],
          }),
        },
        onError: {
          target: 'failed',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    proposing: {
      invoke: {
        id: 'proposeTransaction',
        src: fromPromise(async ({ input }) => {
          const txId = await proposeTx(input.safeTx, input.signatures)
          return txId
        }),
        input: ({ context }) => ({
          safeTx: context.safeTx,
          signatures: context.signatures,
        }),
        onDone: {
          target: 'awaitingSignatures',
          actions: assign({ txId: ({ event }) => event.output }),
        },
        onError: {
          target: 'failed',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    awaitingSignatures: {
      always: [
        {
          guard: ({ context }) => context.signatures.length >= context.threshold,
          target: 'executable',
        },
      ],
      on: {
        SIGNATURE_ADDED: {
          actions: assign({
            signatures: ({ context, event }) => [...context.signatures, event.signature],
          }),
        },
      },
    },
    executable: {
      on: {
        EXECUTE: 'submitting',
        EXECUTE_RELAY: 'relaying',
      },
    },
    submitting: {
      invoke: {
        id: 'executeTx',
        src: fromPromise(async ({ input }) => {
          const txHash = await executeTx(input.safeTx, input.signatures)
          return txHash
        }),
        input: ({ context }) => ({
          safeTx: context.safeTx,
          signatures: context.signatures,
        }),
        onDone: {
          target: 'processing',
          actions: assign({ txHash: ({ event }) => event.output }),
        },
        onError: {
          target: 'failed',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    processing: {
      invoke: {
        id: 'watchTx',
        src: fromCallback(({ input, sendBack }) => {
          const unsubscribe = watchTransaction(input.txHash, (receipt) => {
            if (receipt.status === 1) {
              sendBack({ type: 'TX_MINED', receipt })
            } else {
              sendBack({ type: 'TX_REVERTED', error: new Error('Reverted') })
            }
          })
          return unsubscribe
        }),
        input: ({ context }) => ({ txHash: context.txHash }),
      },
      on: {
        TX_MINED: 'indexing',
        TX_REVERTED: {
          target: 'failed',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    relaying: {
      // Similar to processing but polls Gelato API
    },
    indexing: {
      invoke: {
        id: 'waitForIndexer',
        src: fromPromise(async ({ input }) => {
          await waitForTxIndexed(input.txId)
        }),
        input: ({ context }) => ({ txId: context.txId }),
        onDone: 'success',
        onError: {
          target: 'failed',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    success: { type: 'final' },
    failed: { type: 'final' },
  },
})
```

### 2. Create React Hook

```typescript
// apps/web/src/features/tx-flow/hooks/useTransactionMachine.ts
import { useMachine } from '@xstate/react'
import { useDispatch } from 'react-redux'
import { transactionMachine } from '../machines/transactionMachine'

export function useTransactionMachine(safeAddress: string, chainId: string, threshold: number) {
  const dispatch = useDispatch()

  const [snapshot, send, actor] = useMachine(transactionMachine, {
    input: {
      chainId,
      safeAddress,
      threshold,
      dispatch,
    },
  })

  return {
    // Current state
    state: snapshot.value,
    context: snapshot.context,

    // State checks
    isIdle: snapshot.matches('idle'),
    isSigning: snapshot.matches('signing'),
    isExecutable: snapshot.matches('executable'),
    isSuccess: snapshot.matches('success'),
    isFailed: snapshot.matches('failed'),

    // Actions
    initTx: (safeTx: SafeTransaction, nonce: number) => {
      send({ type: 'INIT_TX', safeTx, nonce })
    },
    execute: () => send({ type: 'EXECUTE' }),
    executeRelay: () => send({ type: 'EXECUTE_RELAY' }),
    cancel: () => send({ type: 'CANCEL' }),

    // Error
    error: snapshot.context.error,
  }
}
```

### 3. Use in Component

```typescript
// apps/web/src/components/tx-flow/TransactionFlow.tsx
import { useTransactionMachine } from '@/features/tx-flow/hooks/useTransactionMachine'

export function TransactionFlow({ safeAddress, chainId, threshold }: Props) {
  const tx = useTransactionMachine(safeAddress, chainId, threshold)

  if (tx.isFailed) {
    return <ErrorState error={tx.error} onRetry={tx.cancel} />
  }

  if (tx.isSuccess) {
    return <SuccessState txHash={tx.context.txHash} />
  }

  return (
    <div>
      {tx.isSigning && <SigningIndicator />}
      {tx.isExecutable && (
        <>
          <Button onClick={tx.execute}>Execute</Button>
          <Button onClick={tx.executeRelay}>Execute via Relay</Button>
        </>
      )}
    </div>
  )
}
```

## Testing

```typescript
// apps/web/src/features/tx-flow/machines/transactionMachine.test.ts
import { createActor } from 'xstate'
import { transactionMachine } from './transactionMachine'

describe('transactionMachine', () => {
  it('transitions from idle to signing on INIT_TX', () => {
    const actor = createActor(transactionMachine, {
      input: {
        chainId: '1',
        safeAddress: '0x123',
        threshold: 2,
        dispatch: jest.fn(),
      },
    }).start()

    expect(actor.getSnapshot().value).toBe('idle')

    actor.send({
      type: 'INIT_TX',
      safeTx: mockSafeTx,
      nonce: 1,
    })

    expect(actor.getSnapshot().value).toBe('signing')
    expect(actor.getSnapshot().context.nonce).toBe(1)
  })

  it('moves to executable when threshold signatures collected', async () => {
    const actor = createActor(transactionMachine, {
      input: { chainId: '1', safeAddress: '0x123', threshold: 2, dispatch: jest.fn() },
    }).start()

    // ... setup to awaitingSignatures state

    actor.send({ type: 'SIGNATURE_ADDED', signature: mockSig1, signerAddress: '0xabc' })
    actor.send({ type: 'SIGNATURE_ADDED', signature: mockSig2, signerAddress: '0xdef' })

    expect(actor.getSnapshot().value).toBe('executable')
  })
})
```

## State Persistence

```typescript
// Persist state on changes
useEffect(() => {
  const persisted = actor.getPersistedSnapshot()
  localStorage.setItem(`tx-machine-${safeAddress}`, JSON.stringify(persisted))
}, [snapshot])

// Restore on mount
const savedState = localStorage.getItem(`tx-machine-${safeAddress}`)
const actor = createActor(transactionMachine, {
  input: { ... },
  snapshot: savedState ? JSON.parse(savedState) : undefined,
}).start()
```

## Redux Integration

```typescript
// Bridge machine events to TxEvent
const [snapshot] = useMachine(transactionMachine, {
  input: { dispatch },
})

useEffect(() => {
  if (snapshot.matches('proposing')) {
    txDispatch(TxEvent.SIGNATURE_PROPOSED, {
      txId: snapshot.context.txId,
      signerAddress: snapshot.context.signerAddress,
    })
  }
  if (snapshot.matches('success')) {
    txDispatch(TxEvent.SUCCESS, { txId: snapshot.context.txId })
    dispatch(clearPendingTx({ txId: snapshot.context.txId }))
  }
}, [snapshot.value])
```

## Key Patterns

1. **State checks**: Use `snapshot.matches('stateName')` instead of string comparison
2. **Context access**: Always via `snapshot.context`, never mutate directly
3. **Side effects**: Put in `invoke` (async) or `entry`/`exit` actions
4. **Guards**: Define in machine config, reference by name
5. **Error handling**: Use `onError` transitions from invoked services

## Resources

- [XState v5 Documentation](https://stately.ai/docs)
- [XState React Documentation](https://stately.ai/docs/xstate-react)
- [XState Visualizer](https://stately.ai/viz)
