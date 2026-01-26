# Contract: Token Sync CLI

**Feature**: 003-design-system-integration  
**Date**: 2026-01-26  
**Type**: Command Line Interface

## Overview

The token sync CLI fetches design tokens from Figma using Figma MCP and transforms them into CSS variable files consumable by the shadcn/ui design system.

## Command Interface

### Primary Command

```bash
yarn workspace @safe-global/design-system sync-tokens [options]
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--file-key` | string | (from config) | Figma file key |
| `--node-id` | string | (from config) | Figma node ID containing variables |
| `--output` | string | `./src/tokens` | Output directory for CSS files |
| `--format` | enum | `css` | Output format: `css`, `json`, or `both` |
| `--dry-run` | boolean | `false` | Preview changes without writing files |
| `--verbose` | boolean | `false` | Enable detailed logging |

### Configuration File

`.design-system.config.json` at package root:

```json
{
  "figma": {
    "fileKey": "SX3PdSxgY0D7vfGx2ytRWU",
    "nodeId": "95:2000",
    "collectionName": "Foundations"
  },
  "output": {
    "directory": "./src/tokens",
    "formats": ["css", "json"]
  },
  "transform": {
    "colorPrefix": "",
    "spacingPrefix": "spacing-",
    "typographyPrefix": "font-",
    "radiusPrefix": "radius-"
  }
}
```

## Input/Output Contract

### Input: Figma MCP Response

```typescript
interface FigmaMCPResponse {
  [tokenName: string]: string;
}

// Example:
{
  "color/background": "#f4f4f4",
  "color/foreground": "#121312",
  "space/xs": "8",
  "radius/lg": "16",
  "Title": "Font(family: \"DM Sans\", style: Bold, size: 18, weight: 700, lineHeight: 22, letterSpacing: 0.15)"
}
```

### Output: CSS Files

#### colors.css
```css
/**
 * Design System Color Tokens
 * Generated: 2026-01-26T10:30:00Z
 * Source: Figma DS · Foundations (95:2000)
 * DO NOT EDIT MANUALLY - run `yarn sync-tokens` to regenerate
 */

:root {
  --background: #f4f4f4;
  --foreground: #121312;
  --card: #fbfbfb;
  --card-foreground: #353835;
  --muted-foreground: #a3aaa3;
  --border: #f4f4f4;
  --border-surface: #ffffff;
  --text-muted: #cad0cc;
  --state-positive: #00b460;
  --bg-state-positive: #e5f6ec;
  --state-negative: #ff5f72;
  --bg-state-negative: #ffe8eb;
  --primary: #2f2f2f;
}

.dark {
  --background: #121312;
  --foreground: #f5f5f5;
  --card: #1c1c1c;
  --card-foreground: #ffffff;
  --muted-foreground: #ffffff;
  --border: #ffffff;
  --primary: #ffffff;
}
```

#### spacing.css
```css
/**
 * Design System Spacing Tokens
 * Generated: 2026-01-26T10:30:00Z
 */

:root {
  --spacing-1: 4px;
  --spacing-xs: 8px;
  --spacing-3: 12px;
  --spacing-s: 16px;
  --spacing-xl: 32px;
}
```

#### typography.css
```css
/**
 * Design System Typography Tokens
 * Generated: 2026-01-26T10:30:00Z
 */

:root {
  --font-family: 'DM Sans', sans-serif;
  
  /* Title */
  --font-size-title: 18px;
  --font-weight-title: 700;
  --line-height-title: 22px;
  --letter-spacing-title: 0.15px;
  
  /* Subtitle */
  --font-size-subtitle: 16px;
  --font-weight-subtitle: 500;
  --line-height-subtitle: 22px;
  
  /* Body */
  --font-size-body: 14px;
  --font-weight-body: 400;
  --line-height-body: 20px;
  
  /* Small */
  --font-size-small: 12px;
  --font-weight-small: 400;
  --line-height-small: 16px;
}
```

#### radius.css
```css
/**
 * Design System Border Radius Tokens
 * Generated: 2026-01-26T10:30:00Z
 */

:root {
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

#### index.css
```css
/**
 * Design System Tokens - Combined Import
 * Generated: 2026-01-26T10:30:00Z
 */

@import './colors.css';
@import './spacing.css';
@import './typography.css';
@import './radius.css';
```

### Output: tokens.json (Manifest)

```json
{
  "version": "1.0.0",
  "generatedAt": "2026-01-26T10:30:00Z",
  "source": {
    "fileKey": "SX3PdSxgY0D7vfGx2ytRWU",
    "nodeId": "95:2000",
    "url": "https://www.figma.com/design/SX3PdSxgY0D7vfGx2ytRWU/DS-·-Foundations?node-id=95-2000"
  },
  "tokens": [
    {
      "figmaName": "color/background",
      "cssVariable": "--background",
      "category": "color",
      "lightValue": "#f4f4f4",
      "darkValue": "#121312"
    }
  ],
  "stats": {
    "totalTokens": 25,
    "colors": 13,
    "spacing": 5,
    "typography": 4,
    "radius": 2
  }
}
```

## Error Handling

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Configuration error (missing file, invalid JSON) |
| 2 | Figma MCP error (auth, network, invalid node) |
| 3 | Transform error (invalid token format) |
| 4 | Write error (permission denied, disk full) |

### Error Messages

```typescript
interface CLIError {
  code: number;
  message: string;
  details?: string;
  suggestion?: string;
}

// Examples:
{
  code: 2,
  message: "Failed to fetch tokens from Figma",
  details: "Node ID 95:2000 not found in file",
  suggestion: "Verify the node ID exists in the Figma file"
}

{
  code: 3,
  message: "Invalid token format",
  details: "Token 'color/invalid' has unsupported value type",
  suggestion: "Check Figma variable definition"
}
```

### Console Output

#### Success
```
✓ Fetched 25 tokens from Figma (Foundations collection)
✓ Transformed tokens:
  • 13 colors
  • 5 spacing
  • 4 typography
  • 2 radius
✓ Written to ./src/tokens/
  • colors.css (13 tokens)
  • spacing.css (5 tokens)
  • typography.css (4 tokens)
  • radius.css (2 tokens)
  • index.css
  • tokens.json

Token sync complete in 2.3s
```

#### Dry Run
```
[DRY RUN] Would fetch tokens from Figma (SX3PdSxgY0D7vfGx2ytRWU:95:2000)
[DRY RUN] Would write 5 files to ./src/tokens/
[DRY RUN] Changes detected:
  + --new-color: #ff0000 (added)
  ~ --background: #f4f4f4 → #f5f5f5 (changed)
  - --deprecated-token (removed)
```

#### Error
```
✗ Failed to sync tokens

Error: Figma MCP returned invalid response
  Node ID: 95:2000
  File: SX3PdSxgY0D7vfGx2ytRWU

Suggestion: Ensure you have the Figma file open in the desktop app
            and the Figma MCP is running.

Exit code: 2
```

## Integration Points

### Package.json Scripts

```json
{
  "scripts": {
    "sync-tokens": "ts-node src/cli/sync-tokens.ts",
    "sync-tokens:dry": "ts-node src/cli/sync-tokens.ts --dry-run",
    "sync-tokens:verbose": "ts-node src/cli/sync-tokens.ts --verbose"
  }
}
```

### Workspace Root Script

```json
{
  "scripts": {
    "design-system:sync": "yarn workspace @safe-global/design-system sync-tokens"
  }
}
```

## Testing Contract

### Unit Tests

```typescript
describe('sync-tokens CLI', () => {
  it('transforms color tokens correctly', () => {
    const input = { 'color/background': '#f4f4f4' };
    const output = transformTokens(input);
    expect(output.colors).toContain('--background: #f4f4f4');
  });

  it('handles missing dark mode gracefully', () => {
    // Falls back to light value
  });

  it('validates CSS color format', () => {
    const invalid = { 'color/bad': 'not-a-color' };
    expect(() => transformTokens(invalid)).toThrow();
  });

  it('generates valid CSS syntax', () => {
    // CSS output should be parseable
  });
});
```

### Integration Tests

```typescript
describe('sync-tokens integration', () => {
  it('connects to Figma MCP', async () => {
    // Requires Figma MCP running
  });

  it('writes files to output directory', async () => {
    // Check file system
  });

  it('reports diff on subsequent runs', async () => {
    // Check change detection
  });
});
```
