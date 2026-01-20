# Tasks: XState State Management Refactoring

**Input**: Design documents from `/specs/001-xstate-state-management/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are included as Constitution principle III (Test-First Development) applies.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:

- **Feature machines**: `apps/web/src/features/*/machines/`
- **Hooks**: `apps/web/src/features/*/hooks/`
- **Services**: `apps/web/src/services/`
- **Tests**: Co-located with source files as `*.test.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install XState dependencies and create base infrastructure

- [ ] T001 Install XState v5 dependencies: `yarn workspace @safe-global/web add xstate @xstate/react`
- [ ] T002 Install XState dev dependencies: `yarn workspace @safe-global/web add -D @xstate/graph`
- [ ] T003 [P] Create machines directory structure in `apps/web/src/features/tx-flow/machines/`
- [ ] T004 [P] Create machines directory structure in `apps/web/src/features/walletconnect/machines/`
- [ ] T005 [P] Create machines directory structure in `apps/web/src/features/safe-creation/machines/` (if directory exists, just add machines subfolder)
- [ ] T006 Verify TypeScript config supports XState types in `apps/web/tsconfig.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create shared machine types in `apps/web/src/features/tx-flow/machines/types.ts` using contracts from `specs/001-xstate-state-management/contracts/transaction-machine-events.ts`
- [ ] T008 [P] Create EventBus bridge utility in `apps/web/src/services/tx/txEventBridge.ts` to translate between XState events and TxEvent emissions
- [ ] T009 [P] Create state persistence utility in `apps/web/src/features/tx-flow/machines/persistence.ts` using localStorage and `getPersistedSnapshot()`
- [ ] T010 [P] Create Redux bridge utility in `apps/web/src/features/tx-flow/machines/reduxBridge.ts` to dispatch setPendingTx/clearPendingTx actions
- [ ] T011 Create feature flag check for XState migration in `apps/web/src/config/constants.ts` (e.g., `ENABLE_XSTATE_TX_FLOW`)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Predictable Transaction Flow States (Priority: P1) 🎯 MVP

**Goal**: Implement TransactionMachine with explicit states (idle → signing → proposing → awaitingSignatures → executable → executing → processing → indexing → success/failed) that replaces effect chaining in transaction flows

**Independent Test**: Initiate transaction signing flow and verify each state transition displays correctly with appropriate UI feedback

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Create unit test file `apps/web/src/features/tx-flow/machines/transactionMachine.test.ts` with test cases for:
  - Initial state is 'idle'
  - INIT_TX transitions to 'signing'
  - SIGNED transitions to 'proposing'
  - PROPOSED transitions to 'awaitingSignatures'
  - Threshold check transitions to 'executable'
  - EXECUTE transitions to 'submitting'
  - TX_SUBMITTED transitions to 'processing'
  - TX_MINED transitions to 'indexing'
  - INDEXED transitions to 'success'
  - Error events transition to 'failed'

- [ ] T013 [P] [US1] Create unit test for guards in `apps/web/src/features/tx-flow/machines/guards.test.ts`:
  - hasAllSignatures guard (threshold comparison)
  - isRelayedTx guard
  - isAlreadyIndexed guard

- [ ] T014 [P] [US1] Create unit test for EventBus bridge in `apps/web/src/services/tx/txEventBridge.test.ts`

### Implementation for User Story 1

- [ ] T015 [US1] Implement TransactionMachine in `apps/web/src/features/tx-flow/machines/transactionMachine.ts`:
  - Define states: idle, signing, proposing, awaitingSignatures, executable, submitting, processing, relaying, indexing, nestedSigning, success, failed
  - Implement context type matching TransactionMachineContext from data-model.md
  - Define all transitions per state diagram in data-model.md

- [ ] T016 [US1] Implement guards in `apps/web/src/features/tx-flow/machines/guards.ts`:
  - hasAllSignatures: `context.signatures.length >= context.threshold`
  - isRelayedTx: Check for relay execution path
  - isNestedSafe: Check for nested safe scenario
  - isAlreadyIndexed: Prevent duplicate processing

- [ ] T017 [US1] Implement actions in `apps/web/src/features/tx-flow/machines/actions.ts`:
  - dispatchTxEvent: Emit TxEvent to EventBus
  - updateReduxPending: Dispatch setPendingTx to Redux
  - clearReduxPending: Dispatch clearPendingTx to Redux
  - logTransition: Log state transitions for debugging

- [ ] T018 [US1] Implement invoked services in `apps/web/src/features/tx-flow/machines/services.ts`:
  - signTransaction: fromPromise wrapper around wallet signature request
  - proposeTransaction: fromPromise wrapper around Safe API proposal
  - executeTransaction: fromPromise wrapper around tx execution
  - watchTransaction: fromCallback for tx monitoring with cleanup

- [ ] T019 [US1] Create useTransactionMachine hook in `apps/web/src/features/tx-flow/hooks/useTransactionMachine.ts`:
  - Accept safeAddress, chainId, threshold as input
  - Inject Redux dispatch into machine context
  - Return state, context, and action functions (initTx, sign, execute, cancel)
  - Implement state persistence on snapshot change

- [ ] T020 [US1] Create public API barrel file in `apps/web/src/features/tx-flow/machines/index.ts`

- [ ] T021 [US1] Integrate TransactionMachine into SafeTxProvider in `apps/web/src/components/tx-flow/SafeTxProvider.tsx`:
  - Replace existing useEffect chains with useTransactionMachine
  - Map machine state to UI states
  - Preserve backward compatibility with existing props

- [ ] T022 [US1] Update useTxPendingStatuses hook in `apps/web/src/hooks/useTxPendingStatuses.ts`:
  - Add feature flag check for ENABLE_XSTATE_TX_FLOW
  - When enabled: delegate to useTransactionMachine
  - When disabled: keep existing implementation

- [ ] T023 [US1] Run tests to verify all US1 tests pass: `yarn workspace @safe-global/web test --testPathPattern="transactionMachine|txEventBridge|guards"`

**Checkpoint**: Transaction state machine functional, UI displays predictable states without flickering

---

## Phase 4: User Story 2 - Reliable WalletConnect Session Management (Priority: P2)

**Goal**: Implement WalletConnectMachine that handles initialization, connection, and request handling without cascading useEffect issues

**Independent Test**: Connect dApp via WalletConnect QR code, verify session establishment, and confirm request handling across page refreshes

### Tests for User Story 2

- [ ] T024 [P] [US2] Create unit test file `apps/web/src/features/walletconnect/machines/walletConnectMachine.test.ts` with test cases for:
  - Initial state is 'uninitialized'
  - INIT transitions to 'initializing'
  - INITIALIZED transitions to 'ready'
  - CONNECT transitions to 'connecting'
  - SESSION_ESTABLISHED transitions to 'connected'
  - DISCONNECT removes session correctly
  - ERROR transitions to 'error' state
  - Multiple sessions handled correctly

- [ ] T025 [P] [US2] Create unit test for session persistence in `apps/web/src/features/walletconnect/machines/persistence.test.ts`

### Implementation for User Story 2

- [ ] T026 [P] [US2] Create WalletConnect machine types in `apps/web/src/features/walletconnect/machines/types.ts` using contracts from `specs/001-xstate-state-management/contracts/walletconnect-machine-events.ts`

- [ ] T027 [US2] Implement WalletConnectMachine in `apps/web/src/features/walletconnect/machines/walletConnectMachine.ts`:
  - Define states: uninitialized, initializing, ready, connecting, connected, error
  - Implement context type matching WalletConnectMachineContext from data-model.md
  - Handle session array management
  - Implement request queue handling

- [ ] T028 [US2] Implement WalletConnect invoked services in `apps/web/src/features/walletconnect/machines/services.ts`:
  - initWalletConnect: fromPromise for WC initialization
  - connectSession: fromPromise for session connection
  - onRequest: fromCallback for request subscription with cleanup

- [ ] T029 [US2] Create useWalletConnectMachine hook in `apps/web/src/features/walletconnect/hooks/useWalletConnectMachine.ts`:
  - Accept chainId, safeAddress as input
  - Return connection state, sessions, and action functions
  - Implement session persistence for page refresh

- [ ] T030 [US2] Integrate into WalletConnectContext in `apps/web/src/features/walletconnect/components/WalletConnectContext/index.tsx`:
  - Replace 5 cascading useEffects with useWalletConnectMachine
  - Feature flag for gradual rollout
  - Preserve existing context API

- [ ] T031 [US2] Run tests to verify all US2 tests pass: `yarn workspace @safe-global/web test --testPathPattern="walletConnectMachine|walletconnect.*persistence"`

**Checkpoint**: WalletConnect sessions initialize once, handle requests correctly, persist across refreshes

---

## Phase 5: User Story 3 - Consistent Safe Creation Progress (Priority: P3)

**Goal**: Implement SafeCreationMachine that accurately tracks deployment progress without conflicting UI states

**Independent Test**: Complete Safe creation flow end-to-end, verify each step displays correctly, final redirect only after on-chain confirmation

### Tests for User Story 3

- [ ] T032 [P] [US3] Create unit test file `apps/web/src/features/safe-creation/machines/safeCreationMachine.test.ts` with test cases for:
  - Initial state is 'idle'
  - Validation state transitions
  - DEPLOY transitions to 'deploying'
  - TX_MINED transitions to 'indexing'
  - INDEXED transitions to 'success'
  - Error handling for each state
  - Browser refresh persistence

### Implementation for User Story 3

- [ ] T033 [P] [US3] Create Safe creation machine types in `apps/web/src/features/safe-creation/machines/types.ts`

- [ ] T034 [US3] Implement SafeCreationMachine in `apps/web/src/features/safe-creation/machines/safeCreationMachine.ts`:
  - Define states: idle, validating, deploying, processing, indexing, success, failed
  - Implement context with owners, threshold, saltNonce, predictedAddress, deploymentTxHash
  - Handle on-chain confirmation before success transition

- [ ] T035 [US3] Implement Safe creation invoked services in `apps/web/src/features/safe-creation/machines/services.ts`:
  - validateSafeParams: fromPromise for parameter validation
  - deploySafe: fromPromise for deployment transaction
  - watchDeployment: fromCallback for deployment monitoring

- [ ] T036 [US3] Create useSafeCreationMachine hook in `apps/web/src/features/safe-creation/hooks/useSafeCreationMachine.ts`

- [ ] T037 [US3] Integrate into Safe creation StatusStep in `apps/web/src/components/new-safe/create/steps/StatusStep/index.tsx`:
  - Replace safeCreationSubscribe pattern with machine
  - Ensure redirect only on 'success' state
  - Feature flag for gradual rollout

- [ ] T038 [US3] Run tests to verify all US3 tests pass: `yarn workspace @safe-global/web test --testPathPattern="safeCreationMachine"`

**Checkpoint**: Safe creation shows accurate progress, no premature success states

---

## Phase 6: User Story 4 - Debuggable State Transitions for Developers (Priority: P4)

**Goal**: Provide developer tooling integration for state inspection and debugging

**Independent Test**: Enable dev tools, trigger flows, verify transitions logged with full context

### Tests for User Story 4

- [ ] T039 [P] [US4] Create unit test for logging inspector in `apps/web/src/features/tx-flow/machines/inspector.test.ts`

### Implementation for User Story 4

- [ ] T040 [US4] Create state machine inspector in `apps/web/src/features/tx-flow/machines/inspector.ts`:
  - Log transitions with source state, event, target state
  - Include guard evaluation results
  - Conditional enable based on development mode

- [ ] T041 [US4] Add inspector integration to TransactionMachine in `apps/web/src/features/tx-flow/machines/transactionMachine.ts`:
  - Connect inspector via machine.inspect option
  - Enable in development builds only

- [ ] T042 [US4] Add inspector integration to WalletConnectMachine in `apps/web/src/features/walletconnect/machines/walletConnectMachine.ts`

- [ ] T043 [US4] Add inspector integration to SafeCreationMachine in `apps/web/src/features/safe-creation/machines/safeCreationMachine.ts`

- [ ] T044 [US4] Create developer documentation for state machine debugging in `apps/web/docs/state-machines.md`

- [ ] T045 [US4] Run tests to verify US4 tests pass: `yarn workspace @safe-global/web test --testPathPattern="inspector"`

**Checkpoint**: Developers can inspect state transitions, understand flow logic, debug issues

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T046 Run full type-check: `yarn workspace @safe-global/web type-check`
- [ ] T047 Run full lint: `yarn workspace @safe-global/web lint`
- [ ] T048 Run all XState-related tests: `yarn workspace @safe-global/web test --testPathPattern="machines|txEventBridge"`
- [ ] T049 [P] Verify bundle size impact is under 60KB gzipped per SC-005
- [ ] T050 [P] Update AGENTS.md with XState patterns if needed
- [ ] T051 [P] Create Storybook stories for transaction flow states in `apps/web/src/components/tx-flow/SafeTxProvider.stories.tsx` (if component has UI states to demonstrate)
- [ ] T052 Remove feature flags and make XState the default (after validation)
- [ ] T053 Run quickstart.md validation: manually test patterns from `specs/001-xstate-state-management/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Can start immediately after Foundational
  - US2 (P2): Can start after Foundational, independent of US1
  - US3 (P3): Can start after Foundational, independent of US1/US2
  - US4 (P4): Depends on at least one machine existing (US1 preferred)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Independent of US1, uses same foundation
- **User Story 3 (P3)**: Can start after Foundational - Independent of US1/US2
- **User Story 4 (P4)**: Best started after US1 complete (needs machine to inspect)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Types before machine definition
- Guards and actions before machine definition
- Machine before hook
- Hook before integration
- Integration before validation tests

### Parallel Opportunities

**Phase 1 (Setup)**:

- T003, T004, T005 can run in parallel (different directories)

**Phase 2 (Foundational)**:

- T008, T009, T010 can run in parallel (different files)

**Phase 3 (US1)**:

- T012, T013, T014 can run in parallel (different test files)

**Phase 4-6 (US2-US4)**:

- T024, T025 can run in parallel
- T032 standalone
- T039 standalone

**User Stories can run in parallel** if team has capacity

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create unit test file apps/web/src/features/tx-flow/machines/transactionMachine.test.ts"
Task: "Create unit test for guards in apps/web/src/features/tx-flow/machines/guards.test.ts"
Task: "Create unit test for EventBus bridge in apps/web/src/services/tx/txEventBridge.test.ts"

# Then sequentially:
Task: "Implement TransactionMachine..."
Task: "Implement guards..."
Task: "Implement actions..."
Task: "Implement services..."
Task: "Create useTransactionMachine hook..."
Task: "Integrate into SafeTxProvider..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Transaction Flow)
4. **STOP and VALIDATE**: Test transaction signing flow end-to-end
5. Deploy with feature flag enabled for testing
6. Validate SC-001 (zero UI state inconsistencies)

### Incremental Delivery

1. **Foundation** → Setup + Foundational → Ready for features
2. **Add US1** → Transaction flow predictable → Deploy/Demo (MVP!)
3. **Add US2** → WalletConnect reliable → Deploy/Demo
4. **Add US3** → Safe creation consistent → Deploy/Demo
5. **Add US4** → Developer tooling → Deploy/Demo
6. **Polish** → Remove flags, cleanup → Production ready

### Parallel Team Strategy

With 2+ developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Transaction - highest impact)
   - Developer B: User Story 2 (WalletConnect)
3. After US1/US2:
   - Developer A: User Story 3 (Safe Creation)
   - Developer B: User Story 4 (Dev Tooling)
4. Both: Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Feature flags enable gradual rollout per story
- Each user story is independently testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total bundle budget: <60KB gzipped (current estimate: ~29KB)
