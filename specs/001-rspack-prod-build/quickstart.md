# Quickstart: Rspack Production Builds

**Branch**: `001-rspack-prod-build` | **Date**: 2026-02-03

## Overview

This feature enables rspack as the default bundler for production builds, providing significant build time improvements while maintaining a webpack fallback for compatibility.

## Build Commands

| Command                                         | Bundler | Use Case                        |
| ----------------------------------------------- | ------- | ------------------------------- |
| `yarn workspace @safe-global/web build`         | Rspack  | Default production build (fast) |
| `yarn workspace @safe-global/web build:webpack` | Webpack | Fallback if rspack issues occur |

## Quick Start

### Standard Production Build (Rspack)

```bash
yarn workspace @safe-global/web build
```

### Fallback Build (Webpack)

```bash
yarn workspace @safe-global/web build:webpack
```

### Measure Build Times

```bash
# Time the rspack build
time yarn workspace @safe-global/web build

# Time the webpack build
time yarn workspace @safe-global/web build:webpack
```

## Build Time Comparison

> **Note**: Fill in actual measurements after implementation

| Metric                      | Webpack | Rspack | Improvement    |
| --------------------------- | ------- | ------ | -------------- |
| Total build time            | _TBD_   | _TBD_  | Target: >2 min |
| Cold start                  | _TBD_   | _TBD_  | -              |
| Incremental (if applicable) | _TBD_   | _TBD_  | -              |

## Environment Variables

| Variable     | Default                           | Description                                   |
| ------------ | --------------------------------- | --------------------------------------------- |
| `USE_RSPACK` | `1` (build) / `0` (build:webpack) | Enables rspack bundler                        |
| `ENABLE_PWA` | `0`                               | Enables PWA features (independent of bundler) |

## Troubleshooting

### Rspack Build Fails

If the rspack build encounters issues:

1. Use the fallback: `yarn workspace @safe-global/web build:webpack`
2. Report the issue with build logs
3. Check if the issue is related to specific plugins or configurations

### SRI Issues

The SRI (Subresource Integrity) plugin is designed to work with both bundlers. If SRI-related errors occur:

1. Check that `chunks-sri-manifest.js` is generated in the output
2. Verify the `SriManifestWebpackPlugin` logs in build output
3. Fall back to webpack build if necessary

### MDX/Legal Content Issues (P1 - Critical)

Legal content (Terms, Cookie Policy, Privacy Policy) requires specific remark plugins. If legal pages render incorrectly:

**Symptoms**:

- Tables in `/cookie` page show as raw pipe characters instead of formatted tables
- TOC links in `/terms` page don't navigate to sections
- Heading anchors `{#id}` display as text instead of generating IDs

**Resolution options**:

1. **Option A**: Enable remark plugins for rspack in `next.config.mjs` (add `remarkGfm`, `remarkHeadingId`)
2. **Option B**: Convert MD files to TSX if Option A fails
3. **Fallback**: Use `build:webpack` for production until resolved

## Verification Checklist

After building, verify:

**P1 - Legal Content (Critical)**:

- [ ] `/cookie` page: Tables render with proper formatting (2 tables)
- [ ] `/terms` page: TOC links navigate to correct sections (test 3-5 links)
- [ ] `/privacy` page: Content renders correctly

**P1 - Build Success**:

- [ ] Build completes without errors
- [ ] Output directory (`out/`) contains expected files
- [ ] Build time is >2 minutes faster than webpack

**P2 - Integrity**:

- [ ] `chunks-sri-manifest.js` is present in `out/_next/static/chunks/`
- [ ] Application loads and functions correctly
- [ ] No console errors related to SRI or chunk loading
