# Visual Testing & Figma Fidelity

This document outlines how we ensure components match their Figma designs.

## Testing Strategy

We use multiple layers of testing to ensure design fidelity:

1. **Unit Tests** - Verify design tokens are applied correctly
2. **Visual Regression Tests** - Compare screenshots (Chromatic/Percy)
3. **Manual Review** - Side-by-side comparison with Figma

## Unit Tests for Design Tokens

Every component should have tests that verify it uses the correct design tokens from Figma.

### Example: Card Component

```typescript
it('should match Figma design tokens for the base Card', () => {
  const { container } = render(<Card>Card title</Card>)
  const card = container.firstChild as HTMLElement

  // Verify exact design tokens from Figma
  expect(card).toHaveClass('rounded-[var(--ds-radius-md)]') // 12px
  expect(card).toHaveClass('bg-[var(--ds-color-bg-surface)]') // #ffffff
  expect(card).toHaveClass('px-[var(--ds-spacing-16)]') // 16px
  expect(card).toHaveClass('py-[var(--ds-spacing-8)]') // 8px
})

it('should NOT have styles not present in Figma', () => {
  const { container } = render(<Card>Content</Card>)
  const card = container.firstChild as HTMLElement

  // Verify what's NOT in Figma design
  expect(card.className).not.toContain('border')
  expect(card.className).not.toContain('shadow')
})
```

## Visual Regression Testing

### Chromatic (Recommended)

Chromatic automatically captures screenshots of Storybook stories and detects visual changes.

**Setup:**

```bash
# Install Chromatic
yarn workspace @safe-global/design-system add -D chromatic

# Link to Chromatic project
yarn chromatic --project-token=<your-token>
```

**Usage:**

```bash
# Run visual tests
yarn workspace @safe-global/design-system chromatic

# Auto-accept baseline
yarn workspace @safe-global/design-system chromatic --auto-accept-changes
```

### Percy (Alternative)

Percy integrates with Storybook for visual regression testing.

**Setup:**

```bash
# Install Percy
yarn workspace @safe-global/design-system add -D @percy/cli @percy/storybook

# Run Percy
yarn workspace @safe-global/design-system percy storybook
```

## Manual Verification Checklist

When syncing a component from Figma, verify:

### Layout & Spacing

- [ ] Border radius matches Figma (use CSS inspector)
- [ ] Padding matches Figma (vertical and horizontal)
- [ ] Margin matches Figma
- [ ] Width/height constraints match

### Colors

- [ ] Background color matches (check hex value)
- [ ] Text color matches
- [ ] Border color matches (if applicable)
- [ ] No unexpected colors (shadows, overlays, etc.)

### Typography

- [ ] Font family matches
- [ ] Font size matches
- [ ] Font weight matches
- [ ] Line height matches
- [ ] Letter spacing matches

### Visual Effects

- [ ] Border radius is correct
- [ ] Shadows match (or are absent if not in design)
- [ ] Borders match (or are absent if not in design)
- [ ] Opacity/transparency matches

### Interactions

- [ ] Hover states match Figma
- [ ] Active states match Figma
- [ ] Disabled states match Figma
- [ ] Focus states are accessible

## Figma Dev Mode Workflow

1. **Open Figma file in Dev Mode**
   - Click "Dev Mode" toggle in top-right
   - Select the component to inspect

2. **Compare CSS values**
   - Check spacing values (padding, margin)
   - Verify color values (hex codes)
   - Confirm typography settings
   - Review border radius and effects

3. **Copy CSS snippets**
   - Figma provides CSS code snippets
   - Compare with your component implementation
   - Use design tokens instead of hardcoded values

4. **Document deviations**
   - If implementation differs from design, document why
   - Create issues for design updates if needed
   - Update Figma if implementation is better

## Storybook Design Addon

The `@storybook/addon-designs` addon embeds Figma frames in Storybook for easy comparison.

**Usage:**

```typescript
export default {
  title: 'Design System/Components/Card',
  component: Card,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/[FILE-KEY]/[FILE-NAME]?node-id=[NODE-ID]',
    },
  },
} satisfies Meta<typeof Card>
```

This allows reviewers to compare the rendered component with the Figma design side-by-side.

## Automated Figma Sync Validation

After syncing tokens from Figma, run:

```bash
# Complete validation (tokens + sync + type-check + tests)
yarn workspace @safe-global/design-system validate:all
```

See [CLAUDE.md](../CLAUDE.md) for complete validation workflow and troubleshooting.

## CI/CD Integration

Visual tests run automatically in CI:

- Token schema validation
- Sync validation (CSS, Tailwind, tests, stories)
- Type-check all TypeScript
- Run unit tests (includes Figma fidelity tests)
- Build Storybook
- Visual regression (Chromatic)

## Best Practices

1. **Always test design token application** - Don't assume tokens are applied correctly
2. **Test what's NOT there** - Verify unwanted styles (borders, shadows) are absent
3. **Use exact token references** - Test for `var(--ds-spacing-8)`, not computed values
4. **Document deviations** - If you intentionally deviate from Figma, explain why
5. **Update tests when design changes** - Keep tests in sync with Figma updates
6. **Use visual regression tools** - Automate screenshot comparison
7. **Add Figma links to stories** - Make it easy to compare designs

## Common Issues

### Issue: Component doesn't match Figma

**Solution:**

1. Run unit tests to see which tokens are wrong
2. Use browser DevTools to inspect computed styles
3. Compare with Figma Dev Mode CSS output
4. Update component to use correct design tokens

### Issue: Colors look different

**Solution:**

1. Verify CSS variables are defined in `tokens.css`
2. Check if light/dark theme is applied correctly
3. Confirm hex values match Figma exactly
4. Check for color transformations (opacity, filters)

### Issue: Spacing is off

**Solution:**

1. Verify 8px grid is followed (all spacing multiples of 8)
2. Check padding vs margin usage
3. Confirm box-sizing is consistent
4. Use browser DevTools to inspect the box model

## Resources

- [Figma Dev Mode Documentation](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Storybook Design Addon](https://storybook.js.org/addons/@storybook/addon-designs)
- [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
