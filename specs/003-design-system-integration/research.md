# Research: Design System Integration

**Feature**: 003-design-system-integration  
**Date**: 2026-01-26  
**Status**: Complete

## Research Topics

1. [shadcn/ui Integration with Next.js](#1-shadcnui-integration-with-nextjs)
2. [Figma MCP Token Extraction](#2-figma-mcp-token-extraction)
3. [Tailwind CSS Configuration](#3-tailwind-css-configuration)
4. [Token Transformation Strategy](#4-token-transformation-strategy)
5. [Storybook Token Documentation](#5-storybook-token-documentation)
6. [Coexistence with Existing Theme](#6-coexistence-with-existing-theme)

---

## 1. shadcn/ui Integration with Next.js

### Decision
Use shadcn/ui CLI to scaffold components into `apps/web/src/components/ui/`, configured with Tailwind CSS and CSS variables for theming.

### Rationale
- shadcn/ui is not a dependency but a collection of copy-paste components - full ownership and customization
- Uses Radix UI primitives for accessibility (WCAG 2.1 AA compliant)
- CSS variable-based theming aligns with Figma token strategy
- Active community with Next.js 14+ support
- Components are tree-shakeable (only import what you use)

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Radix UI directly | More setup required, no pre-built styling patterns |
| Chakra UI | Heavier runtime, different theming model |
| Headless UI | Smaller component set, Tailwind Labs maintained (potential conflict) |
| Custom from scratch | Time-consuming, accessibility expertise required |

### Implementation Notes
- Initialize with shadcn preset (Nova style, neutral base, large radius):
  ```bash
  cd apps/web
  yarn dlx shadcn@latest init --preset "https://ui.shadcn.com/init?base=base&style=nova&baseColor=neutral&theme=amber&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=large&template=next"
  ```
- **Font Override**: Replace Inter with DM Sans (existing project font from Figma tokens)
- Configure `components.json` to use `src/components/ui` path
- CSS variables will be injected via `design-system.css` import

### shadcn Preset Configuration
| Setting | Value | Notes |
|---------|-------|-------|
| Base | base | Standard base components |
| Style | nova | Modern, clean aesthetic |
| Base Color | neutral | Grayscale palette |
| Theme | amber | Accent color (will be overridden by Figma tokens) |
| Icon Library | lucide | Lucide icons |
| Font | DM Sans | **Override from Inter** - matches Figma tokens |
| Menu Accent | subtle | Subtle menu hover states |
| Radius | large | Matches Figma radius tokens (16px, 24px) |
| Template | next | Next.js template |

---

## 2. Figma MCP Token Extraction

### Decision
Use Figma MCP `get_variable_defs` tool via a Node.js CLI script to extract tokens from the "DS · Foundations" Figma file.

### Rationale
- Direct integration with Figma Variables API
- Already verified working with node-id `95:2000`
- Returns structured JSON with all token categories
- No additional Figma API token management needed (MCP handles auth)

### Figma Token Structure (Verified)
```json
{
  "color/background": "#f4f4f4",
  "color/foreground": "#121312",
  "color/card": "#fbfbfb",
  "color/card-foreground": "#353835",
  "color/muted-foreground": "#a3aaa3",
  "color/border": "#f4f4f4",
  "color/state positive": "#00b460",
  "color/state negative": "#ff5f72",
  "space/xs": "8",
  "space/s": "16",
  "space/xl": "32",
  "radius/lg": "16",
  "radius/xl": "24",
  "Title": "Font(family: \"DM Sans\", style: Bold, size: 18...)",
  "Body": "Font(family: \"DM Sans\", style: Regular, size: 14...)"
}
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Figma REST API directly | Requires API token management, more complex auth |
| Tokens Studio plugin | Additional Figma plugin dependency |
| Manual token copy | Error-prone, no sync capability |
| Style Dictionary | Adds build complexity, overkill for current scale |

### Implementation Notes
- CLI will call Figma MCP via child process or direct integration
- Transform Figma naming (e.g., `color/background`) to CSS variable format (`--background`)
- Handle light/dark mode by generating separate variable sets

---

## 3. Tailwind CSS Configuration

### Decision
Add Tailwind CSS to `apps/web/` configured to use CSS variables from the design system, extending (not replacing) the existing build.

### Rationale
- shadcn/ui requires Tailwind CSS for utility classes
- CSS variables allow runtime theme switching (light/dark)
- Tailwind can coexist with existing MUI/CSS setup via content path configuration
- JIT mode ensures minimal CSS bundle impact

### Configuration Approach
```typescript
// tailwind.config.ts
export default {
  content: [
    './src/components/ui/**/*.{ts,tsx}',
    './src/features/design-system/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        border: 'var(--border)',
        // ... mapped from Figma tokens
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
}
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| No Tailwind (CSS modules) | shadcn/ui expects Tailwind utilities |
| Replace all styling with Tailwind | Too invasive, existing MUI relies on different system |
| CSS-in-JS (Emotion/styled) | Different paradigm, doesn't align with shadcn approach |

### Implementation Notes
- Scope Tailwind to specific paths to avoid styling conflicts
- Use `@layer` directives to control specificity
- PostCSS already configured in Next.js, minimal setup needed

---

## 4. Token Transformation Strategy

### Decision
Transform Figma tokens to shadcn-compatible CSS variables using a simple mapping script. Output to `packages/design-system/src/tokens/`.

### Transformation Rules

| Figma Format | CSS Variable | Notes |
|--------------|--------------|-------|
| `color/background` | `--background` | Strip `color/` prefix |
| `color/card-foreground` | `--card-foreground` | Keep hyphenated names |
| `color/state positive` | `--state-positive` | Replace spaces with hyphens |
| `space/xs` | `--spacing-xs` | Add `spacing-` prefix for clarity |
| `radius/lg` | `--radius-lg` | Keep as-is |
| `Title` (Font) | `--font-title-*` | Decompose into multiple vars |

### Output Structure
```css
/* colors.css */
:root {
  --background: #f4f4f4;
  --foreground: #121312;
  --card: #fbfbfb;
  /* ... */
}

.dark {
  --background: #121312;
  --foreground: #f5f5f5;
  --card: #1c1c1c;
  /* ... */
}

/* spacing.css */
:root {
  --spacing-xs: 8px;
  --spacing-s: 16px;
  --spacing-xl: 32px;
}

/* typography.css */
:root {
  --font-family: 'DM Sans', sans-serif;
  --font-size-title: 18px;
  --font-weight-title: 700;
  --line-height-title: 22px;
  /* ... */
}
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| JSON token format | CSS variables preferred for runtime theming |
| TypeScript constants | Less flexible for CSS consumption |
| Sass variables | Additional preprocessor, not needed |

---

## 5. Storybook Token Documentation

### Decision
Create a dedicated "Foundations" section in Storybook using MDX docs to display tokens visually, leveraging existing Storybook setup.

### Rationale
- Storybook already configured in `apps/web/`
- MDX allows rich documentation with live token previews
- Serves as living documentation for designers and developers
- Lost Pixel integration catches visual regressions

### Documentation Structure
```
stories/
├── foundations/
│   ├── Colors.mdx         # Color swatches with light/dark modes
│   ├── Typography.mdx     # Font scales with examples
│   ├── Spacing.mdx        # Spacing scale visualization
│   └── Radius.mdx         # Border radius examples
└── components/
    ├── Button.stories.tsx
    └── ...
```

### Token Display Component
```tsx
// TokenSwatch.tsx - reusable for color documentation
export const TokenSwatch = ({ name, variable }: Props) => (
  <div className="flex items-center gap-4">
    <div 
      className="w-12 h-12 rounded border"
      style={{ backgroundColor: `var(${variable})` }}
    />
    <div>
      <code>{variable}</code>
      <span className="text-muted-foreground">{name}</span>
    </div>
  </div>
);
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Separate docs site | Fragmenting documentation, extra maintenance |
| Notion/Confluence | Not code-integrated, can drift from implementation |
| README only | No visual representation of tokens |

---

## 6. Coexistence with Existing Theme

### Decision
Run shadcn/CSS variable system in parallel with existing `@safe-global/theme` MUI system. No cross-contamination via scoped imports.

### Rationale
- Enables gradual adoption without breaking existing features
- Clear boundary: new features use shadcn, existing use MUI
- No forced migration timeline
- Constitution compliance (Theme System Integrity justified)

### Coexistence Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    apps/web                              │
├─────────────────────────┬───────────────────────────────┤
│   Existing Features     │     New Features              │
│   (MUI components)      │     (shadcn components)       │
│                         │                               │
│   imports from:         │     imports from:             │
│   @safe-global/theme    │     packages/design-system    │
│   MUI theme provider    │     CSS variables             │
│                         │                               │
│   vars.css (generated)  │     design-system.css         │
└─────────────────────────┴───────────────────────────────┘
```

### Boundary Rules
1. **New features** in `src/features/*` MUST use shadcn components from `src/components/ui/`
2. **Existing features** continue using MUI components - no changes required
3. **Shared layouts** (e.g., sidebar, header) remain MUI until intentional migration
4. **Token imports** are mutually exclusive per component tree

### Migration Path (Future)
When ready to migrate an existing feature:
1. Create parallel shadcn version in `src/features/[feature]/v2/`
2. Feature flag to switch between versions
3. Remove MUI version once stable
4. Not in scope for Phase 1

---

## Summary

| Topic | Decision | Confidence |
|-------|----------|------------|
| Component Library | shadcn/ui | High |
| Token Source | Figma MCP (`get_variable_defs`) | High (verified) |
| CSS Framework | Tailwind CSS (scoped) | High |
| Token Format | CSS Variables | High |
| Documentation | Storybook MDX | High |
| Coexistence | Parallel systems, no migration | High |

**All NEEDS CLARIFICATION items resolved. Ready for Phase 1.**
