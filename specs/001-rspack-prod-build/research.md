# Research: Enable Rspack for Production Builds

**Branch**: `001-rspack-prod-build` | **Date**: 2026-02-03

## Summary

Research findings for enabling rspack in production builds to achieve >2 minute build time savings.

## Current State Analysis

### Build Configuration

| Script     | Command                                                                            | Bundler | Notes                      |
| ---------- | ---------------------------------------------------------------------------------- | ------- | -------------------------- |
| `dev`      | `cross-env USE_RSPACK=1 next dev`                                                  | Rspack  | Default development        |
| `dev:full` | `cross-env USE_RSPACK=0 ENABLE_PWA=1 ENABLE_EXPERIMENTAL_OPTIMIZATIONS=1 next dev` | Webpack | Full features, PWA enabled |
| `start`    | `next dev`                                                                         | Webpack | Legacy alias               |
| `build`    | `next build`                                                                       | Webpack | Production                 |

### Rspack Integration Architecture

**Entry point**: `apps/web/next.config.mjs:14-23`

```javascript
let withRspack = null
if (process.env.USE_RSPACK === '1') {
  process.env.NEXT_RSPACK = 'true'
  process.env.RSPACK_CONFIG_VALIDATE = 'loose-silent'
  delete process.env.TURBOPACK
  try {
    withRspack = (await import('next-rspack')).default
  } catch {}
}
```

**Key observations**:

- Rspack activation is controlled via `USE_RSPACK=1` environment variable
- Dynamic import with graceful fallback
- TURBOPACK is explicitly disabled when rspack is enabled
- Validation set to `loose-silent` to suppress config warnings

### Plugin Compatibility Analysis

**SRI Manifest Plugin** (`apps/web/plugins/sri-manifest-webpack-plugin.mjs`):

- Uses webpack compiler hooks API: `compiler.hooks.thisCompilation.tap()`
- Uses compilation hooks: `compilation.hooks.processAssets.tap()`
- Uses webpack sources: `compilation.compiler.webpack.sources.RawSource`
- **Rspack compatibility**: Rspack provides webpack-compatible plugin APIs. The hooks used (`thisCompilation`, `processAssets`) are supported.

**Production-only plugins** (from `next.config.mjs:156-159`):

```javascript
if (!dev && process.env.NODE_ENV !== 'cypress') {
  config.plugins.push(new SriManifestWebpackPlugin())
}
```

### MDX Configuration Differences (P1 - CRITICAL)

| Mode    | Plugins                                                                            | Rationale                            |
| ------- | ---------------------------------------------------------------------------------- | ------------------------------------ |
| Rspack  | Minimal (`jsx: true` only)                                                         | Currently stripped for compatibility |
| Webpack | Full (`remarkFrontmatter`, `remarkGfm`, `remarkHeadingId`, `remarkMdxFrontmatter`) | Rich MDX features                    |

**Current rspack config** (`next.config.mjs:168-169`):

```javascript
const withMDX = isRspack
  ? createMDX({ extension: /\.(md|mdx)?$/, jsx: true, options: {} })  // NO PLUGINS
```

**CRITICAL ISSUE**: Legal content files require remark plugins that are currently disabled for rspack:

| File                              | Required Plugin     | Feature Used                                             |
| --------------------------------- | ------------------- | -------------------------------------------------------- |
| `src/markdown/terms/terms.md`     | `remark-heading-id` | Heading anchors: `# Section {#section-id}` (29 headings) |
| `src/markdown/cookie/cookie.md`   | `remark-gfm`        | GFM tables for cookie compliance (2 tables, 12+ rows)    |
| `src/markdown/privacy/privacy.md` | `remark-heading-id` | Heading anchors for TOC navigation                       |

**Without these plugins**:

- Tables in cookie.md render as raw pipe characters (compliance violation)
- TOC links in terms.md break (anchor IDs not generated)

### MDX Solution Options

**Option A: Enable remark plugins with rspack**

- Modify `next.config.mjs` to use same plugins for both bundlers
- Simplest solution if rspack supports these plugins
- Test required to verify compatibility

**Option B: Convert MD files to TSX**

- Convert `terms.md`, `cookie.md`, `privacy.md` to TSX components
- Removes dependency on remark plugins entirely
- More maintainable long-term (full TypeScript control)
- Higher initial effort but eliminates plugin compatibility concerns

**Recommendation**: Try Option A first. If remark plugins cause issues with rspack, fall back to Option B.

## Decisions

### Decision 1: Rspack for Production Build Command

**Decision**: Add `USE_RSPACK=1` to production build script

**Rationale**:

- Development already uses rspack successfully
- Rspack's webpack-compatible APIs support existing plugins
- Environment variable approach is already established in codebase

**Alternatives considered**:

1. Turbopack - Rejected: Next.js built-in but less mature, explicitly disabled in current config
2. Keep Webpack for production - Rejected: Doesn't achieve the build time improvement goal

### Decision 2: Fallback Build Script Naming

**Decision**: Use `build:webpack` as fallback script name

**Rationale**:

- Follows existing naming pattern (`dev:full` uses suffix pattern)
- Clear indication of which bundler is used
- Consistent with how `dev` vs `dev:full` work

**Alternatives considered**:

1. `build:legacy` - Less descriptive of actual bundler
2. `build:full` - Misleading (implies more features, not different bundler)
3. `build:fallback` - Less technically accurate

### Decision 3: MDX Plugin Compatibility (P1 - CRITICAL)

**Decision**: Resolve MDX compatibility before enabling rspack for production

**Approach** (in order of preference):

1. **Try enabling remark plugins with rspack** - Modify `next.config.mjs` to include `remarkGfm` and `remarkHeadingId` for rspack builds
2. **Convert MD to TSX if plugins fail** - Convert legal content files to TSX components

**Rationale**:

- Legal content (Terms, Cookie Policy, Privacy Policy) is critical for compliance
- cookie.md requires GFM tables for cookie disclosure (regulatory requirement)
- terms.md requires heading anchors for TOC navigation (29 sections)
- Cannot ship broken legal pages

**Files affected**:

- `src/markdown/terms/terms.md` (390 lines)
- `src/markdown/cookie/cookie.md` (147 lines)
- `src/markdown/privacy/privacy.md` (589 lines)

### Decision 4: SRI Plugin Approach

**Decision**: Test existing SRI plugin with rspack before considering changes

**Rationale**:

- Rspack claims webpack plugin compatibility
- The plugin uses standard webpack compilation APIs
- No changes needed unless testing reveals issues

**Contingency**: If SRI plugin fails with rspack, create rspack-specific variant or disable for rspack builds (with documented security tradeoff)

## Dependencies

| Dependency                     | Version          | Purpose                        |
| ------------------------------ | ---------------- | ------------------------------ |
| `next-rspack`                  | ^16.0.1          | Rspack integration for Next.js |
| `@rspack/plugin-react-refresh` | ^1.0.0           | React Fast Refresh support     |
| Next.js                        | 15.5.8 (patched) | Framework                      |

## Risks & Mitigations

| Risk                       | Impact       | Probability | Mitigation                                                    |
| -------------------------- | ------------ | ----------- | ------------------------------------------------------------- |
| MDX legal content broken   | **Critical** | **High**    | P1: Enable remark plugins OR convert to TSX                   |
| SRI plugin incompatibility | Medium       | Low         | Fallback script available; can test before deploy             |
| CI/CD build failures       | High         | Low         | Test in CI before making default; fallback script             |
| Bundle size differences    | Medium       | Low         | Bundle analyzer can compare; verify no significant difference |

## Open Questions

### Resolved

- Build script naming: Use `build:webpack` for fallback
- SRI plugin: Test with rspack, fallback available

### Requires Testing

- **MDX with rspack**: Will remark plugins (`remarkGfm`, `remarkHeadingId`) work with rspack?
  - If YES: Update `next.config.mjs` to enable plugins for rspack
  - If NO: Convert MD files to TSX components
