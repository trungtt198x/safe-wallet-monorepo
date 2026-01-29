# Figma Component Sync Workflow

## Rules

1. **Use Figma MCP** - `get_design_context` with `disableCodeConnect: true` for raw styles
2. **Document the delta** - Note intentional differences, only sync breaking changes
3. **Preserve code patterns** - Keep CVA structure, only update classes/variants
4. **Keep existing functionality** - Don't remove event handlers, refs, or accessibility

## Sync Philosophy

Figma shows **minimal design intent**. Code adds **developer convenience** (defaults, spacing, shadows).

**Only sync when:**
- Figma design actually changed (new colors, radius, variants)
- Breaking visual changes that affect the design system

**Don't sync:**
- Code defaults that improve DX (padding, gap, shadows)
- Composition differences (slots vs children)

## Source Files

- **Figma File**: `trBVcpjZslO63zxiNUI9io` (Obra shadcn-ui safe)
- **Component Mapping**: `apps/web/src/components/ui/docs/figma-code-connect.md`
- **Target**: `apps/web/src/components/ui/<component>.tsx`

## Process

### 1. Identify Component Node

Look up the component in `figma-code-connect.md` to get the node ID:

| Component | Node ID |
|-----------|---------|
| Button | `9:1071` |
| Card | `179:29234` |
| etc. | See mapping doc |

### 2. Fetch Design Context

```
mcp__figma-remote-mcp__get_design_context(
  fileKey: "trBVcpjZslO63zxiNUI9io",
  nodeId: "<node-id>",
  disableCodeConnect: true  // Get raw styles, not just Code Connect refs
)
```

Also get screenshot for visual reference:
```
mcp__figma-remote-mcp__get_screenshot(fileKey, nodeId)
```

### 3. Compare & Update

| Figma Property | Code Location |
|----------------|---------------|
| Fill colors | CVA variant classes (bg-*, text-*) |
| Border | CVA classes (border-*, rounded-*) |
| Padding/Gap | CVA size classes (px-*, py-*, gap-*) |
| Typography | CVA classes (text-*, font-*) |
| Variants | CVA `variants` object keys |
| States (hover, focus) | CVA pseudo-classes (hover:*, focus:*) |
| **Sizes** | Check px values match Figma (size-6=24px, size-8=32px, size-10=40px) |

**Important: Verify size values match Figma**
- Figma sizes may use different names (e.g., "Regular", "Small", "Tiny")
- Code uses semantic names (e.g., "default", "sm", "xs")
- Always check the actual pixel values match, not just the names

### 4. Update Code Structure

**Add component header comment** with Figma link, intentional differences, and changelog:
```tsx
/**
 * ComponentName
 *
 * Figma: https://www.figma.com/design/trBVcpjZslO63zxiNUI9io/?node-id=XX:XXXX
 *
 * Intentional differences from Figma:
 * - property: reason for difference
 *
 * Changelog:
 * - YYYY-MM-DD: Description of sync changes
 */
```

**Styling changes**: Update Tailwind classes in CVA definition
```tsx
// Before
variant: { default: 'bg-primary' }
// After (if Figma changed)
variant: { default: 'bg-primary/90' }
```

**New variants**: Add to CVA variants object
```tsx
variants: {
  variant: {
    default: '...',
    newVariant: '...', // Added from Figma
  }
}
```

**Slot changes**: Update component structure
```tsx
// Add/modify sub-components if Figma structure changed
function CardFooter() { ... }
```

### 5. Verify

```bash
yarn workspace @safe-global/web type-check
yarn workspace @safe-global/web storybook  # Visual verification
```

## Sync Checklist

- [ ] Fetched latest design context from MCP
- [ ] Compared variants (names match Figma)
- [ ] Updated styling classes
- [ ] Added any new variants
- [ ] Updated component structure if needed
- [ ] Type-check passes
- [ ] Verified in Storybook

## What NOT to Change

- Component props interface (unless adding new variants)
- Event handling logic
- Accessibility attributes (aria-*, role)
- React refs and forwarding
- Integration with Base UI primitives
