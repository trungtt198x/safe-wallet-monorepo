# Thursday Test: Figma Code Connect Experiment

## Overview

This experiment compares three different Figma component structures to evaluate how Code Connect integration affects code generation quality.

## Figma Designs

| Version | Node ID | Name | Key Characteristic |
|---------|---------|------|-------------------|
| V1 | `15:2185` | "assets v1 - less componized" | Inline styles, 8 rows, minimal component usage |
| V2 | `15:2648` | "assets v1 - less componized - with comments" | Same as V1 but has `data-annotations` for guidance |
| V3 | `1:3203` | "assets v1" | Uses Card component with slots, 4 rows, most componentized |

## Code Connect Detection

Components detected via Code Connect imports:
- `Avatar` -> `@/components/ui/avatar`
- `Sidebar` -> `@/components/ui/sidebar`
- `Tabs` -> `@/components/ui/tabs`
- `Table` -> `@/components/ui/table`
- `Pagination` -> `@/components/ui/pagination`
- `Card` -> `@/components/ui/card` (V3 only)

## Observations

### V1: Less Componentized
- **Figma output**: ~750 lines of raw JSX with heavy inline Tailwind
- **Code Connect**: Some components wrapped in `<CodeConnectSnippet>` but many raw divs
- **Table structure**: Manual table cells with inline styles
- **8 asset rows** shown in design (more data)

### V2: With Annotations
- **Figma output**: Similar to V1 with added `data-annotations` attributes
- **Annotation found**: `data-annotations="this element should be a component Card with 3 slots, 1 slot is tabs, 2nd is data table, 3rd is pagination but aligned to the right side. dont change any other spacing, keep it as in this screen"`
- **Key insight**: Designer can add implementation hints via annotations

### V3: Most Componentized
- **Figma output**: ~200 lines - significantly less code
- **Code Connect**: Uses Card component with slots (`headerSlot`, `mainSlot`, `footerSlot`)
- **4 asset rows** shown (less data but cleaner structure)
- **Key insight**: Figma structure directly influences code structure

## Key Findings

1. **Code Connect reduces output size**: V3 (componentized) generated ~3.5x less code than V1/V2
2. **Annotations provide guidance**: V2's `data-annotations` can guide AI implementation
3. **Card with slots**: V3's Figma structure maps directly to Card component slots
4. **Import hints are useful**: GitHub URLs in imports help locate correct components

## Implementation Notes

For the actual React implementation:
- Convert GitHub URL imports to local: `@/components/ui/{component}`
- Remove `CodeConnectSnippet` wrappers
- Remove `data-node-id` and `data-name` attributes
- Convert Figma props to actual shadcn/ui props

## Files Created

- `ThursdayTestV1.tsx` - Manual implementation from V1 (less componentized)
- `ThursdayTestV2.tsx` - Manual implementation from V2 (with annotation guidance)
- `ThursdayTestV3.tsx` - Componentized implementation using Card with slots
- `ThursdayTest.stories.tsx` - Storybook comparison

## Conclusion

When designing in Figma for Code Connect:
1. Use components with proper variant definitions
2. Leverage slots for Card-like containers
3. Consider adding annotations for complex layout guidance
4. Minimize inline styling - use design tokens

This validates the approach: **Better Figma structure = Better code generation**.
