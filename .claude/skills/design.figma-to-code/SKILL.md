---
name: design.figma-to-code
description: Implement a Figma design using shadcn/ui components. Use when converting Figma URLs to React code.
argument-hint: "[figma-url]"
allowed-tools:
  - mcp__figma-remote-mcp__get_design_context
  - mcp__figma-remote-mcp__get_screenshot
  - mcp__figma-remote-mcp__get_variable_defs
  - mcp__figma-remote-mcp__get_metadata
  - mcp__shadcn__search_items_in_registries
  - mcp__shadcn__list_items_in_registries
  - mcp__shadcn__view_items_in_registries
  - mcp__shadcn__get_item_examples_from_registries
  - mcp__shadcn__get_add_command_for_items
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Figma to Code Implementation

Implement the Figma design at **$ARGUMENTS** using shadcn/ui components.

## Step 1: Parse Figma URL

Extract from URL `https://figma.com/design/:fileKey/:fileName?node-id=:nodeId`:
- `fileKey`: The file identifier
- `nodeId`: Convert `123-456` to `123:456` format

## Step 2: Fetch Design Context

```
mcp__figma-remote-mcp__get_design_context(
  fileKey: "<fileKey>",
  nodeId: "<nodeId>",
  clientLanguages: "typescript",
  clientFrameworks: "react,nextjs"
)
```

Also get screenshot and metadata:
```
mcp__figma-remote-mcp__get_screenshot(fileKey, nodeId)
mcp__figma-remote-mcp__get_metadata(fileKey, nodeId)
```

## Step 3: Analyze Component Types (CRITICAL)

**Check `data-name` attributes in Figma output - don't assume from visuals!**

| Visual Appearance | Check `data-name` for | Likely Component |
|-------------------|----------------------|------------------|
| Grouped buttons with one active | `Tabs`, `Tab` | `<Tabs>` |
| Toggle between options | `Switch`, `Toggle` | `<Switch>` |
| Button group | `ButtonGroup` | `<ToggleGroup>` |
| Dropdown trigger | `Select`, `Dropdown` | `<Select>` |

**Red Flags - Verify Before Coding:**
- Multiple similar elements in a row (could be Tabs, not Buttons)
- Elements sharing a container background (grouped component)
- Active/inactive states (selection component)

## Step 4: Extract Variants & Props

For shadcn Figma libraries, extract props from **attributes only**:

**What to LOOK AT:**
- `get_metadata` → `height` attribute (36=default, 32=sm, 24=xs)
- CSS variable **names**: `--general/primary`, `--general/secondary`
- `data-name` for component type

**What to IGNORE:**
- Pixel values in generated code (px, py, gap, rounded)
- These are internal implementation details

**Priority Order:**
1. `data-name` with variant (e.g., "Button/Secondary/sm")
2. CSS variable names → variant (`--general/secondary` → `variant="secondary"`)
3. Compare heights relatively
4. **Omitted = default**

## Step 5: Map to shadcn Components

Search for matching components:
```
mcp__shadcn__search_items_in_registries(
  registries: ["@shadcn"],
  query: "<component type>"
)
```

Get implementation details:
```
mcp__shadcn__view_items_in_registries(
  items: ["@shadcn/button", "@shadcn/card", ...]
)
```

## Step 6: Install Missing Components

Check existing: `apps/web/src/components/ui/`

Install missing:
```bash
cd apps/web && npx shadcn@latest add <components>
```

**Fix import paths after install:**
```tsx
// Change this:
import { cn } from "@/utils/utils"
// To this:
import { cn } from '@/utils/cn'
```

## Step 7: Build the Component

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type MyComponentProps = {
  // typed props
}

export function MyComponent({ ...props }: MyComponentProps) {
  return (
    // Implementation
  )
}
```

**Styling Guidelines:**

DO:
- Use shadcn variants (`variant="outline"`, `size="sm"`)
- Use Tailwind for layout: `flex`, `grid`, `gap-*`, `p-*`
- Use CSS variables for colors

DON'T:
- Add custom colors (`bg-blue-500`)
- Override shadcn styles
- Hardcode pixel values

## Step 8: Create Storybook Stories

Create a story for the main component and any subcomponents:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from './MyComponent'

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
} satisfies Meta<typeof MyComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
```

**For screens with subcomponents, create stories for each:**
```
MyScreen/
├── MyScreen.stories.tsx
├── HeaderCard.stories.tsx
└── DataTable.stories.tsx
```

## Step 9: Verify

```bash
yarn workspace @safe-global/web type-check
yarn workspace @safe-global/web storybook:vite
```

## Project Notes

- **Components Path**: `apps/web/src/components/ui/`
- **Utility Path**: `apps/web/src/utils/cn.ts`
- **Icon Library**: `lucide-react`

See [reference.md](reference.md) for detailed component mappings and patterns.
