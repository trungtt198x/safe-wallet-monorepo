# Data Model: Design System Integration

**Feature**: 003-design-system-integration  
**Date**: 2026-01-26

## Overview

The design system data model defines the structure of design tokens, their transformation from Figma, and their representation in code. This is a configuration/asset system, not a database model.

## Entities

### 1. Design Token

A design token represents a single design decision (color, spacing, typography, radius).

```typescript
interface DesignToken {
  /** Original name from Figma (e.g., "color/background") */
  figmaName: string;
  
  /** CSS variable name (e.g., "--background") */
  cssVariable: string;
  
  /** Category for organization */
  category: 'color' | 'spacing' | 'typography' | 'radius';
  
  /** Light mode value */
  lightValue: string;
  
  /** Dark mode value (optional, falls back to light) */
  darkValue?: string;
  
  /** Human-readable description (from Figma if available) */
  description?: string;
}
```

### 2. Token Collection

A group of related tokens synced from a single Figma variable collection.

```typescript
interface TokenCollection {
  /** Figma file key */
  fileKey: string;
  
  /** Figma node ID containing variables */
  nodeId: string;
  
  /** Collection name (e.g., "Foundations") */
  name: string;
  
  /** Last sync timestamp */
  lastSynced: string; // ISO 8601
  
  /** All tokens in this collection */
  tokens: DesignToken[];
}
```

### 3. Typography Token

Extended token type for font definitions.

```typescript
interface TypographyToken extends DesignToken {
  category: 'typography';
  
  /** Decomposed font properties */
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
}
```

### 4. Component Definition

Metadata for a design system component (stored as story metadata).

```typescript
interface ComponentDefinition {
  /** Component name (e.g., "Button") */
  name: string;
  
  /** Atomic design level */
  level: 'atom' | 'molecule' | 'organism' | 'template' | 'page';
  
  /** Path to component file */
  path: string;
  
  /** Path to Storybook story */
  storyPath: string;
  
  /** Tokens consumed by this component */
  consumedTokens: string[];
  
  /** Component variants */
  variants: string[];
}
```

## Token Categories

### Colors

| Token Name | CSS Variable | Light Value | Dark Value |
|------------|--------------|-------------|------------|
| background | `--background` | #f4f4f4 | #121312 |
| foreground | `--foreground` | #121312 | #f5f5f5 |
| card | `--card` | #fbfbfb | #1c1c1c |
| card-foreground | `--card-foreground` | #353835 | #ffffff |
| muted-foreground | `--muted-foreground` | #a3aaa3 | #ffffff |
| border | `--border` | #f4f4f4 | #ffffff |
| border-surface | `--border-surface` | #ffffff | #ffffff |
| text-muted | `--text-muted` | #cad0cc | #ffffff |
| state-positive | `--state-positive` | #00b460 | #00b460 |
| bg-state-positive | `--bg-state-positive` | #e5f6ec | #e5f6ec |
| state-negative | `--state-negative` | #ff5f72 | #ff5f72 |
| bg-state-negative | `--bg-state-negative` | #ffe8eb | #ffe8eb |
| primary | `--primary` | #2f2f2f | #ffffff |

### Spacing

| Token Name | CSS Variable | Value |
|------------|--------------|-------|
| space-1 | `--spacing-1` | 4px |
| space-2 / xs | `--spacing-xs` | 8px |
| space-3 | `--spacing-3` | 12px |
| space-4 / s | `--spacing-s` | 16px |
| space-xl | `--spacing-xl` | 32px |

### Typography

| Token Name | CSS Variables | Values |
|------------|---------------|--------|
| Title | `--font-size-title`, `--font-weight-title`, `--line-height-title` | 18px, 700, 22px |
| Subtitle | `--font-size-subtitle`, `--font-weight-subtitle`, `--line-height-subtitle` | 16px, 500, 22px |
| Body | `--font-size-body`, `--font-weight-body`, `--line-height-body` | 14px, 400, 20px |
| Small | `--font-size-small`, `--font-weight-small`, `--line-height-small` | 12px, 400, 16px |

**Font Family**: DM Sans (`--font-family: 'DM Sans', sans-serif`)

### Radius

| Token Name | CSS Variable | Value |
|------------|--------------|-------|
| radius-lg | `--radius-lg` | 16px |
| radius-xl | `--radius-xl` | 24px |

## File Structure

```text
packages/design-system/src/tokens/
├── colors.css          # Color tokens with :root and .dark
├── spacing.css         # Spacing tokens
├── typography.css      # Typography tokens
├── radius.css          # Border radius tokens
├── index.css           # Combined import
└── tokens.json         # Machine-readable token manifest
```

### tokens.json Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "version": { "type": "string" },
    "lastSynced": { "type": "string", "format": "date-time" },
    "source": {
      "type": "object",
      "properties": {
        "fileKey": { "type": "string" },
        "nodeId": { "type": "string" },
        "url": { "type": "string", "format": "uri" }
      }
    },
    "tokens": {
      "type": "array",
      "items": { "$ref": "#/$defs/DesignToken" }
    }
  },
  "$defs": {
    "DesignToken": {
      "type": "object",
      "properties": {
        "figmaName": { "type": "string" },
        "cssVariable": { "type": "string" },
        "category": { "enum": ["color", "spacing", "typography", "radius"] },
        "lightValue": { "type": "string" },
        "darkValue": { "type": "string" }
      },
      "required": ["figmaName", "cssVariable", "category", "lightValue"]
    }
  }
}
```

## Relationships

```
┌─────────────────┐
│ TokenCollection │
│ (Figma source)  │
└────────┬────────┘
         │ contains 1:N
         ▼
┌─────────────────┐
│  DesignToken    │
│  (individual)   │
└────────┬────────┘
         │ consumed by 1:N
         ▼
┌─────────────────────┐
│ ComponentDefinition │
│ (shadcn component)  │
└─────────────────────┘
```

## Validation Rules

1. **Token Names**: Must be valid CSS custom property names (lowercase, hyphens allowed)
2. **Color Values**: Must be valid CSS color values (hex, rgb, hsl)
3. **Spacing Values**: Must include unit (px, rem, em)
4. **No Duplicates**: CSS variable names must be unique within a collection
5. **Required Tokens**: Components must declare which tokens they consume
6. **Dark Mode**: Color tokens should define both light and dark values

## State Transitions

### Token Sync Lifecycle

```
┌─────────┐     sync      ┌──────────┐    transform    ┌───────────┐
│ Figma   │ ─────────────▶│ Raw JSON │ ──────────────▶ │ CSS Files │
│ Source  │               │ (memory) │                 │ (output)  │
└─────────┘               └──────────┘                 └───────────┘
     │                          │                            │
     │                          ▼                            ▼
     │                    ┌──────────┐                ┌───────────┐
     │                    │ Validate │                │ tokens.json│
     │                    │ & Diff   │                │ (manifest) │
     │                    └──────────┘                └───────────┘
     │                          │
     └──────────────────────────┘
              (error reporting)
```

### Component Development Lifecycle

```
┌────────────┐    scaffold    ┌─────────────┐     develop     ┌──────────────┐
│ shadcn CLI │ ─────────────▶ │ Component   │ ──────────────▶ │ Storybook    │
│ (add)      │                │ (raw)       │                 │ (documented) │
└────────────┘                └─────────────┘                 └──────────────┘
                                    │                               │
                                    ▼                               ▼
                              ┌─────────────┐                ┌──────────────┐
                              │ Apply       │                │ Visual       │
                              │ Tokens      │                │ Regression   │
                              └─────────────┘                │ (Lost Pixel) │
                                                             └──────────────┘
```
