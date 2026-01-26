# Feature Specification: Design System Integration

**Feature Branch**: `003-design-system-integration`  
**Created**: 2026-01-26  
**Status**: Draft  
**Input**: User description: "The designer and a dev want to implement a new design system. We want to use shadcn using base UI. We want to be able to import tokens from figma. We want to be able to (ideally) display tokens, but for sure atoms and components in storybook. We need a way to communicate from figma to code and from design to dev. We want to be able to build screens and molecules etc from the implemented design system. The source of truth for tokens is figma, but we need a way to log components in code, so product and devs can iterate quickly and prototype fast. We also want to experiment with a new workflow for design. They want to switch to code and have code as the main source of truth, experiment in code, etc. The idea is not to have figma as the place where the final design is decided, so the transition from figma to code, which is a source of friction, is reduced."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Import Design Tokens from Figma (Priority: P1)

As a developer, I want to import design tokens (colors, spacing, typography, radii, shadows) from Figma so that the codebase stays synchronized with the design source of truth.

**Why this priority**: Design tokens are the foundation of the entire design system. Without tokens, atoms and components cannot be built consistently. This enables the entire downstream workflow.

**Independent Test**: Can be fully tested by exporting tokens from Figma and verifying they appear correctly formatted in the codebase, ready for consumption by components.

**Acceptance Scenarios**:

1. **Given** a Figma file with defined design tokens, **When** a developer triggers the token sync process, **Then** the tokens are exported and transformed into code-consumable format (CSS variables, TypeScript constants, or theme config)
2. **Given** tokens have been updated in Figma, **When** a developer re-syncs tokens, **Then** only changed tokens are updated and existing component usage remains valid
3. **Given** a token sync has completed, **When** a developer inspects the output, **Then** tokens are organized by category (colors, spacing, typography, shadows, radii)

---

### User Story 2 - View Components in Storybook (Priority: P1)

As a designer or developer, I want to view atoms, molecules, and components in Storybook so that I can verify implementations, explore variations, and share a living component library with the team.

**Why this priority**: Storybook is the central documentation and testing ground for the design system. It enables rapid iteration, visual QA, and serves as the communication bridge between design and development.

**Independent Test**: Can be fully tested by running Storybook and verifying that components render correctly with all their variants and states documented.

**Acceptance Scenarios**:

1. **Given** a component exists in the design system, **When** a user opens Storybook, **Then** the component is listed with its variants, props, and usage documentation
2. **Given** Storybook is running, **When** a user selects a component, **Then** they can interact with it, modify props via controls, and see live updates
3. **Given** design tokens have been imported, **When** a user views the token documentation in Storybook, **Then** they can see a visual catalog of all available tokens (colors, spacing, typography)

---

### User Story 3 - Build Atoms Using shadcn/ui (Priority: P2)

As a developer, I want to build foundational UI atoms (buttons, inputs, labels, badges) using shadcn/ui so that I have accessible, customizable base components that consume design tokens.

**Why this priority**: Atoms are the building blocks for all higher-level components. Using shadcn/ui provides a proven, accessible foundation that can be themed with imported tokens.

**Independent Test**: Can be fully tested by creating an atom component, verifying it uses design tokens, passes accessibility checks, and renders in Storybook.

**Acceptance Scenarios**:

1. **Given** shadcn/ui is configured in the project, **When** a developer adds a new atom component, **Then** it automatically inherits design tokens and follows the established patterns
2. **Given** an atom component exists, **When** a developer views it in Storybook, **Then** all variants (sizes, states, colors) are documented and interactive
3. **Given** design tokens are updated, **When** a developer rebuilds the project, **Then** atom components reflect the new token values without code changes

---

### User Story 4 - Compose Molecules and Screens (Priority: P2)

As a developer, I want to compose molecules (form groups, card headers, navigation items) and screens from atoms and components so that I can rapidly build consistent UIs.

**Why this priority**: Molecules and screens represent the practical application of the design system. This validates that the atomic design approach scales to real product needs.

**Independent Test**: Can be fully tested by creating a molecule that composes multiple atoms, then building a screen that uses molecules, and verifying consistency in Storybook.

**Acceptance Scenarios**:

1. **Given** atoms exist in the design system, **When** a developer creates a molecule, **Then** it composes atoms following documented patterns and appears in Storybook
2. **Given** molecules and atoms exist, **When** a developer builds a screen, **Then** the screen maintains visual consistency and uses only design system components
3. **Given** a screen is built, **When** viewed in Storybook, **Then** the screen is documented with its composition hierarchy visible

---

### User Story 5 - Experiment with Code-First Design (Priority: P3)

As a designer or developer, I want to experiment with design changes directly in code so that I can iterate quickly without the friction of Figma-to-code handoff.

**Why this priority**: This represents the experimental workflow goal. While Figma remains the token source of truth, enabling code-first experimentation for components and layouts reduces iteration cycles.

**Independent Test**: Can be fully tested by modifying a component in code, viewing changes instantly in Storybook, and having the change immediately available for product review.

**Acceptance Scenarios**:

1. **Given** Storybook is running in development mode, **When** a developer modifies a component's styling or structure, **Then** changes are reflected immediately via hot reload
2. **Given** a new component variant is created in code, **When** the team reviews it in Storybook, **Then** product and design can provide feedback without needing Figma updates first
3. **Given** an experimental component iteration is approved, **When** the team wants to update Figma, **Then** the code serves as the reference for updating design files (reverse sync documentation)

---

### Edge Cases

- How does the system handle missing or malformed tokens during Figma sync?
- What happens when a shadcn component uses a token that gets deleted in Figma?
- How are breaking token changes communicated to the development team?
- What happens when a new feature needs to integrate with an existing MUI-based feature?

## Requirements _(mandatory)_

### Scope

**In Scope (Phase 1)**:
- Design tokens shared across web and mobile platforms (foundation layer)
- Component library (atoms, molecules, screens) for web only using shadcn/ui
- Token coexistence via parallel systems: shadcn CSS variables (from Figma) for new components, existing `@safe-global/theme` for MUI components

**Out of Scope (Phase 1)**:
- Mobile component library (Tamagui components)
- Migration of existing MUI components to shadcn
- Full migration/removal of existing `@safe-global/theme` tokens
- Reverse sync from code to Figma

### Functional Requirements

- **FR-001**: System MUST provide a CLI command to import design tokens from Figma using Figma MCP (`get_variable_defs`)
- **FR-002**: System MUST transform Figma tokens into shadcn/ui CSS variable format (e.g., `--primary`, `--background`, `--border`)
- **FR-003**: System MUST support organizing tokens by category (colors, spacing, typography, shadows, radii, breakpoints)
- **FR-004**: System MUST integrate shadcn/ui as the base component library
- **FR-005**: System MUST display all design system components (atoms, molecules, screens) in Storybook
- **FR-006**: System MUST display design tokens visually in Storybook for reference and documentation
- **FR-007**: System MUST support hot-reload for component development to enable rapid iteration
- **FR-008**: System MUST provide a component creation workflow that enforces design system patterns
- **FR-009**: System MUST support documenting component variants, props, and usage examples in Storybook
- **FR-010**: System MUST maintain backwards compatibility when tokens are updated (graceful degradation for missing tokens)
- **FR-011**: New features MUST use the shadcn-based design system; existing MUI features remain unchanged until intentional migration

### Key Entities

- **Design Token**: A named value representing a design decision (color, spacing, typography, shadow, radius). Attributes: name, value, category, description. Source of truth: Figma.

### Token Structure (from Figma "Foundations" collection)

**Colors** (shadcn-compatible naming, light mode shown - dark mode also defined):
- `background` (#f4f4f4), `foreground` (#121312)
- `card` (#fbfbfb), `card-foreground` (#353835)
- `muted-foreground` (#a3aaa3), `text muted` (#cad0cc)
- `border` (#f4f4f4), `border surface` (#ffffff)
- `state positive` (#00b460), `bg state positive` (#e5f6ec)
- `state negative` (#ff5f72), `bg state negative` (#ffe8eb)
- `Core/Safe Black` (#121312)

**Typography** (DM Sans font family):
- Title: Bold 18/22, Subtitle: Medium 16/22, Body: Regular 14/20, Small/Caption: Regular 12/16

**Spacing**: 4, 8, 12, 16, 32 (space-1 through space/xl)

**Radius**: lg (16), xl (24)
- **Atom**: A foundational UI component (button, input, label, icon). Cannot be broken down further. Composed using design tokens.
- **Molecule**: A composed UI pattern made from multiple atoms (form field with label, card header). Represents a reusable UI pattern.
- **Component**: A self-contained UI element that may be an atom, molecule, or more complex composition. Has defined props, variants, and states.
- **Screen**: A full page or view composed of molecules and components. Represents an actual product interface.
- **Component Story**: A Storybook entry documenting a component's variants, props, and interactive examples.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Design tokens can be synced from Figma to code in under 5 minutes with clear success/failure feedback
- **SC-002**: 100% of design system components (atoms, molecules) have Storybook stories with interactive controls
- **SC-003**: Developers can create a new atom component and see it in Storybook within 10 minutes of starting
- **SC-004**: Design tokens are visible in Storybook, organized by category, within 1 minute of opening the documentation
- **SC-005**: Component changes are reflected in Storybook via hot-reload in under 2 seconds
- **SC-006**: Team members (designers, developers, product) can access and navigate the component library without technical setup (deployment approach TBD - leverage existing PR staging or dedicated Storybook hosting)
- **SC-007**: Time from component idea to reviewable prototype is reduced by 50% compared to the Figma-first workflow
- **SC-008**: 90% of new UI development uses design system components rather than custom implementations

## Clarifications

### Session 2026-01-26

- Q: Target platform scope? → A: Both platforms for tokens (shared foundations), web-only for components. First phase includes token coexistence (new tokens alongside existing tokens during migration). This means having two separate foundations.
- Q: Token naming strategy for coexistence? → A: Separate systems - new shadcn components use shadcn CSS variable conventions (populated from Figma), existing MUI components continue using `@safe-global/theme`. No naming conflicts as they're consumed differently.
- Q: Token sync trigger mechanism? → A: Manual CLI command - developer explicitly runs sync when needed.
- Q: New component system choice criteria? → A: New features use shadcn-based design system, existing features stay MUI until intentionally migrated.
- Q: Storybook access for non-technical stakeholders? → A: Deployment approach TBD. Existing infrastructure: PR staging deploys + Lost Pixel for visual regression. Chromatic is under consideration. Decision deferred to planning phase.
- Q: Token import mechanism? → A: Use Figma MCP (`get_variable_defs` tool) to fetch design tokens directly from Figma. Source URL: https://www.figma.com/design/SX3PdSxgY0D7vfGx2ytRWU/DS-%C2%B7-Foundations?node-id=95-2000&m=dev (node-id 95:2000 contains the "Foundations" variable collection)

## Assumptions

- The team has access to Figma with design tokens defined in "DS · Foundations" file (node-id 95:2000 for variables)
- Figma variables already use shadcn-compatible naming (`background`, `foreground`, `card`, `border`, etc.) with light/dark modes
- The existing codebase can accommodate shadcn/ui integration (React-based)
- Storybook is already configured or can be added to the project
- The team is willing to adopt a code-first experimentation workflow for component iteration
- Figma remains the source of truth for tokens, but components can evolve in code first
- Existing `@safe-global/theme` tokens will coexist with new Figma-synced tokens during migration; no breaking changes to existing components
- Mobile platform will consume shared tokens but component implementation is deferred to a future phase
- Existing infrastructure includes PR staging deploys and Lost Pixel for visual regression testing
