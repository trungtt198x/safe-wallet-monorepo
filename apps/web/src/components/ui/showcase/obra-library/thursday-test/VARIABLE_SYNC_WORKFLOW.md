# Figma Variable Sync Workflow

## Rules

1. **Only update existing variables** - Never add new variables
2. **Keep code order** - Only change values, not structure
3. **Direct mappings only** - Only update if Figma has a matching variable
4. **Use Figma plugin export** - Do NOT use Figma MCP for variables (incomplete data)

## Process

1. Export variables from Figma using the CSS Variables plugin
2. Store export in `figma-export.css` as reference
3. Compare Figma values vs `globals.css` existing variables
4. Update only values that differ (use direct hex values)
5. Verify: `yarn workspace @safe-global/web type-check`

## Source Files

- **Source of truth**: `figma-export.css` (plugin export)
- **Target**: `apps/web/src/styles/globals.css`

## Variable Mapping

| Figma Export | CSS |
|--------------|-----|
| `--general-background` | `--background` |
| `--general-foreground` | `--foreground` |
| `--general-primary` | `--primary` |
| `--general-primary-foreground` | `--primary-foreground` |
| `--general-secondary` | `--secondary` |
| `--general-secondary-foreground` | `--secondary-foreground` |
| `--general-muted` | `--muted` |
| `--general-muted-foreground` | `--muted-foreground` |
| `--general-accent` | `--accent` |
| `--general-accent-foreground` | `--accent-foreground` |
| `--general-destructive` | `--destructive` |
| `--general-border` | `--border` |
| `--general-input` | `--input` |
| `--card-card` | `--card` |
| `--card-card-foreground` | `--card-foreground` |
| `--popover-popover` | `--popover` |
| `--popover-popover-foreground` | `--popover-foreground` |
| `--focus-ring` | `--ring` |
| `--sidebar-sidebar` | `--sidebar` |
| `--sidebar-sidebar-foreground` | `--sidebar-foreground` |
| `--sidebar-sidebar-primary` | `--sidebar-primary` |
| `--sidebar-sidebar-primary-foreground` | `--sidebar-primary-foreground` |
| `--sidebar-sidebar-accent` | `--sidebar-accent` |
| `--sidebar-sidebar-accent-foreground` | `--sidebar-accent-foreground` |
| `--sidebar-sidebar-border` | `--sidebar-border` |
| `--sidebar-sidebar-ring` | `--sidebar-ring` |
