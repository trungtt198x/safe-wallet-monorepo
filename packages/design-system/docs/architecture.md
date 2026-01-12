# Design System Architecture

## Package Structure

```
packages/design-system/
├── package.json                      # Workspace package with build scripts
├── tsconfig.json                     # TypeScript config extending @safe-global/tsconfig
├── components.json                   # Shadcn v2 CLI configuration
├── README.md                         # Quick start guide
├── CLAUDE.md                         # AI assistant instructions for Figma sync
├── FIGMA_MCP_SETUP.md                # Figma MCP one-time setup
├── jest.config.js                    # Test configuration
├── eslint.config.mjs                 # Linting rules
├── tailwind.config.js                # Tailwind config using design tokens
├── postcss.config.js                 # PostCSS with Tailwind and Autoprefixer
│
├── docs/
│   ├── requirements.md               # This file
│   ├── architecture.md               # Technical architecture
│   └── tasks.md                      # Implementation tasks
│
├── src/
│   ├── index.ts                      # Main entry (tokens only, platform-safe)
│   ├── web.ts                        # Web-specific exports (Shadcn components)
│   ├── mobile.ts                     # Mobile exports (Tamagui components)
│   │
│   ├── tokens/                       # Platform-agnostic design tokens
│   │   ├── index.ts                  # Token registry and exports
│   │   ├── base/                     # Base tokens from Figma
│   │   │   ├── colors.tokens.json
│   │   │   ├── spacing.tokens.json
│   │   │   ├── typography.tokens.json
│   │   │   ├── radius.tokens.json
│   │   │   ├── shadows.tokens.json
│   │   │   └── index.ts
│   │   ├── semantic/                 # Semantic token mappings
│   │   │   ├── light.tokens.json     # Light theme semantics
│   │   │   ├── dark.tokens.json      # Dark theme semantics
│   │   │   └── index.ts
│   │   ├── transforms/               # Token transformation utilities
│   │   │   ├── toTailwind.ts        # Tailwind config transformer (web)
│   │   │   ├── toTamagui.ts         # Tamagui transformer (mobile)
│   │   │   ├── toCssVars.ts         # CSS variable transformer
│   │   │   └── index.ts
│   │   └── types.ts                  # TypeScript token types
│   │
│   ├── web/                          # Web (Shadcn/Radix) components
│   │   ├── index.ts                  # Web component exports
│   │   ├── components/
│   │   │   ├── ui/                   # Shadcn components (copy-paste pattern)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── ...
│   │   │   └── [component]/          # Component with stories
│   │   │       ├── [component].stories.tsx
│   │   │       └── [component].test.tsx
│   │   ├── lib/
│   │   │   └── utils.ts              # cn() helper for Tailwind
│   │   └── styles/
│   │       ├── globals.css           # Tailwind base + design tokens
│   │       └── tokens.css            # CSS variables from design tokens
│   │
│   └── mobile/                       # Mobile (Tamagui) components
│       ├── index.ts                  # Mobile component exports
│       ├── components/
│       │   └── Button/               # Example component structure
│       │       ├── Button.tsx
│       │       ├── Button.test.tsx
│       │       └── index.ts
│       └── theme/
│           └── config.ts             # Tamagui config with design tokens
│
├── scripts/                          # Build and sync scripts
│   ├── sync-figma.ts                # Main Figma sync orchestrator
│   ├── generate-tokens.ts           # Token generation from Figma
│   ├── generate-components.ts       # Component scaffolding
│   ├── generate-stories.ts          # Storybook story generation
│   ├── generate-docs.ts             # Documentation generation
│   ├── validate-tokens.ts           # Token validation with Zod
│   ├── templates/                   # Handlebars templates
│   │   ├── web-component.tsx.hbs
│   │   ├── mobile-component.tsx.hbs
│   │   ├── story.tsx.hbs
│   │   ├── test.tsx.hbs
│   │   └── component-doc.md.hbs
│   └── utils/                       # Script utilities
│       ├── figma-client.ts          # Figma API wrapper (via MCP)
│       ├── token-parser.ts          # Parse Figma to tokens
│       └── file-system.ts           # File writing utilities
│
├── .storybook/                      # Dedicated Storybook config
│   ├── main.ts
│   └── preview.ts
│
└── figma/                           # Figma sync metadata
    ├── sync-manifest.json           # Tracking synced components
    ├── component-mapping.json       # Figma ID → component mapping
    └── .last-sync                   # Last sync timestamp
```

## Design Token System

### Token Format

JSON format inspired by Design Tokens Community Group (DTCG) spec:

```json
{
  "$schema": "./token-schema.json",
  "figma": {
    "fileKey": "abc123",
    "lastSync": "2026-01-06T10:00:00Z"
  },
  "color": {
    "primitive": {
      "black": { "value": "#121312", "type": "color" },
      "green-400": { "value": "#12FF80", "type": "color" }
    }
  }
}
```

**Semantic tokens** (light.tokens.json):

```json
{
  "color": {
    "semantic": {
      "text": {
        "primary": { "value": "{color.primitive.black}", "type": "color" },
        "secondary": { "value": "{color.primitive.grey-500}", "type": "color" }
      },
      "background": {
        "default": { "value": "#F4F4F4", "type": "color" },
        "paper": { "value": "{color.primitive.white}", "type": "color" }
      }
    }
  }
}
```

### Token Categories

1. **Colors**: Primitive colors + semantic light/dark mappings
2. **Spacing**: 8px grid system (matching existing monorepo pattern)
3. **Typography**: Font families, sizes, weights, line heights
4. **Radius**: Border radius scale
5. **Shadows**: Elevation system

### Transformation Pipeline

```
Figma (Designers update)
    ↓
Claude + Figma MCP (Designer runs sync command)
    ↓
Raw JSON Tokens (*.tokens.json files)
    ↓
Transformers (toTailwind.ts, toTamagui.ts, toCssVars.ts)
    ↓
Platform Outputs:
  ├─ TypeScript (tokens.ts)
  ├─ CSS Variables (tokens.css)
  ├─ Tailwind Config (tailwind.config.js)
  └─ Tamagui Tokens (tamaguiTokens.ts)
```

### Tailwind Integration (Web)

```javascript
// tailwind.config.js (in design system package)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--ds-color-primary))',
        secondary: 'hsl(var(--ds-color-secondary))',
        // ... all semantic colors from tokens
      },
      spacing: {
        // Maps to 8px grid system
      },
      borderRadius: {
        // Maps to radius tokens
      },
    },
  },
}
```

CSS variables defined in `tokens.css` allow runtime theme switching (light/dark).

### Tamagui Integration (Mobile)

The `toTamagui.ts` transformer updates the existing mobile Tamagui config at `apps/mobile/src/theme/tamagui.config.ts` to use design system tokens.

## Component Structure

### Web (Shadcn v2 with CLI)

This design system uses **Shadcn v2 with CLI support** for web components.

**Key Details:**

- Uses Radix UI primitives + Tailwind CSS
- CLI-based component installation: `npx shadcn@latest add <component-name>`
- Copy-paste pattern with full control
- Components use CVA (class-variance-authority) for variants
- See [CLAUDE.md](../CLAUDE.md) for complete component generation workflow

**Current Components:** Button, Card, Input, Label (via Shadcn CLI)

### Mobile (Tamagui)

```typescript
// src/mobile/components/Button/Button.tsx
import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps } from 'tamagui'
import { tokens } from '../../tokens'

export interface ButtonProps extends TamaguiButtonProps {
  variant?: 'default' | 'primary' | 'destructive'
}

export const Button = ({ variant = 'default', ...props }: ButtonProps) => {
  return (
    <TamaguiButton theme={variant === 'primary' ? 'blue' : variant === 'destructive' ? 'red' : undefined} {...props} />
  )
}
```

### Props Mapping

| Figma Property | React Prop Type | Web (Shadcn)            | Mobile (Tamagui) |
| -------------- | --------------- | ----------------------- | ---------------- |
| Boolean        | `boolean`       | Direct mapping          | Direct mapping   |
| Instance Swap  | `ReactNode`     | `asChild` or `children` | `children`       |
| Text           | `string`        | Direct mapping          | Direct mapping   |
| Variant        | Union type      | `variant` prop (CVA)    | `theme` prop     |
| Component Set  | Union type      | `variant` + `size`      | `size` + theme   |

## Figma MCP Integration

This design system uses Figma as the single source of truth, synced via Claude + Figma MCP.

**Workflow:**

1. Update Figma (design tokens, components)
2. Use Claude + MCP to sync (AI-driven)
3. Validate with `yarn validate:all`
4. Review and merge PR

See [CLAUDE.md](../CLAUDE.md) for complete workflow and [FIGMA_MCP_SETUP.md](../FIGMA_MCP_SETUP.md) for setup.

## Storybook Integration

### Configuration

Dedicated Storybook at `packages/design-system/.storybook/` with:

- Framework: `@storybook/nextjs`
- Addons: `@storybook/addon-designs` (Figma links), `@storybook/addon-docs` (autodocs)
- Theme: Tailwind + dark mode support

### Story Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './ui/button'

const meta = {
  title: 'Design System/Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/[fileKey]/Button?node-id=[nodeId]',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: 'Button' } }
export const Primary: Story = { args: { children: 'Primary', variant: 'primary' } }
```

### Organization

```
Design System/
├── Getting Started
├── Tokens/
│   ├── Colors
│   ├── Spacing
│   └── Typography
├── Inputs/
│   ├── Button
│   └── Input
├── Layout/
│   └── Card
└── Feedback/
    └── Alert
```

## Testing & Validation

### Unit Tests

```typescript
// Token validation
describe('Design System Tokens', () => {
  it('should have valid hex color values', () => {
    expect(tokens.color.semantic.light.primary.main).toMatch(/^#[0-9A-F]{6}$/i)
  })

  it('should follow 8px grid system', () => {
    Object.values(tokens.spacing).forEach((value) => {
      expect(parseInt(value) % 8).toBe(0)
    })
  })
})
```

### Visual Regression

- Chromatic integration (already configured in monorepo)
- Automatic snapshots of all stories
- Baseline comparison on each PR

### CI Pipeline

GitHub Actions workflow for PRs affecting `packages/design-system/**`:

- Validate tokens (Zod schema)
- Type-check
- Run unit tests
- Build Storybook
- Run Chromatic visual regression

## Migration Strategy

### Coexistence Approach

```typescript
// OLD: Existing MUI components (continues to work)
import { Button } from '@mui/material'

// NEW: Design system components (explicit opt-in)
import { Button } from '@safe-global/design-system/web'
```

**Key advantages**:

- Both MUI and Shadcn render as React DOM (no paradigm shift)
- Shadcn components are copy-pasted (full control)
- Can coexist indefinitely
- Easier to customize per platform

## Export Strategy

**Package.json exports**:

```json
{
  "name": "@safe-global/design-system",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./web": "./src/web.ts",
    "./mobile": "./src/mobile.ts",
    "./tokens": "./src/tokens/index.ts",
    "./tokens.css": "./src/web/styles/tokens.css"
  }
}
```

## Critical Integration Points

### Web App Integration

Files to modify:

- Add Tailwind CSS setup to `apps/web/`
- Import design system globals in `_app.tsx`
- Optionally update `apps/web/src/components/theme/safeTheme.ts` for gradual MUI migration

### Mobile App Integration

Files to modify:

- `apps/mobile/src/theme/tamagui.config.ts` - Import design system tokens

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "tamagui": "^1.126.3"
  },
  "devDependencies": {
    "@storybook/nextjs": "^8.0.0",
    "@storybook/addon-designs": "^8.0.0",
    "@types/react": "^18.3.1",
    "handlebars": "^4.7.8",
    "zod": "^3.23.8",
    "typescript": "~5.9.2",
    "jest": "^29.7.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33"
  }
}
```

**Note**: Radix UI components added as needed (e.g., `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`)
