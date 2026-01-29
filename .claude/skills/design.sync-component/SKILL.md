---
name: design.sync-component
description: Sync a UI component from Figma to code using the component sync workflow. Use when updating components to match Figma designs.
argument-hint: "[component-name]"
allowed-tools:
  - mcp__figma-remote-mcp__get_design_context
  - mcp__figma-remote-mcp__get_screenshot
  - Read
  - Edit
  - Bash
  - Grep
---

# Sync Component from Figma

Sync the **$ARGUMENTS** component from Figma to code.

## Source Files

- **Figma File**: `trBVcpjZslO63zxiNUI9io` (Obra shadcn-ui safe)
- **Component Mapping**: `apps/web/src/components/ui/docs/figma-code-connect.md`
- **Target**: `apps/web/src/components/ui/<component>.tsx`

## Process

### 1. Find Node ID

Look up the component in `figma-code-connect.md` to get the Figma node ID.

### 2. Fetch Design Context

```
mcp__figma-remote-mcp__get_design_context(
  fileKey: "trBVcpjZslO63zxiNUI9io",
  nodeId: "<node-id>",
  disableCodeConnect: true
)
```

Also get a screenshot for visual reference:
```
mcp__figma-remote-mcp__get_screenshot(fileKey, nodeId)
```

### 3. Compare & Document

| Check | What to Compare |
|-------|-----------------|
| Sizes | Verify px values match (size-6=24px, size-8=32px, size-10=40px) |
| Colors | Fill colors → bg-*, text-* classes |
| Border | border-*, rounded-* classes |
| Shadow | shadow-* classes (Figma often has none) |
| Variants | CVA variants object keys |

### 4. Update Code

**Only sync when Figma actually changed.** Don't remove code defaults that improve DX.

Add/update component header comment:
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

### 5. Verify

Run type-check:
```bash
yarn workspace @safe-global/web type-check
```

## Rules

1. **Document the delta** - Note intentional differences, only sync breaking changes
2. **Preserve code patterns** - Keep CVA structure, only update classes/variants
3. **Keep existing functionality** - Don't remove event handlers, refs, or accessibility
4. **Verify sizes match** - Check actual pixel values, not just naming conventions
