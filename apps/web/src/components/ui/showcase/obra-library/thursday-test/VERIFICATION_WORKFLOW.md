# Figma-to-Code Verification Workflow

## Overview

This document outlines a systematic process for verifying Figma implementations are pixel-perfect. Use this after the initial implementation to catch and fix discrepancies.

## The 5-Phase Verification Process

### Phase 1: Component Inventory

**Goal:** Create a complete list of all components/elements in the design.

**Steps:**
1. Fetch the full design context from Figma
2. Extract all unique node IDs and their types
3. Create a checklist of every component to verify

**Tools:**
```
mcp__figma-remote-mcp__get_design_context(fileKey, nodeId)
```

**Output:** Markdown checklist like:
```markdown
## Component Checklist
- [ ] Sidebar (node: 1:3236)
  - [ ] Header with workspace switcher
  - [ ] Navigation items (Home, Transactions, Portfolio, Apps)
  - [ ] Defi section (Swap, Bridge, Stake, Earn)
  - [ ] Footer (Settings)
- [ ] Main content area
  - [ ] TotalValueCard (node: 5:1620)
  - [ ] AssetsCard (node: 5:1624)
  - [ ] PendingCard (node: 5:1650)
```

---

### Phase 2: Visual Comparison

**Goal:** Compare Figma screenshot against implemented component screenshot.

**Steps:**
1. Get Figma screenshot of the target node
2. Take screenshot of implemented component in Storybook
3. Overlay or side-by-side compare
4. Note any visual differences

**Tools:**
```
mcp__figma-remote-mcp__get_screenshot(fileKey, nodeId)
```

**Comparison Checklist:**
- [ ] Overall layout matches
- [ ] Spacing between elements
- [ ] Component sizes (width/height)
- [ ] Colors and backgrounds
- [ ] Typography (font size, weight, line height)
- [ ] Border radius
- [ ] Shadows and elevation
- [ ] Icons (size, color, alignment)

---

### Phase 3: Attribute-by-Attribute Verification

**Goal:** Verify every CSS/style attribute matches Figma specs.

**For each component, verify:**

#### Layout & Spacing
| Attribute | Figma Value | Implementation | Match? |
|-----------|-------------|----------------|--------|
| width | | | |
| height | | | |
| padding | | | |
| margin/gap | | | |
| flex direction | | | |
| align-items | | | |
| justify-content | | | |

#### Typography
| Attribute | Figma Value | Implementation | Match? |
|-----------|-------------|----------------|--------|
| font-family | | | |
| font-size | | | |
| font-weight | | | |
| line-height | | | |
| letter-spacing | | | |
| text-color | | | |

#### Visual Styling
| Attribute | Figma Value | Implementation | Match? |
|-----------|-------------|----------------|--------|
| background | | | |
| border | | | |
| border-radius | | | |
| box-shadow | | | |
| opacity | | | |

---

### Phase 4: Interactive States Verification

**Goal:** Ensure all interactive states match design specs.

**States to verify:**
- [ ] Default/resting state
- [ ] Hover state
- [ ] Active/pressed state
- [ ] Focus state
- [ ] Disabled state
- [ ] Selected/active state (for navigation)

**For each interactive element:**
1. Check if Figma has variants for different states
2. Verify implementation handles all states
3. Compare visual appearance of each state

---

### Phase 5: Responsive & Edge Cases

**Goal:** Verify behavior at different sizes and with different content.

**Checks:**
- [ ] Container at minimum expected width
- [ ] Container at maximum expected width
- [ ] Long text content (truncation/wrapping)
- [ ] Empty states
- [ ] Loading states
- [ ] Error states

---

## Verification Script Template

Use this template for systematic verification:

```markdown
# Verification Report: [Component Name]

## Figma Reference
- File: [URL]
- Node ID: [ID]
- Screenshot: [attached]

## Implementation Reference
- File: [path]
- Storybook: [story name]
- Screenshot: [attached]

## Discrepancies Found

### 1. [Issue Title]
- **Location:** [element/component]
- **Expected:** [Figma value]
- **Actual:** [Implementation value]
- **Fix:** [what needs to change]

### 2. [Issue Title]
...

## Verification Checklist

### Layout
- [ ] Overall structure matches
- [ ] Spacing/gaps correct
- [ ] Padding correct
- [ ] Alignment correct

### Typography
- [ ] Font sizes correct
- [ ] Font weights correct
- [ ] Line heights correct
- [ ] Text colors correct

### Colors & Styling
- [ ] Background colors correct
- [ ] Border styles correct
- [ ] Border radius correct
- [ ] Shadows correct

### Components
- [ ] All child components present
- [ ] Component variants correct
- [ ] Icons correct (size, color)
- [ ] Avatars correct

### Interactions
- [ ] Hover states work
- [ ] Click handlers work
- [ ] Focus states correct
```

---

## Automated Checks (Future Enhancement)

Consider implementing:

1. **Visual regression testing** with tools like:
   - Chromatic
   - Percy
   - Playwright visual comparisons

2. **Design token validation**:
   - Extract Figma variables
   - Compare against CSS variables
   - Flag any hardcoded values

3. **Accessibility audit**:
   - Color contrast
   - Focus indicators
   - ARIA attributes

---

## Example Verification Session

### Step 1: Fetch Figma Context
```
AI: Get design context for node 1:3235
→ Returns component tree with all properties
```

### Step 2: Create Component Inventory
```
AI: Based on the context, I see:
- Sidebar with 3 sections
- TotalValueCard
- AssetsCard with table (4 rows)
- PendingCard with 2 items
```

### Step 3: Get Screenshots
```
AI: Get screenshot for node 1:3235
→ Returns Figma rendering

AI: [User provides Storybook screenshot or AI takes one]
```

### Step 4: Compare & Document
```
AI: Comparing screenshots, I notice:
1. Gap between cards is 24px in Figma but 16px in implementation
2. Card border-radius is 12px in Figma but 8px in implementation
3. Avatar size is 32px in Figma but 24px in implementation
```

### Step 5: Fix & Re-verify
```
AI: Applying fixes...
AI: Re-checking... all issues resolved.
```

---

## Quick Reference Commands

```bash
# Run Storybook for visual testing
yarn workspace @safe-global/web storybook

# Take screenshot with Playwright (if configured)
yarn workspace @safe-global/web test:visual

# Check design tokens
yarn workspace @safe-global/theme type-check
```
