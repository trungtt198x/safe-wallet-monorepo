# Design System - Claude Instructions

This file contains instructions for Claude (or any AI assistant with Figma MCP access) on how to sync design tokens from Figma to this design system package.

## Prerequisites

- Figma MCP server configured and connected
- Access to the Safe Wallet Figma file

## Shadcn v2 Configuration

This design system uses **Shadcn v2** with the following configuration (defined in `components.json`):

- **Style**: `new-york` - Modern, clean component style
- **Base Color**: `slate` - Neutral gray palette
- **CSS Variables**: `true` - Enables runtime theming (light/dark)
- **Primitives**: **Radix UI** - Accessible, unstyled component primitives
- **Icons**: `lucide` - Lucide React icon library
- **Path Aliases**: `@/web/*` maps to `src/web/*`

**Key Files:**

- `components.json` - Shadcn CLI configuration
- `tailwind.config.js` - Tailwind theme with design tokens
- `src/web/styles/globals.css` - Tailwind base styles
- `src/web/styles/tokens.css` - CSS variables from Figma tokens (generated)
- `src/web/lib/utils.ts` - `cn()` utility for class merging

## Figma MCP Best Practices (Official)

Based on Figma's developer documentation, always follow these principles:

### 1. Token Syncing Best Practices

**Use Specific Tools:**

- ✅ **`get_variable_defs`** - Extracts variables and styles (colors, typography, spacing)
- ❌ Don't rely on generic prompts - be explicit about which tool to use

**Example Prompt:**

```
Use get_variable_defs to extract all design tokens from the Safe Wallet Figma file [FILE_KEY]
```

### 2. Performance Considerations

**Avoid Large Selections:**

- ❌ Don't process entire pages or complex screens at once
- ✅ Work with logical chunks (individual components, sections)
- ✅ Process tokens by category if file is large (colors → typography → spacing)

**Why:** Large selections cause slow responses, errors, or incomplete outputs due to context limits.

### 3. Component Generation Best Practices

**For Standard Components:**

- Use **Shadcn CLI** for standard UI components (Button, Dialog, Card, etc.)
- Command: `npx shadcn@latest add <component-name>`

**For Custom Components from Figma:**

- ✅ **Work with small selections** (individual components, not full pages)
- ✅ Use `get_design_context` tool for component structure
- ✅ Be explicit in prompts about framework, styling, output location
- ✅ Reference existing design tokens instead of hardcoding values

**Recommended Prompt Template:**

```
Generate a [ComponentName] component from the selected Figma frame:
- Use Shadcn v2 patterns with Radix UI primitives
- Style with Tailwind CSS using design system tokens
- Follow CVA (class-variance-authority) for variants
- Add TypeScript types for all props
- Save to src/web/components/ui/[component-name].tsx
- Create Storybook story at src/web/components/ui/[component-name].stories.tsx
```

### 4. Custom Rules for This Project

**CRITICAL:** Always follow these rules when working with Figma MCP:

1. **Use Specific Tools:** Explicitly request `get_variable_defs` for token extraction
2. **Avoid Hardcoded Values:** Never hardcode colors, spacing, or other design values
3. **Maintain Figma Fidelity:** Generated tokens must match Figma 1:1
4. **Work with Smaller Selections:** Don't process entire pages at once - work with logical sections
5. **Follow 8px Grid:** All spacing must be multiples of 8px
6. **Semantic Naming:** Use descriptive names that convey purpose (e.g., "Semantic/Primary/Main")
7. **Token References:** Semantic tokens should reference primitive tokens using `{color.primitive.name}` syntax

## Figma Sync Workflow

When the user asks to "sync design tokens from Figma" or similar, follow these steps:

### 1. Fetch Design Tokens from Figma Using Specific Tools

**CRITICAL:** Use the `get_variable_defs` tool explicitly to extract design tokens:

```
Prompt: "Use get_variable_defs to extract all variables and styles from the Safe Wallet Figma file [FILE_KEY]"
```

This tool returns structured data including:

**Color Variables/Styles:**

- All color variables and local styles
- Parse style names (e.g., "Primitive/Green-400", "Semantic/Primary/Main")
- Extract RGB/HSL values in proper format

**Typography Variables/Styles:**

- Font families, sizes, weights, line heights
- Text style names (e.g., "Heading/Large/Bold", "Body/Medium/Regular")

**Spacing, Radius, Shadow Variables:**

- Spacing variables (must validate as multiples of 8px)
- Border radius variables
- Shadow/elevation variables

**Best Practice:** If the file is large, process variables by category (colors first, then typography, then spacing) to avoid context overload.

### 2. Update CSS Variables and Tailwind Config

**CRITICAL:** Before creating token files, ensure the CSS setup is correct:

#### ✅ Step 2a: Import tokens.css in globals.css

Edit `src/web/styles/globals.css` and add the import **BEFORE** Tailwind directives:

```css
@import './tokens.css'; /* ← MUST BE FIRST */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Why this is critical:** Without this import, CSS variables won't be defined and components will have transparent backgrounds.

#### ✅ Step 2b: Update tokens.css

Update `src/web/styles/tokens.css` with design tokens from Figma:

```css
:root {
  /* Primitive Colors */
  --ds-color-primitive-white: #ffffff;
  --ds-color-primitive-black: #111111;

  /* Spacing */
  --ds-spacing-8: 8px;
  --ds-spacing-16: 16px;

  /* Border Radius */
  --ds-radius-md: 12px;
}

:root,
[data-theme='light'] {
  /* Semantic Colors - Light Theme */
  --ds-color-bg-surface: #ffffff;
  --ds-color-text-primary: #111111;
}
```

#### ✅ Step 2c: Update Tailwind Config

Update `tailwind.config.js` to expose design tokens as Tailwind utilities:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Semantic names for colors
        surface: 'var(--ds-color-bg-surface)',
        'text-primary': 'var(--ds-color-text-primary)',
      },
      borderRadius: {
        md: 'var(--ds-radius-md)',
      },
      spacing: {
        // Use ds- prefix to avoid conflicts with Tailwind defaults
        'ds-1': 'var(--ds-spacing-8)',
        'ds-2': 'var(--ds-spacing-16)',
      },
    },
  },
}
```

**Naming conventions:**

- **Colors:** Semantic names (`surface`, `text-primary`)
- **Radius:** Size names (`sm`, `md`, `lg`)
- **Spacing:** `ds-N` prefix to avoid conflicts with Tailwind defaults

### 3. Generate Token Files

Create/update JSON token files following this structure:

**Base Tokens:**

- `src/tokens/base/colors.tokens.json` - Primitive color palette
- `src/tokens/base/spacing.tokens.json` - Spacing scale (8px grid)
- `src/tokens/base/typography.tokens.json` - Font definitions
- `src/tokens/base/radius.tokens.json` - Border radius scale
- `src/tokens/base/shadows.tokens.json` - Shadow/elevation scale

**Semantic Tokens:**

- `src/tokens/semantic/light.tokens.json` - Light theme semantic mappings
- `src/tokens/semantic/dark.tokens.json` - Dark theme semantic mappings

**Token Format (DTCG-inspired):**

```json
{
  "$schema": "../token-schema.json",
  "figma": {
    "fileKey": "ABC123XYZ",
    "lastSync": "2026-01-06T10:00:00Z"
  },
  "color": {
    "primitive": {
      "black": {
        "value": "#121312",
        "type": "color",
        "description": "Pure black for text and UI elements"
      }
    }
  }
}
```

**Semantic Token Format:**

```json
{
  "$schema": "../token-schema.json",
  "theme": "light",
  "color": {
    "semantic": {
      "text": {
        "primary": {
          "value": "{color.primitive.black}",
          "type": "color",
          "description": "Primary text color"
        }
      }
    }
  }
}
```

### 4. Generate TypeScript Index Files

Create/update:

- `src/tokens/base/index.ts` - Export all base tokens
- `src/tokens/semantic/index.ts` - Export semantic tokens
- `src/tokens/index.ts` - Main token registry
- `src/index.ts` - Package entry point

### 5. Update Metadata

Update `figma/sync-manifest.json`:

```json
{
  "lastSync": "2026-01-06T10:00:00Z",
  "figmaFileKey": "ABC123XYZ",
  "syncedTokens": {
    "colors": 42,
    "textStyles": 12,
    "spacing": 12,
    "radius": 6,
    "shadows": 5
  },
  "syncedBy": "Claude Sonnet 4.5"
}
```

### 6. Validate Everything

Run comprehensive validation:

```bash
# Validate token structure
yarn workspace @safe-global/design-system validate

# Validate complete sync (CSS import, Tailwind config, tests, stories)
yarn workspace @safe-global/design-system validate:sync

# Run all validations (tokens + sync + type-check + tests)
yarn workspace @safe-global/design-system validate:all
```

The `validate:sync` script checks:

- ✅ tokens.css is imported in globals.css
- ✅ Tailwind config has all design tokens
- ✅ Token files are valid with Figma file keys
- ✅ CSS variables are defined
- ✅ Storybook stories have Figma links
- ✅ Tests cover Figma fidelity

**If validation fails:** The script will tell you exactly what's missing.

### 7. Create Commit

Create a semantic commit:

```
feat(design-system): sync design tokens from Figma [YYYY-MM-DD]

Synced from Figma file: [File Name/URL]

Changes:
- Updated X color tokens
- Updated Y text styles
- Added Z new tokens

Figma file key: ABC123XYZ
Last sync: YYYY-MM-DD HH:MM:SS

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Figma Naming Conventions

Tokens in Figma should follow these naming patterns:

### Colors

```
Primitive/[Name]                  → Base colors (e.g., "Primitive/Green-400")
Semantic/[Category]/[Variant]     → Semantic colors (e.g., "Semantic/Primary/Main")
```

### Text Styles

```
[Category]/[Size]/[Weight]        → Text styles (e.g., "Heading/Large/Bold")
```

### Variables

```
Spacing/[Size]                    → Spacing (e.g., "Spacing/MD" = 32px)
Radius/[Size]                     → Border radius (e.g., "Radius/Default" = 6px)
Shadow/[Level]                    → Shadows (e.g., "Shadow/MD")
```

## Token Usage in Components

When creating components, always use design token classes:

### ✅ Correct Usage:

```typescript
// Use semantic token names
className = 'rounded-md bg-surface text-primary px-ds-2 py-ds-1'
```

**What this generates:**

- `rounded-md` → `border-radius: var(--ds-radius-md)` → `12px`
- `bg-surface` → `background-color: var(--ds-color-bg-surface)` → `#ffffff`
- `px-ds-2` → `padding-left/right: var(--ds-spacing-16)` → `16px`
- `py-ds-1` → `padding-top/bottom: var(--ds-spacing-8)` → `8px`

### ❌ Incorrect Usage:

```typescript
// DON'T hardcode Tailwind defaults
className = 'rounded-xl bg-white px-4 py-2' // ❌ Not using design tokens

// DON'T use arbitrary values for everything
className = 'rounded-[12px] bg-[#ffffff] px-[16px] py-[8px]' // ❌ Verbose and not dynamic
```

### Token Naming Pattern:

- **Colors:** Semantic names without prefix (`surface`, `text-primary`)
- **Spacing:** `ds-N` prefix (`ds-1`, `ds-2`)
- **Radius:** Size names (`sm`, `md`, `lg`)

This approach ensures:

1. ✅ Values update automatically when tokens change
2. ✅ Clean, readable code
3. ✅ No conflicts with Tailwind defaults
4. ✅ Type-safe with Tailwind IntelliSense

## Component Generation

### Web Components (Shadcn v2 CLI)

**IMPORTANT: This design system uses Shadcn v2 with CLI support. Always use the CLI for web components when possible.**

**For standard Shadcn components (Button, Card, Dialog, etc.):**

1. Use the Shadcn CLI to add the component:

   ```bash
   npx shadcn@latest add <component-name>
   ```

2. Export the component in `src/web/index.ts`:

   ```typescript
   export * from './components/ui/<component-name>'
   ```

3. Create Storybook story in `src/web/components/ui/<component-name>.stories.tsx`

4. Customize component to match Figma design exactly
5. Create tests in `src/web/components/ui/<component-name>.test.tsx`

**Available Shadcn components:** https://ui.shadcn.com/docs/components

**Examples:**

```bash
npx shadcn@latest add button       # Already added
npx shadcn@latest add card         # Already added
npx shadcn@latest add input        # Already added
npx shadcn@latest add label        # Already added
npx shadcn@latest add dialog       # Add dialog component
npx shadcn@latest add dropdown-menu
npx shadcn@latest add alert-dialog
```

**For custom components from Figma (using MCP):**

If the component doesn't exist in Shadcn's library, use Figma MCP to generate it:

**Best Practices (from Figma MCP documentation):**

1. **Work with Small Selections:** Select individual components, not entire pages
2. **Use Specific Tools:** Request `get_design_context` for component structure
3. **Be Explicit in Prompts:** "Generate [ComponentName] from this Figma frame using Shadcn/Radix patterns and Tailwind CSS"
4. **Specify Output Location:** "Add this component to src/web/components/ui/[component-name].tsx"
5. **Use Design Tokens:** Reference existing tokens from `src/tokens/` rather than hardcoding values

**Recommended Prompt Template:**

```
Generate a [ComponentName] component from the selected Figma frame:
- Use Shadcn v2 patterns with Radix UI primitives
- Style with Tailwind CSS using design system tokens
- Follow CVA (class-variance-authority) for variants
- Add TypeScript types for all props
- Save to src/web/components/ui/[component-name].tsx
- Create Storybook story at src/web/components/ui/[component-name].stories.tsx
```

**Component Generation Steps:**

1. Fetch Figma component metadata using Figma MCP
2. Extract design tokens used (colors, spacing, radius, shadows)
3. Update tokens.css, Tailwind config if new tokens are needed
4. Generate web component following Shadcn/Radix patterns in `src/web/components/ui/`
5. Use design token classes (`bg-surface`, `px-ds-2`, etc.)
6. Use CVA (class-variance-authority) for variant management
7. Create comprehensive tests including Figma fidelity tests
8. Generate Storybook story in `src/web/components/ui/<component>.stories.tsx`
9. Update component mapping in `figma/component-mapping.json`
10. Run `yarn validate:all` to verify everything is correct

**Component Structure Pattern (for custom components):**

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/web/lib/utils'

const componentVariants = cva(
  'rounded-md bg-surface px-ds-2 py-ds-1', // ← Use design tokens!
  {
    variants: {
      variant: {
        default: 'text-primary',
        secondary: 'text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(({ className, variant, ...props }, ref) => {
  return <div className={cn(componentVariants({ variant, className }))} ref={ref} {...props} />
})
Component.displayName = 'Component'

export { Component, componentVariants }
```

**Component Tests Pattern (Critical for Figma Fidelity):**

```typescript
describe('Component', () => {
  describe('Figma Design Fidelity', () => {
    it('should match Figma design tokens', () => {
      const { container } = render(<Component>Content</Component>)
      const el = container.firstChild as HTMLElement

      // Test what IS in the design
      expect(el).toHaveClass('rounded-md')
      expect(el).toHaveClass('bg-surface')
      expect(el).toHaveClass('px-ds-2')
      expect(el).toHaveClass('py-ds-1')
    })

    it('should NOT have styles not in Figma', () => {
      const { container } = render(<Component>Content</Component>)
      const el = container.firstChild as HTMLElement

      // Test what is NOT in the design
      expect(el.className).not.toContain('border')
      expect(el.className).not.toContain('shadow')
    })
  })
})
```

**Key Testing Principles:**

1. Test that correct tokens ARE applied
2. Test that unwanted styles are NOT present
3. Cover all sub-components and variants
4. Test ref forwarding and prop spreading

### Mobile Components (Future)

1. Generate mobile component (Tamagui wrapper) in `src/mobile/components/`
2. Map design tokens to Tamagui theme
3. Create tests for mobile component

## Important Notes

### Critical Steps (Don't Skip!)

1. **✅ Import tokens.css** - Always add `@import './tokens.css'` in globals.css
2. **✅ Update Tailwind config** - Add design tokens to Tailwind theme.extend
3. **✅ Use token classes** - Never hardcode values, use `bg-surface` not `bg-white`
4. **✅ Test Figma fidelity** - Test both presence AND absence of styles
5. **✅ Run validation** - Always run `yarn validate:all` before committing

### Design Token Guidelines

- **Never hardcode token values** - all values must come from Figma
- **Preserve token references** - semantic tokens should reference primitives using `{color.primitive.name}` syntax
- **Follow 8px grid** - all spacing must be multiples of 8
- **Update sync metadata** - always update `figma/sync-manifest.json` with sync timestamp
- **Use semantic names** - `surface` not `white`, conveys purpose better
- **Prefix spacing** - Use `ds-N` to avoid conflicts with Tailwind defaults

### Common Pitfalls to Avoid

❌ **Don't forget to import tokens.css** - Results in transparent backgrounds
❌ **Don't skip Tailwind config** - Token classes won't work
❌ **Don't hardcode colors** - Use `bg-surface` not `bg-white`
❌ **Don't use default Tailwind spacing** - Use `px-ds-2` not `px-4`
❌ **Don't skip testing absence** - Test that unwanted styles (border, shadow) are NOT present
❌ **Don't forget Figma links** - Add design links to Storybook stories

## Common Issues & Solutions

### Issue: Background is transparent

**Cause:** tokens.css not imported

**Solution:**

```css
/* src/web/styles/globals.css */
@import './tokens.css'; /* ← Add this! */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: Tailwind classes don't work

**Cause:** Tokens not in Tailwind config

**Solution:**

```javascript
// tailwind.config.js
colors: {
  'surface': 'var(--ds-color-bg-surface)',  /* ← Add tokens */
}
```

### Issue: Component doesn't match Figma

**Cause:** Using wrong classes or hardcoded values

**Solution:**

- Use design token classes: `bg-surface` not `bg-white`
- Remove styles not in Figma: no `border`, `shadow` unless in design
- Check spacing: use `px-ds-2 py-ds-1` for Figma's 16px/8px

### Issue: No tests

**Cause:** Forgot to create tests

**Solution:**

- Create `[component].test.tsx`
- Test token application
- Test absence of unwanted styles
- Run `yarn validate:sync` to verify

### Issue: Validation fails

**Cause:** Missing critical setup steps

**Solution:**
Run `yarn validate:sync` to see exactly what's missing:

- tokens.css import
- Tailwind config
- Tests
- Storybook links

## Quick Reference Documentation

For additional technical details, see:

- **[docs/visual-testing.md](./docs/visual-testing.md)** - Testing strategies and patterns
- **[docs/architecture.md](./docs/architecture.md)** - Technical architecture details
- **[docs/requirements.md](./docs/requirements.md)** - Project goals and success metrics
- **[FIGMA_MCP_SETUP.md](./FIGMA_MCP_SETUP.md)** - One-time Figma MCP setup

## Example Sync Command

When user says:

```
"Sync design tokens from Figma to the design system"
```

You should:

1. Use Figma MCP to fetch all color styles, text styles, and variables
2. Parse and organize into base and semantic tokens
3. Write JSON files to `src/tokens/`
4. Generate TypeScript index files
5. Validate with Zod
6. Run type-check
7. Create commit with detailed message
