# Design Token Naming Conventions

This document defines the naming conventions for design tokens in Figma. These conventions ensure consistent token syncing between Figma and code.

## Token Categories

### Colors

**Primitive Colors** (Base palette):

```
Primitive/[Name]                  → Base color value
Primitive/[Name]-[Scale]          → Base color with scale

Examples:
Primitive/Black                   → #121312
Primitive/White                   → #FFFFFF
Primitive/Green-400               → #12FF80
Primitive/Grey-500                → #E0E0E0
```

**Semantic Colors** (Contextual usage):

```
Semantic/[Category]/[Variant]     → Semantic color (theme-specific)

Examples:
Semantic/Primary/Main             → {Primitive/Green-400}
Semantic/Primary/Light            → Lighter variant
Semantic/Primary/Dark             → Darker variant
Semantic/Text/Primary             → {Primitive/Black}
Semantic/Text/Secondary           → {Primitive/Grey-500}
Semantic/Background/Default       → #F4F4F4
Semantic/Background/Paper         → {Primitive/White}
```

### Typography

**Text Styles**:

```
[Category]/[Size]/[Weight]        → Text style definition

Examples:
Heading/Large/Bold                → 32px / Bold / 1.2 line-height
Heading/Medium/Bold               → 24px / Bold / 1.3 line-height
Body/Large/Regular                → 18px / Regular / 1.5 line-height
Body/Medium/Regular               → 16px / Regular / 1.5 line-height
Body/Small/Regular                → 14px / Regular / 1.5 line-height
Caption/Small/Regular             → 12px / Regular / 1.4 line-height
```

### Spacing

**Spacing Variables** (8px grid system):

```
Spacing/[Size]                    → [Value]px (must be multiple of 8)

Examples:
Spacing/XXS                       → 8px
Spacing/XS                        → 16px
Spacing/SM                        → 24px
Spacing/MD                        → 32px
Spacing/LG                        → 48px
Spacing/XL                        → 64px
Spacing/XXL                       → 96px
```

**Critical Rule:** All spacing values MUST be multiples of 8px. This ensures consistent spacing across all platforms.

### Border Radius

**Radius Variables**:

```
Radius/[Size]                     → Border radius value

Examples:
Radius/SM                         → 4px
Radius/Default                    → 6px
Radius/MD                         → 12px
Radius/LG                         → 16px
Radius/XL                         → 24px
Radius/Full                       → 9999px (fully rounded)
```

### Shadows

**Shadow Variables**:

```
Shadow/[Level]                    → Elevation shadow

Examples:
Shadow/SM                         → Small elevation
Shadow/MD                         → Medium elevation
Shadow/LG                         → Large elevation
Shadow/XL                         → Extra large elevation
```

## Components

**Component Naming**:

```
[ComponentName]                   → PascalCase

Examples:
Button
TextField
Card
Alert
Dialog
Dropdown
Badge
Tooltip
```

**Component Variants**:

- Use Figma variants for different states (default, hover, active, disabled)
- Use component sets for size variants (small, medium, large)
- Use properties for visual variants (primary, secondary, outlined, ghost)

## Token References

**Semantic tokens should reference primitive tokens:**

```json
// Good - References primitive token
{
  "value": "{color.primitive.green-400}",
  "type": "color"
}

// Bad - Hardcoded value
{
  "value": "#12FF80",
  "type": "color"
}
```

This allows changing primitive colors to cascade to all semantic uses.

## Validation Rules

All tokens synced from Figma must pass these validations:

1. **Colors**: Valid hex format (#RRGGBB or #RRGGBBAA)
2. **Spacing**: Multiples of 8px
3. **References**: Valid token reference syntax `{category.name}`
4. **Naming**: Follow conventions above (no spaces, consistent casing)

## Usage in Code

### Tailwind Classes

```typescript
// Use semantic color names
className = 'bg-surface text-primary'

// Use spacing with ds- prefix (to avoid Tailwind conflicts)
className = 'px-ds-2 py-ds-1' // 16px horizontal, 8px vertical

// Use radius size names
className = 'rounded-md' // Uses --ds-radius-md
```

### CSS Variables

```css
/* Design tokens are available as CSS variables */
:root {
  --ds-color-primitive-black: #121312;
  --ds-color-bg-surface: #ffffff;
  --ds-spacing-8: 8px;
  --ds-spacing-16: 16px;
  --ds-radius-md: 12px;
}
```

## Resources

- [CLAUDE.md](../CLAUDE.md) - Complete AI sync workflow
- [FIGMA_MCP_SETUP.md](../FIGMA_MCP_SETUP.md) - Figma MCP setup
- [architecture.md](./architecture.md) - Technical architecture
