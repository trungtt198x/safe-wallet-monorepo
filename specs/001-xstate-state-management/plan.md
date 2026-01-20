# Implementation Plan: XState State Management Refactoring

**Branch**: `001-xstate-state-management` | **Date**: 2026-01-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-xstate-state-management/spec.md`

## Summary

Introduce XState v5 for managing complex stateful flows in Safe{Wallet} web application to replace effect chaining anti-patterns. The migration will be incremental, starting with the transaction lifecycle (P1), then WalletConnect sessions (P2), targeting zero UI state inconsistencies and 80% reduction in state-related bugs.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14.x
**Primary Dependencies**: XState v5 (new), React 18.x, Redux Toolkit, @safe-global/protocol-kit, @safe-global/api-kit
**Storage**: Browser localStorage (state persistence), Redux store (global state), IndexedDB (WalletConnect sessions)
**Testing**: Jest with React Testing Library, MSW for network mocking, @xstate/test for model-based testing
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - modern versions)
**Project Type**: Web application (monorepo workspace: apps/web)
**Performance Goals**: UI state updates within 500ms of transaction events; bundle size increase <60KB gzipped
**Constraints**: Backward compatibility with existing EventBus (TxEvent) and Redux store; incremental migration without feature regression
**Scale/Scope**: ~15 effect-chained components identified; 3 primary state machines (Transaction, WalletConnect, SafeCreation)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Check ✅

| Principle                         | Status  | Notes                                                                                                             |
| --------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| **I. Monorepo Unity**             | ✅ PASS | XState will be added to apps/web only; no shared package changes required. Redux store interface preserved.       |
| **II. Type Safety**               | ✅ PASS | XState v5 has first-class TypeScript support with typed states, events, context. No `any` types needed.           |
| **III. Test-First Development**   | ✅ PASS | @xstate/test enables model-based testing; existing MSW patterns will be preserved for network mocking.            |
| **IV. Design System Compliance**  | ✅ PASS | No UI component changes; state machines manage logic only. Existing MUI components unchanged.                     |
| **V. Safe-Specific Security**     | ✅ PASS | Transaction building continues via Safe SDK; state machines orchestrate but don't modify security-critical logic. |
| **Architecture: Features folder** | ✅ PASS | New state machines will be co-located in `src/features/` per existing patterns.                                   |
| **Architecture: Feature flags**   | ✅ PASS | Migration can be feature-flagged to enable gradual rollout.                                                       |

**Gate Result**: PASS - No violations. Proceeded to Phase 0.

### Post-Phase 1 Re-check ✅

| Principle                         | Status  | Notes                                                                            |
| --------------------------------- | ------- | -------------------------------------------------------------------------------- |
| **I. Monorepo Unity**             | ✅ PASS | Design confirms XState isolated to apps/web. Event contracts are internal.       |
| **II. Type Safety**               | ✅ PASS | Full TypeScript contracts defined in `contracts/`. No `any` types in interfaces. |
| **III. Test-First Development**   | ✅ PASS | Quickstart includes test patterns. @xstate/graph for model verification.         |
| **IV. Design System Compliance**  | ✅ PASS | No UI changes in design. State machines manage logic only.                       |
| **V. Safe-Specific Security**     | ✅ PASS | Data model preserves Safe SDK usage. No security-critical changes.               |
| **Architecture: Features folder** | ✅ PASS | Structure shows `machines/` under features.                                      |
| **Architecture: Feature flags**   | ✅ PASS | Research confirms feature flag support for incremental migration.                |

**Gate Result**: PASS - Ready for Phase 2 (task generation).

## Project Structure

### Documentation (this feature)

```text
specs/001-xstate-state-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (internal event contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
apps/web/src/
├── features/
│   ├── tx-flow/                    # NEW: Transaction state machine feature
│   │   ├── machines/
│   │   │   ├── transactionMachine.ts
│   │   │   ├── transactionMachine.test.ts
│   │   │   └── types.ts
│   │   ├── hooks/
│   │   │   └── useTransactionMachine.ts
│   │   └── index.ts
│   ├── walletconnect/              # MODIFY: Add WalletConnect state machine
│   │   ├── machines/
│   │   │   ├── walletConnectMachine.ts
│   │   │   └── types.ts
│   │   └── ...existing files...
│   └── safe-creation/              # MODIFY: Add creation state machine
│       ├── machines/
│       │   └── safeCreationMachine.ts
│       └── ...existing files...
├── services/
│   └── tx/
│       └── txEvents.ts             # MODIFY: Add state machine event bridge
├── hooks/
│   └── useTxPendingStatuses.ts     # MODIFY: Replace with state machine
└── components/
    └── tx-flow/
        └── SafeTxProvider.tsx      # MODIFY: Integrate transaction machine
```

**Structure Decision**: Follow existing monorepo feature architecture. State machines are co-located within their respective features under a `machines/` subdirectory. This maintains the established pattern where feature-specific code lives in `src/features/`.

## Complexity Tracking

> No violations requiring justification. Standard feature addition within existing architecture.
