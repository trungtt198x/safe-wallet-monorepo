# Implementation Plan: Enable Rspack for Production Builds

**Branch**: `001-rspack-prod-build` | **Date**: 2026-02-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-rspack-prod-build/spec.md`

## Summary

Enable rspack as the bundler for production builds to achieve >2 minute build time savings. The codebase already uses rspack for development (`dev` script). This feature adds rspack to production builds while preserving a webpack fallback for risk mitigation.

**Critical Requirement (P1)**: Legal content (Terms, Cookie Policy, Privacy Policy) must render correctly. The current rspack MDX config strips remark plugins required for GFM tables and heading anchors. This must be resolved before enabling rspack for production.

## Technical Context

**Language/Version**: TypeScript 5.9.x / Node.js >=18
**Primary Dependencies**: Next.js 15.5.8 (patched), next-rspack ^16.0.1, @rspack/plugin-react-refresh ^1.0.0
**Storage**: N/A (build tooling change)
**Testing**: Manual build time comparison, existing test suite for functional validation
**Target Platform**: Static site export (browser), CI/CD environments
**Project Type**: Web application (monorepo)
**Performance Goals**: Production build time reduction of >2 minutes
**Constraints**: Must maintain functional equivalence with webpack builds, preserve SRI integrity, legal MDX content must render correctly
**Scale/Scope**: Single workspace (`apps/web`), 2 script changes + MDX compatibility fix (config change OR file conversions)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                       | Status | Notes                                              |
| ------------------------------- | ------ | -------------------------------------------------- |
| I. Type Safety                  | PASS   | No TypeScript changes required                     |
| II. Branch Protection           | PASS   | Using feature branch `001-rspack-prod-build`       |
| III. Cross-Platform Consistency | PASS   | Only affects `apps/web`, no shared package changes |
| IV. Testing Discipline          | PASS   | Existing tests validate functional equivalence     |
| V. Feature Organization         | N/A    | Build tooling, not feature code                    |
| VI. Theme System Integrity      | PASS   | No theme changes                                   |

**All gates pass. No violations to justify.**

## Project Structure

### Documentation (this feature)

```text
specs/001-rspack-prod-build/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technical research findings
├── quickstart.md        # Build time comparison documentation
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code Changes

```text
apps/web/
├── package.json         # MODIFY: Update build scripts
├── next.config.mjs      # MODIFY: Enable remark plugins for rspack (Option A)
├── docs/
│   └── build-performance.md  # CREATE: Build time documentation (P3)
└── src/markdown/        # CONVERT to TSX if Option A fails (Option B)
    ├── terms/terms.md   # 390 lines - heading anchors
    ├── cookie/cookie.md # 147 lines - GFM tables
    └── privacy/privacy.md # 589 lines - heading anchors
```

**Files to modify**:

1. `apps/web/package.json` - Add/modify build scripts
2. `apps/web/next.config.mjs` - Enable remark plugins for rspack (P1, Option A)
3. `apps/web/docs/build-performance.md` - New documentation file (P3)

**Conditional (if Option A fails)**: 4. Convert `src/markdown/*.md` to TSX components (P1, Option B)

## Implementation Details

### Script Changes

**Current state** (`apps/web/package.json`):

```json
{
  "scripts": {
    "dev": "cross-env USE_RSPACK=1 next dev",
    "dev:full": "cross-env USE_RSPACK=0 ENABLE_PWA=1 ENABLE_EXPERIMENTAL_OPTIMIZATIONS=1 next dev",
    "build": "next build"
  }
}
```

**Target state**:

```json
{
  "scripts": {
    "dev": "cross-env USE_RSPACK=1 next dev",
    "dev:full": "cross-env USE_RSPACK=0 ENABLE_PWA=1 ENABLE_EXPERIMENTAL_OPTIMIZATIONS=1 next dev",
    "build": "cross-env USE_RSPACK=1 next build",
    "build:webpack": "next build"
  }
}
```

### MDX Compatibility Fix (P1 - CRITICAL)

**Problem**: Current rspack MDX config (`next.config.mjs:168-169`) strips all remark plugins:

```javascript
const withMDX = isRspack
  ? createMDX({ extension: /\.(md|mdx)?$/, jsx: true, options: {} })  // NO PLUGINS
```

**Required plugins for legal content**:

- `remark-gfm` - GFM tables in cookie.md (compliance requirement)
- `remark-heading-id` - Heading anchors `{#id}` in terms.md (29 sections)

**Option A: Enable remark plugins with rspack** (preferred)

```javascript
const withMDX = isRspack
  ? createMDX({
      extension: /\.(md|mdx)?$/,
      jsx: true,
      options: {
        remarkPlugins: [remarkGfm, remarkHeadingId], // Add required plugins
      },
    })
  : createMDX({
      /* existing webpack config */
    })
```

**Option B: Convert MD files to TSX** (if Option A fails)

- Convert `src/markdown/terms/terms.md` → `src/components/legal/Terms.tsx` with JSX markup
- Convert `src/markdown/cookie/cookie.md` → `src/components/legal/CookiePolicy.tsx` with MUI Table components
- Convert `src/markdown/privacy/privacy.md` → `src/components/legal/PrivacyPolicy.tsx` with JSX markup
- Update page imports in `src/pages/terms.tsx`, `cookie.tsx`, `privacy.tsx`

### Key Technical Notes

1. **Environment variable mechanism**: `USE_RSPACK=1` triggers rspack via `next.config.mjs:14-23`
2. **SRI Plugin**: The `SriManifestWebpackPlugin` uses webpack-compatible APIs that rspack supports
3. **MDX**: **CRITICAL** - Must enable remark plugins OR convert to TSX (see above)
4. **PWA**: PWA config is independent of bundler choice (`ENABLE_PWA` is separate env var)

### Verification Approach

**P1 - MDX Verification (before enabling rspack for production)**:

1. Build with rspack (`USE_RSPACK=1 next build`)
2. Verify `/cookie` page: tables render correctly with proper formatting
3. Verify `/terms` page: TOC links navigate to correct sections (test 3-5 anchors)
4. Verify `/privacy` page: content renders correctly

**P1 - Build Time Verification**: 5. Run `build:webpack` and record total build time 6. Run `build` (with rspack) and record total build time 7. Compare times to verify >2 minute improvement

**P2 - Functional Equivalence**: 8. Run smoke tests on both builds to verify functional equivalence 9. Check SRI manifest generation in rspack build 10. Compare bundle sizes between builds

## Complexity Tracking

No violations requiring justification. This is a minimal-impact configuration change with one critical dependency (MDX compatibility).
