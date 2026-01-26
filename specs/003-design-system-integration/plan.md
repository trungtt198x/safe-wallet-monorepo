# Implementation Plan: Design System Integration

**Branch**: `003-design-system-integration` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-design-system-integration/spec.md`

## Summary

Implement a shadcn/ui-based design system for the Safe{Wallet} web application with design tokens synced from Figma. The system will coexist with the existing MUI/`@safe-global/theme` system, enabling gradual adoption for new features while maintaining backwards compatibility.

**Key Technical Decisions:**
- Figma MCP for token extraction (CLI command using `get_variable_defs`)
- shadcn/ui as component foundation (accessible, customizable)
- Parallel token systems: shadcn CSS variables for new components, existing MUI theme for legacy
- Storybook for component documentation and visual QA

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14.x)  
**Primary Dependencies**: shadcn/ui, @radix-ui/*, tailwindcss, Storybook 8.x, Figma MCP  
**Storage**: N/A (design tokens stored as CSS variables and config files)  
**Testing**: Jest, Storybook interaction tests, Lost Pixel (visual regression)  
**Target Platform**: Web (Next.js), tokens consumable by mobile (Expo/Tamagui)  
**Project Type**: Monorepo - new package + web feature  
**Performance Goals**: Token sync <5 min, Storybook hot-reload <2s, component render <16ms  
**Constraints**: Must coexist with existing `@safe-global/theme` and MUI components  
**Scale/Scope**: ~15 color tokens, ~5 spacing tokens, ~4 typography scales, initial 10-15 atoms

### shadcn/ui Configuration

**Initialization Command:**
```bash
cd apps/web
yarn dlx shadcn@latest init --preset "https://ui.shadcn.com/init?base=base&style=nova&baseColor=neutral&theme=amber&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=large&template=next"
```

**Preset Settings:**
| Setting | Value | Override |
|---------|-------|----------|
| Style | nova | - |
| Base Color | neutral | - |
| Theme | amber | Override with Figma tokens |
| Icon Library | lucide | - |
| Font | Inter → **DM Sans** | Use existing project font |
| Radius | large | Matches Figma (16px, 24px) |
| Template | next | - |

**Font Note:** The preset uses Inter, but we override with DM Sans to match Figma tokens and existing project typography.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety | ✅ PASS | shadcn/ui is TypeScript-native; CLI tool will be fully typed |
| II. Branch Protection | ✅ PASS | Following standard feature branch workflow |
| III. Cross-Platform | ✅ PASS | Tokens in CSS variable format consumable by mobile; components web-only (as specified) |
| IV. Testing Discipline | ✅ PASS | Will use Jest + MSW for CLI tests; Storybook for component tests |
| V. Feature Organization | ✅ PASS | Design system goes in `packages/design-system/`; web integration in `apps/web/src/features/design-system/` |
| VI. Theme System Integrity | ⚠️ JUSTIFIED | Creating PARALLEL theme system (not replacing `@safe-global/theme`). Coexistence documented. See Complexity Tracking. |

**Pre-Phase 0 Gate**: PASS (1 justified violation)

### Post-Phase 1 Re-evaluation

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety | ✅ PASS | CLI contract fully typed; components use TypeScript interfaces |
| II. Branch Protection | ✅ PASS | No changes to workflow |
| III. Cross-Platform | ✅ PASS | Token CSS variables can be consumed by mobile; documented in quickstart |
| IV. Testing Discipline | ✅ PASS | Test contracts defined in token-sync-cli.md |
| V. Feature Organization | ✅ PASS | Package structure defined; Storybook stories required |
| VI. Theme System Integrity | ⚠️ JUSTIFIED | Parallel system documented in research.md §6; clear boundary rules defined |

**Post-Phase 1 Gate**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/003-design-system-integration/
├── plan.md              # This file
├── research.md          # Phase 0: Technology research
├── data-model.md        # Phase 1: Token and component structure
├── quickstart.md        # Phase 1: Developer onboarding guide
├── contracts/           # Phase 1: CLI interface contracts
│   └── token-sync-cli.md
└── tasks.md             # Phase 2: Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
packages/design-system/           # NEW: Design system package
├── src/
│   ├── tokens/                   # Token definitions and sync output
│   │   ├── colors.css            # CSS variables for colors
│   │   ├── spacing.css           # CSS variables for spacing
│   │   ├── typography.css        # CSS variables for typography
│   │   └── index.css             # Combined token export
│   ├── cli/                      # Token sync CLI
│   │   ├── sync-tokens.ts        # Main CLI entry point
│   │   ├── figma-client.ts       # Figma MCP integration
│   │   └── transform.ts          # Token transformation logic
│   └── index.ts                  # Package exports
├── package.json
└── tsconfig.json

apps/web/
├── src/
│   ├── features/design-system/   # NEW: Feature flag & integration
│   │   ├── index.ts              # Public API
│   │   └── components/           # Re-exports of shadcn components
│   ├── components/ui/            # NEW: shadcn/ui components (generated)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── styles/
│       └── design-system.css     # NEW: Import for new token system
├── .storybook/                   # Existing, enhanced for design system
│   └── preview.tsx               # Add token documentation
└── tailwind.config.ts            # NEW: Tailwind config for shadcn
```

**Structure Decision**: 
- New `packages/design-system` for shared token definitions and sync CLI
- Web-specific shadcn components in `apps/web/src/components/ui/` (standard shadcn location)
- Feature integration layer in `apps/web/src/features/design-system/`
- Tokens imported via CSS, consumed by both new shadcn components and potentially mobile

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Parallel theme system (VI. Theme System Integrity) | Gradual migration without breaking existing MUI components | Replacing `@safe-global/theme` would require migrating all existing components simultaneously - too risky and scope too large |

## Phase Dependencies

```
Phase 0: Research
    ↓
Phase 1: Design & Contracts
    ↓
Phase 2: Tasks (via /speckit.tasks)
    ↓
Implementation
```

## Artifacts Generated

- [x] plan.md (this file)
- [x] research.md (Phase 0)
- [x] data-model.md (Phase 1)
- [x] contracts/token-sync-cli.md (Phase 1)
- [x] quickstart.md (Phase 1)
