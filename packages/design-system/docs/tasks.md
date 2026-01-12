# Design System Implementation Tasks

## Overview

This document organizes the implementation into structural commits, following semantic commit conventions.

Each commit represents a complete, testable increment of functionality.

---

## Phase 1: Foundation (Weeks 1-2)

### ✅ Commit 1: Initialize design system package structure

**Message**: `feat(design-system): initialize package structure with configuration`

**Status**: COMPLETED (cf08a979d)

**Files**:

- `packages/design-system/package.json` - Package configuration with dependencies
- `packages/design-system/tsconfig.json` - TypeScript config extending base
- `packages/design-system/jest.config.js` - Jest configuration
- `packages/design-system/eslint.config.mjs` - ESLint rules
- `packages/design-system/.gitignore` - Ignore node_modules, build artifacts
- `packages/design-system/README.md` - Quick start guide
- Root `package.json` - Add design-system workspace reference

**Dependencies**:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "tamagui": "^1.126.3"
  },
  "devDependencies": {
    "@storybook/nextjs": "^8.0.0",
    "@storybook/addon-designs": "^8.0.0",
    "@storybook/addon-styling-webpack": "^1.0.0",
    "@types/react": "^18.3.1",
    "handlebars": "^4.7.8",
    "zod": "^3.23.8",
    "typescript": "~5.9.2",
    "jest": "^29.7.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "ts-node": "^10.9.2"
  }
}
```

**Verify**: `yarn install` succeeds

---

### ✅ Commit 2: Add Figma sync infrastructure and validation

**Message**: `feat(design-system): add Figma sync infrastructure and validation`

**Status**: COMPLETED (0ac6a5435)

**Files**:

- `CLAUDE.md` - AI assistant instructions for Figma sync
- `DESIGNER_GUIDE.md` - Designer workflow guide
- `scripts/validate-tokens.ts` - Token validation with Zod
- Token directory structure created (empty, awaiting Figma sync)
- `docs/requirements.md`, `docs/architecture.md`, `docs/tasks.md`

---

### ✅ Commit 3: Add token transformers and web infrastructure

**Message**: `feat(design-system): add token transformers and web infrastructure`

**Status**: COMPLETED (b2bf792b9)

**Files**:

- `src/tokens/types.ts` - TypeScript token types (DTCG format)
- `src/tokens/transforms/toTailwind.ts` - Tailwind config transformer
- `src/tokens/transforms/toCssVars.ts` - CSS variables transformer
- `src/tokens/transforms/utils.ts` - Transform utilities
- `tailwind.config.js` - Tailwind config with CSS variables
- `postcss.config.js` - PostCSS setup
- `src/web/lib/utils.ts` - cn() utility for class merging
- `src/web/styles/globals.css` - Tailwind base styles
- `src/web/styles/tokens.css` - CSS variables placeholder
- `src/index.ts` - Main entry point

**Verify**: TypeScript compiles, validation passes

---

### ✅ Commit 4: Add Button component with tests and stories

**Message**: `feat(design-system): add Button component with tests and stories`

**Status**: COMPLETED (e4549bd7d)

**Files**:

- `src/web/components/ui/button.tsx` - Button component (manual Shadcn pattern)
- `src/web/components/ui/button.test.tsx` - Comprehensive tests (7/7 passing)
- `src/web/components/ui/button.stories.tsx` - Storybook stories
- Testing dependencies added (Jest, Testing Library)

**Verify**: Tests pass, TypeScript compiles

---

### ✅ Commit 5: Migrate to Shadcn v2 with CLI support

**Message**: `feat(design-system): migrate to Shadcn v2 with CLI support`

**Status**: COMPLETED (6dabdd44f)

**Files**:

- `components.json` - Shadcn v2 CLI configuration
- `src/web/components/ui/button.tsx` - Updated via CLI
- `src/web/components/ui/card.tsx` - Added via CLI
- `src/web/components/ui/input.tsx` - Added via CLI
- `src/web/components/ui/label.tsx` - Added via CLI
- Updated `src/web/index.ts` - Export all components
- Updated README with CLI usage instructions

**Shadcn v2 Config**:

- Style: `new-york`
- Base Color: `slate`
- CSS Variables: `true`
- Primitives: Radix UI
- Icons: Lucide
- Path Aliases: `@/web/*`

**Verify**: Components work, CLI adds new components successfully

---

### ✅ Commit 6: Update CLAUDE.md with Shadcn v2 guidelines

**Message**: `docs(design-system): update CLAUDE.md with Shadcn v2 guidelines`

**Status**: COMPLETED (e8db900b6)

**Files**:

- `CLAUDE.md` - Added Shadcn v2 configuration section
- Instructions for using CLI vs custom components
- Component structure patterns
- Complete AI assistant workflow

**Verify**: Documentation is comprehensive and clear

---

## Phase 2: Figma Sync (Weeks 3-4)

### Commit 7: Implement Figma client wrapper

**Message**: `feat(design-system): implement Figma MCP client wrapper`

**Files**:

- `packages/design-system/scripts/utils/figma-client.ts` - Figma API wrapper via MCP
- `packages/design-system/scripts/utils/token-parser.ts` - Parse Figma data to tokens
- `packages/design-system/figma/.gitkeep` - Create figma metadata directory

**Verify**: Can connect to Figma via MCP (manual test)

---

### Commit 8: Implement token generation from Figma

**Message**: `feat(design-system): add token generation from Figma styles`

**Files**:

- `packages/design-system/scripts/generate-tokens.ts` - Token generation orchestrator
- `packages/design-system/figma/sync-manifest.json` - Initial sync manifest
- `packages/design-system/figma/component-mapping.json` - Component ID mappings
- Update `package.json` with script: `"generate:tokens": "ts-node scripts/generate-tokens.ts"`

**Verify**: Can generate tokens from Figma (manual test with Figma MCP)

---

### Commit 9: Implement Figma sync orchestrator

**Message**: `feat(design-system): add main Figma sync orchestrator script`

**Files**:

- `packages/design-system/scripts/sync-figma.ts` - Main orchestrator
- Update `package.json` with script: `"sync": "ts-node scripts/sync-figma.ts"`

**Verify**: `yarn workspace @safe-global/design-system sync` completes (with Figma MCP)

---

## Phase 3: Component Generation (Weeks 5-6)

### Commit 10: Add Handlebars templates for code generation

**Message**: `feat(design-system): add Handlebars templates for component generation`

**Files**:

- `packages/design-system/scripts/templates/web-component.tsx.hbs` - Shadcn component template
- `packages/design-system/scripts/templates/mobile-component.tsx.hbs` - Tamagui component template
- `packages/design-system/scripts/templates/story.tsx.hbs` - Storybook story template
- `packages/design-system/scripts/templates/test.tsx.hbs` - Jest test template
- `packages/design-system/scripts/templates/component-doc.md.hbs` - Documentation template

**Verify**: Templates are valid Handlebars syntax

---

### Commit 11: Implement component generation scripts

**Message**: `feat(design-system): add component generation from Figma`

**Files**:

- `packages/design-system/scripts/generate-components.ts` - Component scaffolding
- `packages/design-system/scripts/generate-stories.ts` - Story generation
- `packages/design-system/scripts/generate-docs.ts` - Documentation generation
- Update `package.json` with scripts:
  - `"generate:components": "ts-node scripts/generate-components.ts"`
  - `"generate:stories": "ts-node scripts/generate-stories.ts"`
  - `"generate:docs": "ts-node scripts/generate-docs.ts"`

**Verify**: Run generators with mock data to test output

---

### Commit 12: Add more components via Shadcn CLI

**Message**: `feat(design-system): add [components] via Shadcn v2 CLI`

**Process**:

```bash
# Add components via CLI
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add switch
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add tooltip
npx shadcn@latest add progress
npx shadcn@latest add alert-dialog
npx shadcn@latest add alert
```

**For each component**:

1. Add via CLI
2. Export in `src/web/index.ts`
3. Create Storybook story in `src/web/components/ui/[component].stories.tsx`
4. Create tests in `src/web/components/ui/[component].test.tsx`

**Verify**:

- TypeScript compiles
- Tests pass: `yarn workspace @safe-global/design-system test`

---

### Commit 13: Add first component - Button (mobile)

**Message**: `feat(design-system): add Button component for mobile (Tamagui)`

**Files**:

- `packages/design-system/src/mobile/components/Button/Button.tsx` - Button component
- `packages/design-system/src/mobile/components/Button/Button.test.tsx` - Button tests
- `packages/design-system/src/mobile/components/Button/index.ts` - Export
- `packages/design-system/src/mobile/theme/config.ts` - Tamagui config with design tokens
- `packages/design-system/src/mobile/index.ts` - Mobile entry point with Button export

**Verify**:

- TypeScript compiles
- Tests pass

---

## Phase 4: Storybook Setup (Week 7)

### Commit 14: Configure Storybook with Tailwind support

**Message**: `feat(design-system): configure Storybook with Tailwind and theme switching`

**Files**:

- `packages/design-system/.storybook/main.ts` - Storybook config
- `packages/design-system/.storybook/preview.ts` - Preview config with Tailwind
- Update `package.json` with scripts:
  - `"storybook": "storybook dev -p 6006"`
  - `"build-storybook": "storybook build"`

**Verify**:

- `yarn workspace @safe-global/design-system storybook` runs successfully
- Tailwind classes work
- Theme switching works

---

### Commit 15: Add Figma addon configuration to Storybook

**Message**: `feat(design-system): configure Storybook addon-designs for Figma links`

**Files**:

- Update `packages/design-system/.storybook/main.ts` - Add addon-designs
- Update `packages/design-system/src/web/components/button.stories.tsx` - Add Figma link

**Verify**: Figma design panel appears in Storybook

---

## Phase 5: CI/CD Integration (Week 8)

### Commit 16: Add CI workflow for design system validation

**Message**: `ci(design-system): add GitHub Actions workflow for validation`

**Files**:

- `.github/workflows/design-system-validation.yml` - CI workflow
- `.github/PULL_REQUEST_TEMPLATE/design-system-sync.md` - PR template

**Verify**: CI runs on PR affecting `packages/design-system/**`

---

### Commit 17: Configure Chromatic for visual regression testing

**Message**: `ci(design-system): configure Chromatic for visual regression`

**Files**:

- Update `packages/design-system/package.json` - Add Chromatic script
- Update `.github/workflows/design-system-validation.yml` - Add Chromatic step

**Verify**: Chromatic builds on PR

---

## Phase 6: Integration (Weeks 9-10)

### Commit 18: Integrate design tokens with web app

**Message**: `feat(web): integrate design system Tailwind config`

**Files**:

- `apps/web/tailwind.config.js` - Extend with design system tokens
- `apps/web/postcss.config.js` - Add PostCSS config
- `apps/web/src/styles/globals.css` - Import design system styles
- `apps/web/package.json` - Add `@safe-global/design-system` dependency

**Verify**:

- Web app builds successfully
- Design system tokens available in web app

---

### Commit 19: Integrate design tokens with mobile app

**Message**: `feat(mobile): integrate design system tokens with Tamagui`

**Files**:

- `apps/mobile/src/theme/tamagui.config.ts` - Import design system tokens
- `apps/mobile/package.json` - Add `@safe-global/design-system` dependency

**Verify**:

- Mobile app builds successfully
- Design system tokens available in mobile theme

---

## Phase 7: First Production Sync (Week 11)

### Commit 20: First Figma sync (designer-driven)

**Message**: `feat(design-system): sync design tokens from Figma [YYYY-MM-DD]`

**Process**:

1. Designer updates Figma with 5-10 initial tokens
2. Designer runs: `yarn workspace @safe-global/design-system sync`
3. Designer reviews generated changes
4. Designer creates PR with this commit

**Files**:

- Updated token JSON files
- Updated generated TypeScript/CSS files
- Updated `figma/sync-manifest.json` with sync timestamp

**Verify**:

- CI passes
- Chromatic shows expected visual changes
- Tokens match Figma exactly

---

## Phase 8: Component Library Expansion (Weeks 12-16)

### Components to Implement (Each as separate commit)

**Commit pattern**: `feat(design-system): add [Component] for web and mobile`

**Web components** (Shadcn v2 CLI):

1. ✅ Input (already added)
2. ✅ Card (already added)
3. ✅ Label (already added)
4. ✅ Button (already added)
5. Alert / Alert Dialog
6. Dialog
7. Checkbox
8. Radio Group
9. Switch
10. Select
11. Tabs
12. Badge
13. Avatar
14. Tooltip
15. Progress

**Process**: Use `npx shadcn@latest add <component>` for each

**Mobile components** (Tamagui):

1. Input
2. Card
3. Alert Dialog
4. Dialog / Sheet
5. Checkbox
6. RadioGroup
7. Switch
8. Select
9. Tabs
10. Badge
11. Label
12. Avatar
13. Tooltip
14. Progress

**For each component commit**:

- Web: `src/web/components/ui/[component].tsx` + story + test
- Mobile: `src/mobile/components/[Component]/[Component].tsx` + test
- Documentation: Auto-generated from templates
- Update exports in `src/web/index.ts` and `src/mobile/index.ts`

**Verify for each**:

- TypeScript compiles
- Tests pass
- Storybook story works (web)
- Figma link present in story

---

## Phase 9: Adoption & Documentation (Weeks 17-20)

### Commit 21: Add migration guide for web developers

**Message**: `docs(design-system): add web migration guide from MUI to Shadcn`

**Files**:

- `packages/design-system/docs/web-migration-guide.md`

**Content**:

- Import path changes
- Component API differences
- Styling approach (MUI → Tailwind)
- Coexistence strategies
- Common patterns and examples

---

### Commit 22: Add migration guide for mobile developers

**Message**: `docs(design-system): add mobile integration guide`

**Files**:

- `packages/design-system/docs/mobile-integration-guide.md`

**Content**:

- Token integration
- Component usage
- Theme configuration
- Platform-specific considerations

---

### Commit 23: Update main README with usage examples

**Message**: `docs(design-system): update README with comprehensive usage examples`

**Files**:

- `packages/design-system/README.md` - Add detailed usage section

**Content**:

- Quick start
- Installation in web/mobile apps
- Basic component usage
- Token usage
- Storybook link
- Contributing guidelines

---

## Phase 10: First Feature Migration (Weeks 21-24)

### Commit 24: Migrate first feature to design system (TBD based on priorities)

**Message**: `refactor(web): migrate [FeatureName] to design system components`

**Process**:

1. Identify high-traffic feature for pilot migration
2. Replace MUI components with design system components
3. Update tests
4. Verify functionality unchanged

**Files**: (Depends on feature chosen)

**Verify**:

- Feature works identically
- No visual regressions (Chromatic)
- All tests pass

---

## Maintenance & Iteration

### Ongoing Tasks

**Regular Figma syncs** (2+ per month):

- Designer-driven via Claude + Figma MCP
- Commit message: `feat(design-system): sync design tokens from Figma [date]`

**Component additions** (as needed):

- Generate from Figma
- Both web and mobile versions
- Complete with tests and stories

**Token updates** (as design evolves):

- Via Figma sync
- Automatic CI validation
- Chromatic visual review

---

## Timeline Summary

| Phase         | Duration    | Key Deliverables                                    |
| ------------- | ----------- | --------------------------------------------------- |
| Foundation    | Weeks 1-2   | Package structure, tokens, transformers, validation |
| Figma Sync    | Weeks 3-4   | Figma MCP integration, sync scripts                 |
| Components    | Weeks 5-6   | Button (web+mobile), generation scripts             |
| Storybook     | Week 7      | Storybook configured, Figma links                   |
| CI/CD         | Week 8      | GitHub Actions, Chromatic                           |
| Integration   | Weeks 9-10  | Web and mobile token integration                    |
| First Sync    | Week 11     | Designer-driven Figma sync                          |
| Expansion     | Weeks 12-16 | 14 more components (web+mobile)                     |
| Documentation | Weeks 17-20 | Migration guides, training                          |
| Adoption      | Weeks 21-24 | First feature migration                             |

**Total**: ~6 months to full library with adoption

---

## Success Criteria Per Phase

### Phase 1 (Foundation)

- [ ] Package installs successfully
- [ ] Tokens load and transform correctly
- [ ] Validation passes

### Phase 2 (Figma Sync)

- [ ] Can connect to Figma via MCP
- [ ] Token sync generates valid JSON
- [ ] Sync script completes end-to-end

### Phase 3 (Components)

- [ ] Button component works on web and mobile
- [ ] Generation scripts produce valid code
- [ ] Tests pass

### Phase 4 (Storybook)

- [ ] Storybook runs locally
- [ ] Figma links visible
- [ ] Theme switching works

### Phase 5 (CI/CD)

- [ ] CI validates PRs automatically
- [ ] Chromatic catches visual changes
- [ ] PR template used

### Phase 6 (Integration)

- [ ] Web app uses design system tokens
- [ ] Mobile app uses design system tokens
- [ ] Both apps build successfully

### Phase 7 (First Sync)

- [ ] Designer completes sync independently
- [ ] PR reviewed and merged
- [ ] Tokens match Figma

### Phase 8 (Expansion)

- [ ] 15+ components implemented
- [ ] All with tests and stories
- [ ] Documentation complete

### Phase 9 (Documentation)

- [ ] Migration guides published
- [ ] Training sessions completed
- [ ] Developer feedback collected

### Phase 10 (Adoption)

- [ ] First feature migrated successfully
- [ ] No regressions
- [ ] Team confident with design system
