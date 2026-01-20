# Feature Specification: XState State Management Refactoring

**Feature Branch**: `001-xstate-state-management`
**Created**: 2026-01-20
**Status**: Draft
**Input**: User description: "Evaluate and introduce XState for complex state management to replace effect chaining anti-patterns"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Predictable Transaction Flow States (Priority: P1)

As a user signing and executing multi-signature transactions, I need the transaction flow UI to behave predictably so that I always know the current state of my transaction and what actions I can take.

**Why this priority**: Transaction signing/execution is the core functionality of Safe Wallet. Users currently experience UI inconsistencies due to effect chains where state updates cascade through multiple useEffect hooks, causing race conditions and stale state displays.

**Independent Test**: Can be fully tested by initiating a transaction signing flow and verifying that each state transition (idle → signing → proposing → awaiting signatures → executable → executing → processing → success/failed) displays correctly with appropriate UI feedback and available actions.

**Acceptance Scenarios**:

1. **Given** a user is on the transaction review screen, **When** they initiate signing, **Then** the UI must show "Signing" state immediately without flickering to intermediate states
2. **Given** a transaction is in "awaiting signatures" state, **When** another owner signs, **Then** the signature count updates and the UI reflects whether execution is now possible
3. **Given** a transaction is being executed, **When** the on-chain confirmation completes, **Then** the UI transitions to "Success" state without requiring manual refresh
4. **Given** any network error occurs during a state transition, **When** the error is caught, **Then** the UI shows the appropriate error state with retry options without getting stuck in an invalid state

---

### User Story 2 - Reliable WalletConnect Session Management (Priority: P2)

As a user connecting dApps via WalletConnect, I need sessions to initialize, connect, and handle requests reliably without the UI getting stuck in loading states or missing session events.

**Why this priority**: WalletConnect integration currently has 5 cascading useEffect hooks that depend on initialization state. This causes race conditions where session requests arrive before handlers are attached, or sessions appear disconnected when they are actually active.

**Independent Test**: Can be fully tested by connecting a dApp via WalletConnect QR code, verifying session establishment, and confirming request handling works correctly across page refreshes and browser sessions.

**Acceptance Scenarios**:

1. **Given** WalletConnect is not initialized, **When** a user navigates to a Safe, **Then** WalletConnect initializes exactly once and session state is consistent
2. **Given** an active WalletConnect session exists, **When** a dApp sends a transaction request, **Then** the request is captured and displayed regardless of when it arrives relative to component mounting
3. **Given** multiple WalletConnect sessions are active, **When** a user disconnects one session, **Then** only that session is removed and others remain functional
4. **Given** the user refreshes the page, **When** WalletConnect re-initializes, **Then** existing sessions are restored and no duplicate initialization occurs

---

### User Story 3 - Consistent Safe Creation Progress (Priority: P3)

As a user creating a new Safe, I need the creation wizard to show accurate progress and handle all states (deploying, waiting for confirmation, success, error) without the UI displaying conflicting information.

**Why this priority**: Safe creation involves multiple async steps with event subscriptions that currently trigger state cascades. Users report seeing "Success" while still waiting for deployment, or getting stuck on progress screens.

**Independent Test**: Can be fully tested by completing the Safe creation flow end-to-end, verifying each step displays correctly, and confirming the final redirect only occurs after actual on-chain deployment confirmation.

**Acceptance Scenarios**:

1. **Given** a user has configured Safe parameters, **When** they submit creation, **Then** the progress indicator shows accurate deployment state
2. **Given** deployment is in progress, **When** the transaction is mined, **Then** the UI transitions to success only after on-chain confirmation
3. **Given** creation fails at any step, **When** the error occurs, **Then** the UI shows the failure reason and offers appropriate recovery options
4. **Given** a user closes and reopens the browser during creation, **When** they return, **Then** the creation status is accurately reflected

---

### User Story 4 - Debuggable State Transitions for Developers (Priority: P4)

As a developer debugging or extending the Safe Wallet, I need to understand what state the application is in and why specific transitions occurred, so I can diagnose issues and add features without introducing regressions.

**Why this priority**: Current state management through effect chains is difficult to trace. Developers spend significant time understanding state dependencies and debugging race conditions. Formal state machines provide visualizable, testable state diagrams.

**Independent Test**: Can be tested by enabling developer tools, triggering various flows, and verifying state transitions are logged with full context including guards, actions, and previous states.

**Acceptance Scenarios**:

1. **Given** development mode is enabled, **When** any state transition occurs, **Then** the transition is logged with source state, event, target state, and any guard conditions evaluated
2. **Given** a developer is investigating a bug, **When** they inspect the state machine, **Then** they can see the complete state history and pending events
3. **Given** a new feature requires state machine modifications, **When** a developer adds states or transitions, **Then** the type system prevents invalid state transitions at compile time

---

### Edge Cases

- What happens when a user initiates signing but loses network connectivity mid-flow?
- How does the system handle duplicate event emissions from the EventBus?
- What happens when a transaction state update arrives out-of-order from the backend?
- How does the system recover from a state machine entering an unexpected state?
- What happens when browser storage is cleared while a transaction is pending?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST implement a transaction lifecycle state machine with explicit states: idle, signing, proposing, awaiting_signatures, executable, executing, processing, indexing, success, and failed
- **FR-002**: System MUST ensure only valid state transitions are possible (e.g., cannot transition from "idle" directly to "processing")
- **FR-003**: System MUST provide guards that prevent invalid transitions based on current context (e.g., cannot execute without required signatures)
- **FR-004**: System MUST implement actions that execute side effects only during specific transitions (e.g., dispatch to backend only on "proposing" entry)
- **FR-005**: System MUST handle async operations (signing, network calls) as invoked services with timeout handling
- **FR-006**: System MUST preserve state machine context across browser refreshes for in-progress transactions
- **FR-007**: System MUST emit events that Redux listeners can consume to maintain backward compatibility with existing store slices
- **FR-008**: System MUST implement a WalletConnect session state machine with states: uninitialized, initializing, ready, connecting, connected, and error
- **FR-009**: System MUST support concurrent state machine instances for multiple pending transactions
- **FR-010**: System MUST provide development tooling integration for state inspection and time-travel debugging
- **FR-011**: System MUST maintain existing EventBus compatibility by translating state machine events to TxEvent emissions
- **FR-012**: System MUST implement retry logic for recoverable errors with configurable attempt limits

### Key Entities

- **TransactionMachine**: Represents the lifecycle of a single Safe transaction from creation through execution and confirmation
- **WalletConnectMachine**: Represents the WalletConnect service lifecycle including initialization, session management, and request handling
- **MachineContext**: Holds current transaction/session data, accumulated signatures, error information, and retry counts
- **MachineEvent**: Strongly-typed events that trigger state transitions (SIGN, PROPOSE, EXECUTE, CONFIRM, ERROR, etc.)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Zero UI state inconsistencies reported in transaction flows after migration (currently ~5 per month based on user reports)
- **SC-002**: Developers can understand and modify transaction flow logic 50% faster, measured by time-to-resolution for state-related bugs
- **SC-003**: State transition bugs are caught at compile time rather than runtime, reducing state-related production incidents by 80%
- **SC-004**: Users experience no regression in transaction flow completion rates (maintain current 98%+ success rate)
- **SC-005**: Bundle size increase stays under 60KB gzipped (XState v5 core)
- **SC-006**: Time from transaction submission to UI state update remains under 500ms on standard network conditions

## Assumptions

- XState v5 will be used as it offers smaller bundle size and improved TypeScript support
- Migration will be incremental, starting with transaction flow, then WalletConnect, with other flows migrated based on results
- Existing Redux store structure will be maintained; state machines will coordinate with Redux via listeners
- The existing EventBus system will be preserved for backward compatibility during migration
- State machine definitions will be co-located with their React integration code in the features directory structure
