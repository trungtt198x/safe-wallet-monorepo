# Quickstart: Design System Integration

**Feature**: 003-design-system-integration  
**Date**: 2026-01-26

## Overview

This guide helps developers get started with the new shadcn/ui-based design system. It covers token syncing, component creation, and Storybook documentation.

## Prerequisites

- Node.js 18+ and Yarn 4
- Figma desktop app (for token sync)
- Figma MCP configured in Cursor

## Quick Start (5 minutes)

### 1. Sync Design Tokens

```bash
# From repository root
yarn design-system:sync
```

This fetches the latest tokens from Figma and generates CSS files in `packages/design-system/src/tokens/`.

### 2. Import Tokens in Your Feature

```tsx
// apps/web/src/features/your-feature/index.tsx
import '@safe-global/design-system/tokens/index.css';
```

### 3. Use shadcn Components

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const MyFeature = () => (
  <Card>
    <Button variant="default">Click me</Button>
  </Card>
);
```

## Detailed Setup

### Token Sync

The design system tokens are sourced from Figma. To sync:

```bash
# Standard sync
yarn design-system:sync

# Dry run (preview changes)
yarn design-system:sync --dry-run

# Verbose output
yarn design-system:sync --verbose
```

**Token files generated:**
- `colors.css` - Color tokens with light/dark modes
- `spacing.css` - Spacing scale
- `typography.css` - Font sizes, weights, line heights
- `radius.css` - Border radius values
- `index.css` - Combined import
- `tokens.json` - Machine-readable manifest

### Initial shadcn Setup (One-time)

If shadcn is not yet initialized in the project:

```bash
cd apps/web

# Initialize with Safe design system preset (Nova style, large radius)
yarn dlx shadcn@latest init --preset "https://ui.shadcn.com/init?base=base&style=nova&baseColor=neutral&theme=amber&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=large&template=next"
```

**Post-init:** Update the font from Inter to DM Sans in `tailwind.config.ts`:
```typescript
fontFamily: {
  sans: ['DM Sans', ...fontFamily.sans],
}
```

### Adding shadcn Components

Use the shadcn CLI to add components:

```bash
# From apps/web directory
cd apps/web

# Add a single component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add card input label

# List available components
npx shadcn@latest add --help
```

Components are installed to `apps/web/src/components/ui/`.

### Creating a New Feature

New features should use the design system exclusively:

```bash
# Create feature directory
mkdir -p apps/web/src/features/my-feature

# Create component file
touch apps/web/src/features/my-feature/MyComponent.tsx
touch apps/web/src/features/my-feature/MyComponent.stories.tsx
touch apps/web/src/features/my-feature/index.ts
```

**Component structure:**

```tsx
// MyComponent.tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MyComponentProps {
  title: string;
  className?: string;
}

export const MyComponent = ({ title, className }: MyComponentProps) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Action</Button>
      </CardContent>
    </Card>
  );
};
```

**Story file:**

```tsx
// MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Features/MyFeature/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'My Component',
  },
};

export const WithCustomClass: Story = {
  args: {
    title: 'Custom Width',
    className: 'max-w-md',
  },
};
```

### Storybook Development

```bash
# Start Storybook
yarn workspace @safe-global/web storybook

# Opens at http://localhost:6006
```

**Storybook sections:**
- **Foundations/** - Token documentation (colors, spacing, typography)
- **Components/** - Atom-level components (Button, Input, Card)
- **Features/** - Feature-specific components and compositions

### Dark Mode

Tokens automatically support dark mode via CSS variables:

```css
/* Light mode (default) */
:root {
  --background: #f4f4f4;
  --foreground: #121312;
}

/* Dark mode */
.dark {
  --background: #121312;
  --foreground: #f5f5f5;
}
```

Toggle dark mode by adding/removing the `dark` class on `<html>` or a parent element.

## Token Reference

### Colors

| Token | Usage |
|-------|-------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--card` | Card/surface background |
| `--card-foreground` | Text on cards |
| `--muted-foreground` | Secondary text |
| `--border` | Border color |
| `--primary` | Primary actions |
| `--state-positive` | Success states |
| `--state-negative` | Error states |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-1` | 4px | Tight spacing |
| `--spacing-xs` | 8px | Small gaps |
| `--spacing-3` | 12px | Medium-small |
| `--spacing-s` | 16px | Standard spacing |
| `--spacing-xl` | 32px | Large sections |

### Typography

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| Title | 18px | 700 | Section headings |
| Subtitle | 16px | 500 | Sub-headings |
| Body | 14px | 400 | Body text |
| Small | 12px | 400 | Captions, labels |

## Common Patterns

### Composing Molecules

```tsx
// FormField molecule (composed from atoms)
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}

export const FormField = ({ label, id, type = 'text', placeholder }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} placeholder={placeholder} />
  </div>
);
```

### Using Tailwind with Tokens

```tsx
// Tailwind classes reference CSS variables
<div className="bg-background text-foreground border-border">
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

### Responsive Design

```tsx
// Use Tailwind responsive prefixes
<Card className="p-4 md:p-6 lg:p-8">
  <Button className="w-full md:w-auto">
    Responsive Button
  </Button>
</Card>
```

## Troubleshooting

### Token sync fails

```
Error: Figma MCP returned invalid response
```

**Solution:** Ensure Figma desktop app is open with the DS · Foundations file.

### Components not styled

```
Warning: Unknown CSS variable --background
```

**Solution:** Import tokens at the feature or app level:
```tsx
import '@safe-global/design-system/tokens/index.css';
```

### Tailwind classes not working

**Solution:** Ensure the file path is included in `tailwind.config.ts`:
```ts
content: [
  './src/components/ui/**/*.{ts,tsx}',
  './src/features/**/*.{ts,tsx}', // Add your feature path
],
```

### Dark mode not working

**Solution:** Add the `dark` class to a parent element:
```html
<html class="dark">
```

## Migration from MUI

When migrating an existing MUI feature to shadcn:

1. **Don't migrate in place** - Create a v2 version in the feature folder
2. **Feature flag** - Use a feature flag to switch between versions
3. **Test thoroughly** - Ensure visual parity with Lost Pixel
4. **Remove gradually** - Only remove MUI version after v2 is stable

```tsx
// Feature flag example
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

export const MyFeature = () => {
  const useNewDesignSystem = useFeatureFlag('USE_NEW_DESIGN_SYSTEM');
  
  if (useNewDesignSystem) {
    return <MyFeatureV2 />;
  }
  
  return <MyFeatureLegacy />;
};
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Figma DS · Foundations](https://www.figma.com/design/SX3PdSxgY0D7vfGx2ytRWU/DS-·-Foundations?node-id=95-2000&m=dev)

## Support

- **Design questions:** Contact the design team
- **Technical issues:** Create an issue or ask in #frontend Slack channel
