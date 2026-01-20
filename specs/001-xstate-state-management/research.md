# Research: XState State Management Refactoring

**Date**: 2026-01-20
**Feature**: 001-xstate-state-management

## Executive Summary

This research validates the approach of using XState v5 to replace effect chaining anti-patterns in Safe{Wallet}. Key findings:

1. **XState v5** is production-ready with smaller bundle (~26KB gzipped), first-class TypeScript support, and automatic actor lifecycle management
2. **Coexistence with Redux** is well-supported via the hybrid pattern: Redux for normalized state, XState for workflows
3. **Transaction flow** involves 27 event types and 6 pending states that form a complex manual state machine
4. **Migration path** is clear: implement XState machines that bridge to existing TxEvent/Redux systems

---

## Decision 1: XState Version

**Decision**: XState v5 (latest stable)

**Rationale**:

- Smaller bundle size (~26KB gzipped vs ~35KB for v4)
- TypeScript 5.0+ with superior type inference
- Simplified API: `createActor` replaces `interpret`
- First-class actor model with automatic lifecycle management
- `fromPromise` and `fromCallback` helpers with built-in cancellation

**Alternatives Considered**:

- **XState v4**: Larger bundle, legacy API, being deprecated
- **Zustand**: Simpler but lacks formal state machine semantics
- **Custom useReducer patterns**: No visualization, harder to test
- **Redux Toolkit alone**: Already in use; lacks async orchestration primitives

---

## Decision 2: Redux Integration Pattern

**Decision**: Hybrid coexistence (Pattern A)

**Rationale**:

- Redux continues to hold normalized global state (transactions, chains, user data)
- XState handles complex workflows with explicit state transitions
- Machines dispatch to Redux via context-injected `dispatch` function
- Backward compatibility preserved with existing selectors and middleware

**Implementation Pattern**:

```typescript
const transactionMachine = createMachine({
  context: ({ input }) => ({
    dispatchRedux: input.dispatch,
  }),
  // ... states invoke services and dispatch to Redux on completion
})

// Usage in component
const dispatch = useDispatch()
const [snapshot, send] = useMachine(transactionMachine, {
  input: { dispatch },
})
```

**Alternatives Considered**:

- **Full Redux replacement**: Too risky, breaks mobile shared packages
- **XState as Redux middleware**: Complex, less idiomatic
- **Separate stores**: Data duplication, sync issues

---

## Decision 3: EventBus Bridge Strategy

**Decision**: Bidirectional bridge - XState emits TxEvents, listens to external TxEvents

**Rationale**:

- Preserves backward compatibility with existing code that dispatches/subscribes to TxEvents
- Allows incremental migration without breaking existing flows
- Machines can be tested in isolation while integrated system continues working

**Implementation**:

```typescript
// Machine emits TxEvents on state transitions
const transactionMachine = createMachine({
  states: {
    signing: {
      entry: () => txDispatch(TxEvent.SIGNATURE_PROPOSED, { ... }),
      on: {
        SIGNED: 'proposing'
      }
    }
  }
});

// External events bridge into machine
useEffect(() => {
  const unsub = txSubscribe(TxEvent.SUCCESS, (detail) => {
    send({ type: 'TX_SUCCESS', payload: detail });
  });
  return unsub;
}, [send]);
```

---

## Decision 4: State Persistence Strategy

**Decision**: Use `getPersistedSnapshot()` with localStorage

**Rationale**:

- XState v5's built-in persistence recursively persists all nested actors
- Works with browser refresh scenarios per FR-006
- Compatible with existing Redux persistence patterns

**Implementation**:

```typescript
// Persist on every state change
useEffect(() => {
  const persisted = actor.getPersistedSnapshot()
  localStorage.setItem('tx-machine-state', JSON.stringify(persisted))
}, [snapshot])

// Restore on mount
const actor = createActor(transactionMachine, {
  snapshot: savedState ? JSON.parse(savedState) : undefined,
}).start()
```

**Note**: Entry actions do NOT re-execute on restore; invoked services DO restart.

---

## Decision 5: Testing Strategy

**Decision**: Unit tests with createActor + @xstate/graph for model verification

**Rationale**:

- Direct actor testing is simpler and more aligned with existing Jest patterns
- @xstate/test deprecated in favor of @xstate/graph
- MSW continues to mock network requests

**Implementation**:

```typescript
describe('transactionMachine', () => {
  it('transitions from signing to proposing on SIGNED event', async () => {
    const actor = createActor(transactionMachine, { input: mockInput }).start()
    actor.send({ type: 'SIGN' })

    await waitFor(() => {
      expect(actor.getSnapshot().value).toBe('proposing')
    })
  })
})
```

---

## Current Transaction Flow Analysis

### TxEvent Enum (27 Events)

| Category  | Events                                                                                    |
| --------- | ----------------------------------------------------------------------------------------- |
| Signing   | SIGNED, SIGN_FAILED, ONCHAIN_SIGNATURE_REQUESTED, ONCHAIN_SIGNATURE_SUCCESS               |
| Proposal  | PROPOSED, PROPOSE_FAILED, SIGNATURE_PROPOSED, SIGNATURE_PROPOSE_FAILED, SIGNATURE_INDEXED |
| Execution | EXECUTING, PROCESSING, PROCESSING_MODULE, PROCESSED                                       |
| Relay     | RELAYING                                                                                  |
| Terminal  | SUCCESS, REVERTED, FAILED, DELETED                                                        |
| Batch     | BATCH_ADD                                                                                 |
| Nested    | NESTED_SAFE_TX_CREATED                                                                    |
| Other     | SAFE_APPS_REQUEST, SPEEDUP_FAILED                                                         |

### PendingStatus Enum (6 States)

| Status         | Description                   | Data                                               |
| -------------- | ----------------------------- | -------------------------------------------------- |
| SIGNING        | Waiting for signature         | signerAddress                                      |
| NESTED_SIGNING | Nested safe signature pending | signerAddress, txHashOrParentSafeTxHash            |
| SUBMITTING     | Tx being submitted            | (none)                                             |
| PROCESSING     | Tx in mempool                 | txHash, submittedAt, signerNonce, gasLimit, txType |
| RELAYING       | Gelato relay in progress      | taskId                                             |
| INDEXING       | Waiting for indexer           | txHash                                             |

### State Transition Sequences

**Standard SafeTx Happy Path**:

```
idle
  → signing (SIGNATURE_PROPOSED)
  → processing (PROCESSING with txHash)
  → indexing (PROCESSED)
  → [cleared] (SIGNATURE_INDEXED or SUCCESS)
```

**Relayed SafeTx Happy Path**:

```
idle
  → signing (SIGNATURE_PROPOSED)
  → relaying (RELAYING with taskId)
  → processing (PROCESSED from relay monitor)
  → indexing (PROCESSED)
  → [cleared] (SUCCESS)
```

**Custom Tx Happy Path**:

```
idle
  → submitting (EXECUTING)
  → processing (PROCESSING with CustomTx data)
  → indexing (PROCESSED)
  → [cleared] (SUCCESS)
```

**Nested Safe Path**:

```
idle
  → signing (ONCHAIN_SIGNATURE_REQUESTED)
  → nestedSigning (NESTED_SAFE_TX_CREATED)
  → [awaiting parent execution]
  → [cleared] (SUCCESS on parent tx)
```

### Error Transitions

All error events lead to terminal state:

- SIGN_FAILED → [cleared with error]
- SIGNATURE_PROPOSE_FAILED → [cleared with error]
- SPEEDUP_FAILED → [cleared with error]
- REVERTED → [cleared with error]
- FAILED → [cleared with error]

---

## XState Machine Design (Draft)

Based on the analysis, the transaction machine should have these states:

```typescript
type TransactionState =
  | { value: 'idle' }
  | { value: 'signing'; context: { signerAddress: string } }
  | { value: 'proposing' }
  | { value: 'awaitingSignatures'; context: { signatures: string[] } }
  | { value: 'submitting' }
  | { value: 'processing'; context: { txHash: string; submittedAt: number } }
  | { value: 'relaying'; context: { taskId: string } }
  | { value: 'indexing'; context: { txHash: string } }
  | { value: 'nestedSigning'; context: { parentSafeAddress: string } }
  | { value: 'success' }
  | { value: 'failed'; context: { error: Error } }
```

**Key Guards**:

- `hasAllSignatures`: Check if threshold met before execution
- `isRelayedTx`: Route to relay flow vs direct execution
- `isNestedSafe`: Route to nested signing flow
- `isAlreadyIndexed`: Prevent duplicate processing

**Key Actions**:

- `dispatchTxEvent`: Bridge to existing EventBus
- `updateReduxPending`: Keep Redux store in sync
- `clearReduxPending`: Clean up on terminal states
- `logTransition`: Developer tooling support

---

## Bundle Size Analysis

| Package                  | Size (gzipped) |
| ------------------------ | -------------- |
| xstate                   | ~26KB          |
| @xstate/react            | ~3KB           |
| @xstate/graph (dev only) | ~5KB           |
| **Total runtime**        | **~29KB**      |

SC-005 target: <60KB. ✅ Well within budget.

---

## Risk Assessment

| Risk                    | Likelihood | Impact | Mitigation                               |
| ----------------------- | ---------- | ------ | ---------------------------------------- |
| Breaking existing flows | Medium     | High   | Incremental migration with feature flags |
| Performance regression  | Low        | Medium | Benchmark state update latency           |
| Team learning curve     | Medium     | Low    | Comprehensive quickstart documentation   |
| Type complexity         | Low        | Low    | XState v5 has excellent TS support       |

---

## References

- [XState v5 Documentation](https://stately.ai/docs)
- [XState v5 Release Blog](https://stately.ai/blog/2023-12-01-xstate-v5)
- [XState React Hooks](https://stately.ai/docs/xstate-react)
- [XState Persistence Guide](https://stately.ai/docs/persistence)
- [XState Testing Guide](https://stately.ai/docs/testing)
