# Design System Requirements

## Overview

Create a new shared package `@safe-global/design-system` that connects to Figma via MCP server, allowing designers to sync design tokens, generate components, Storybook stories, and documentation through AI-assisted PRs.

## Current Status (Updated: January 2026)

**Implemented:**

- ✅ Figma MCP integration configured and working
- ✅ Design token system (JSON → TypeScript/CSS/Tailwind)
- ✅ Shadcn v2 with CLI for web components
- ✅ Initial components: Button, Card, Input, Label
- ✅ Storybook with Figma design links
- ✅ Automated validation scripts (`validate:all`, `validate:sync`)
- ✅ Comprehensive testing patterns (Figma fidelity tests)
- ✅ Token naming conventions and workflows

**In Progress:**

- ⏳ Expanding component library (target: 15+ components)
- ⏳ Mobile component integration (Tamagui wrappers)
- ⏳ Code Connect setup (optional enhancement)

**Next Steps:**

- Add remaining core components (Dialog, Dropdown, Alert, etc.)
- Expand documentation with more examples
- Set up visual regression testing (Chromatic)
- Train team on AI-driven workflow

## Goals

1. **Single Source of Truth**: Figma as the canonical source for design decisions
2. **Cross-Platform Consistency**: Shared design tokens between web and mobile
3. **Designer Autonomy**: Designers can sync changes and create PRs via Claude + Figma MCP
4. **Gradual Migration**: Coexist with existing MUI components (web) and Tamagui (mobile)
5. **Best-in-Class Tools**: Use modern, platform-appropriate component libraries

## Outputs

The Figma MCP integration will generate:

1. **Design Tokens**: Colors, spacing, typography, radius, shadows (JSON → TypeScript/CSS/Tailwind)
2. **Component Code**: Dual implementations
   - Web: Shadcn/ui (Radix UI + Tailwind CSS)
   - Mobile: Tamagui wrappers
3. **Storybook Stories**: Auto-generated with Figma links
4. **Documentation**: Component usage guides in Markdown

## Key Decisions

### Component Libraries

- **Web**: **Shadcn v2** (Radix UI primitives + Tailwind CSS) with CLI support
  - Rationale: CLI-based component installation, copy-paste components with full control, stays in React DOM, easier migration from MUI
  - Configuration: `new-york` style, `slate` base color, CSS variables for theming, Lucide icons
  - Current components: Button, Card, Input, Label (added via CLI)
- **Mobile**: Tamagui (continue existing, focus on web first)
  - Rationale: Already used in mobile app, excellent React Native performance

### Sync Strategy

- **Manual via Claude + Figma MCP** (designer-controlled PRs)
  - Rationale: Design context in PRs, designer control, simpler than automation

### Integration Approach

- **Coexistence** with existing components
  - Rationale: Gradual migration, no forced timeline, lower risk

## Success Metrics

1. **Adoption**: 80% of new UI features use design system within 3 months (🟡 In Progress)
2. **Token Coverage**: 100% of colors/spacing use tokens within 2 months (🟡 In Progress)
3. **Sync Frequency**: 2+ Figma syncs per month (✅ Achieved - workflow established)
4. **Component Library**: 15+ components within 4 months (🟡 4/15 components complete)
5. **Developer Satisfaction**: >4/5 in DX survey (⏳ Pending survey)

## User Personas

### Designers

**Workflow**:

1. Update Figma (color styles, text styles, components)
2. Run Claude with Figma MCP: "Sync design tokens to Safe Wallet"
3. Review generated PR (tokens, components, stories)
4. Merge after CI validation

**Needs**:

- Clear Figma naming conventions
- Simple sync command
- Visual preview (Chromatic)
- Design decision documentation in PRs

### Web Developers

**Workflow**:

1. Import design system components: `import { Button } from '@safe-global/design-system/web'`
2. Use Tailwind classes with design tokens
3. Reference Storybook for component API

**Needs**:

- Clear migration guide from MUI
- Coexistence with existing MUI
- TypeScript types
- Comprehensive Storybook documentation

### Mobile Developers

**Workflow**:

1. Import design system components: `import { Button } from '@safe-global/design-system/mobile'`
2. Use Tamagui with design system theme

**Needs**:

- Minimal changes (Tamagui already used)
- Token parity with web
- Theme configuration

## Migration Strategy

### Phase 1: Tokens Only (Weeks 1-2)

- Implement token system
- Generate Tailwind config
- Add Tailwind to web app (alongside MUI)
- Update mobile Tamagui config

### Phase 2: New Features (Weeks 3-6)

- New features MUST use design system components
- Expand component library

### Phase 3: Incremental Refactoring (Weeks 7-12)

- Refactor existing features one at a time
- High-traffic pages first

### Phase 4: Deprecation (Month 4+)

- Mark old custom components as deprecated
- Plan removal timeline

## Dependencies

**Already in monorepo**:

- Yarn 4 workspace
- TypeScript (~5.9.2)
- Storybook v8 (web)
- Chromatic (web)
- Tamagui (mobile)

**New for design system**:

- **Web**: Shadcn v2 CLI, Tailwind CSS, PostCSS, Radix UI primitives (via Shadcn), CVA, clsx, tailwind-merge
- **Mobile**: Import Tamagui from existing mobile setup (web focus initially)
- **Build tools**: Handlebars (templates for custom components), Zod (validation)
- **Designer tools**: Figma MCP server (local setup)
- **Testing**: Jest, Testing Library, ts-jest

## Risks & Mitigations

| Risk                                        | Mitigation                                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| Token drift between Figma and code          | Automated validation in CI, weekly sync reminders                             |
| Component generation produces invalid code  | Comprehensive templates, manual review required for all PRs                   |
| Maintaining 2 component implementations     | Generate both from same Figma component, shared tokens ensure consistency     |
| Tailwind conflicts with existing MUI styles | Tailwind preflight can be disabled, use scoped approach                       |
| Designer learning curve                     | Comprehensive training, video walkthrough, ongoing support                    |
| Adoption resistance                         | Clear migration guide, coexistence strategy, executive sponsorship            |
| Web and mobile UIs diverging                | Regular design reviews, Figma as single source of truth, automated token sync |
