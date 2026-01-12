# Safe Wallet Design System

Figma-connected design system for Safe Wallet, providing design tokens and components for both web and mobile platforms.

## Overview

This design system connects directly to Figma via MCP (Model Context Protocol), allowing designers to sync design tokens, generate components, and create pull requests using Claude AI.

**Key Features:**

- 🎨 **Figma as Source of Truth**: Design tokens synced directly from Figma
- 🌐 **Cross-Platform**: Shared tokens for web (Shadcn/Tailwind) and mobile (Tamagui)
- 🤖 **AI-Assisted**: Designers use Claude + Figma MCP to sync and generate code
- 📚 **Storybook**: Visual documentation with Figma design links
- ✅ **Type-Safe**: Full TypeScript support with generated types

## Architecture

- **Web**: Shadcn/ui components (Radix UI primitives + Tailwind CSS)
- **Mobile**: Tamagui components
- **Tokens**: Shared design tokens in JSON format

## Quick Start

### For AI-Driven Component Generation

1. **AI Instructions:** See [CLAUDE.md](./CLAUDE.md) for complete Figma sync workflow
2. **After syncing**, always run: `yarn validate:all`
3. **Setup:** See [FIGMA_MCP_SETUP.md](./FIGMA_MCP_SETUP.md) for Figma MCP configuration

### For Developers

```bash
# Use design tokens and components
import { Button, Card } from '@safe-global/design-system/web'
import '@safe-global/design-system/tokens.css'
```

## Figma MCP Setup

To sync design tokens from Figma, you need to configure the Figma MCP server:

📖 **See [FIGMA_MCP_SETUP.md](./FIGMA_MCP_SETUP.md) for complete setup instructions**

Quick setup:

1. Get your Figma Personal Access Token
2. Set `FIGMA_PERSONAL_ACCESS_TOKEN` in your shell config
3. Restart Claude Desktop
4. Run: "Sync design tokens from Figma"
5. **Always run**: `yarn validate:all` after syncing

## Installation

### For Web Apps

```bash
yarn add @safe-global/design-system
```

Add Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@safe-global/design-system/tailwind.config.js')],
  // ... your config
}
```

Import styles:

```typescript
// _app.tsx or layout.tsx
import '@safe-global/design-system/tokens.css'
```

### For Mobile Apps

```bash
yarn add @safe-global/design-system
```

Update Tamagui config:

```typescript
// tamagui.config.ts
import { tokens } from '@safe-global/design-system/tokens'

export default createTamagui({
  tokens: {
    color: tokens.color,
    space: tokens.spacing,
    // ... map other tokens
  },
})
```

## Usage

### Design Tokens

```typescript
import { tokens } from '@safe-global/design-system'

// Access tokens
const primaryColor = tokens.color.semantic.light.primary.main
const baseSpacing = tokens.spacing.base
```

### Web Components

```typescript
import { Button, Card, Input } from '@safe-global/design-system/web'

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

### Mobile Components

```typescript
import { Button, Card, Input } from '@safe-global/design-system/mobile'

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

## Development

```bash
# Install dependencies
yarn install

# Run Storybook
yarn storybook

# Run tests
yarn test

# Type-check
yarn type-check

# Validate design tokens (structure, 8px grid, hex colors)
yarn validate

# Validate Figma sync (CSS import, Tailwind config, tests, stories)
yarn validate:sync

# Validate everything (tokens + sync + type-check + tests)
yarn validate:all

# Sync from Figma (requires Figma MCP)
yarn sync
```

### Validation Scripts

**After syncing from Figma, always run:**

```bash
yarn validate:all
```

This comprehensive check ensures:

- ✅ Design tokens are valid (8px grid, valid colors, references)
- ✅ tokens.css is imported in globals.css (critical!)
- ✅ Tailwind config has all design tokens
- ✅ Components have Figma fidelity tests
- ✅ Storybook stories have Figma design links
- ✅ No TypeScript errors
- ✅ All tests pass

**Individual validation commands:**

```bash
yarn validate        # Token structure validation
yarn validate:sync   # Sync completeness check
yarn type-check      # TypeScript errors
yarn test            # Run all tests
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI assistant instructions for Figma sync ⭐
- [FIGMA_MCP_SETUP.md](./FIGMA_MCP_SETUP.md) - One-time Figma MCP setup
- [docs/visual-testing.md](./docs/visual-testing.md) - Testing strategies and patterns
- [docs/architecture.md](./docs/architecture.md) - Technical architecture details
- [docs/requirements.md](./docs/requirements.md) - Project goals and success metrics

## Storybook

View component documentation: `yarn storybook`

Storybook includes:

- Interactive component playground
- Auto-generated documentation
- Direct links to Figma designs
- Theme switching (light/dark)

## Contributing

### Adding a New Component

**Web (Shadcn v2):**

```bash
# Add a component via Shadcn CLI
npx shadcn@latest add <component-name>

# Example: Add alert dialog
npx shadcn@latest add alert-dialog

# Components are automatically added to src/web/components/ui/
```

**After adding a component:**

1. Customize to match Figma design (use design token classes)
2. Write comprehensive tests (including Figma fidelity)
3. Create Storybook story with Figma design link
4. Export in `src/web/index.ts`
5. Run `yarn validate:all` to verify

**Available Shadcn Components:**

Browse available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

**Component Requirements:**

- ✅ Use design token classes (`bg-surface`, `px-ds-2`, `rounded-md`)
- ✅ Test both presence AND absence of styles
- ✅ Add Figma design link to Storybook story
- ✅ Match Figma design exactly
- ✅ No hardcoded values

See [CLAUDE.md](./CLAUDE.md) for complete AI-driven workflow.

### Syncing Design Tokens

Use Claude + Figma MCP for AI-driven token syncing:

1. See [CLAUDE.md](./CLAUDE.md) for complete instructions
2. Always run `yarn validate:all` after syncing
3. See [FIGMA_MCP_SETUP.md](./FIGMA_MCP_SETUP.md) for first-time setup

## Migration Guide

### From MUI (Web)

```typescript
// Before
import { Button } from '@mui/material'
;<Button variant="contained">Click me</Button>

// After
import { Button } from '@safe-global/design-system/web'
;<Button variant="primary">Click me</Button>
```

Both can coexist during migration.

## License

Private - Safe Global
