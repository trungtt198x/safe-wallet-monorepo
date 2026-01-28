/**
 * Local ESLint rules for the Safe{Wallet} web application.
 *
 * These rules enforce project-specific patterns that aren't covered
 * by standard ESLint plugins.
 */

/**
 * Rule: require-feature-guard
 *
 * Enforces that feature barrel files properly use dynamic imports with `withFeatureGuard`.
 * This ensures all exported components are:
 * 1. Lazy-loaded via dynamic() for code splitting
 * 2. Feature-gated via withFeatureGuard
 *
 * The rule catches these mistakes:
 * - Using dynamic() without withFeatureGuard
 * - Passing non-dynamic components to withFeatureGuard (loses code splitting)
 * - Re-exporting components directly from internal paths (bypasses both)
 *
 * @example
 * // Bad - dynamic import without feature guard
 * const MyComponent = dynamic(() => import('./components/MyComponent'))
 * export { MyComponent }
 *
 * // Bad - passing non-dynamic component to withFeatureGuard
 * import { MyComponent } from './components/MyComponent'
 * export const Widget = withFeatureGuard(MyComponent, useIsEnabled)
 *
 * // Bad - re-exporting component directly
 * export { MyComponent } from './components/MyComponent'
 *
 * // Good - dynamic import wrapped with withFeatureGuard
 * const LazyComponent = dynamic(() => import('./components/MyComponent'), { ssr: false })
 * export const MyComponent = withFeatureGuard(LazyComponent, useIsMyFeatureEnabled)
 */
const requireFeatureGuard = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require withFeatureGuard for dynamic imports in feature barrel files',
      category: 'Best Practices',
    },
    messages: {
      missingFeatureGuard:
        'Dynamic imports in feature barrel files should be wrapped with `withFeatureGuard`. ' +
        'Import from `@/utils/withFeatureGuard` and wrap your dynamic component.',
      nonDynamicComponent:
        'Component "{{name}}" passed to withFeatureGuard is not a dynamic import. ' +
        'Use `dynamic(() => import(...))` at module level to enable code splitting.',
      directComponentReexport:
        'Direct re-export of component from "{{path}}" bypasses lazy loading and feature gating. ' +
        'Use `dynamic()` + `withFeatureGuard` pattern instead.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.filename || context.getFilename()

    // Only apply to feature barrel files
    const isFeatureBarrel = /src\/features\/[^/]+\/index\.(ts|tsx)$/.test(filename)
    if (!isFeatureBarrel) {
      return {}
    }

    let dynamicImportName = null // The local name for 'dynamic' from next/dynamic
    let hasFeatureGuardImport = false

    // Track which variables are assigned from dynamic() calls
    const dynamicVariables = new Set()

    // Track withFeatureGuard calls and what they receive
    const featureGuardCalls = [] // { node, firstArgName }

    return {
      // Track imports
      ImportDeclaration(node) {
        // Track the dynamic import name (could be renamed)
        if (node.source.value === 'next/dynamic') {
          const defaultSpecifier = node.specifiers.find((s) => s.type === 'ImportDefaultSpecifier')
          if (defaultSpecifier) {
            dynamicImportName = defaultSpecifier.local.name
          }
        }

        // Track withFeatureGuard import
        if (node.source.value === '@/utils/withFeatureGuard') {
          const hasWithFeatureGuard = node.specifiers.some(
            (s) => s.type === 'ImportSpecifier' && s.imported.name === 'withFeatureGuard',
          )
          if (hasWithFeatureGuard) {
            hasFeatureGuardImport = true
          }
        }
      },

      // Track variable declarations: const Lazy = dynamic(...)
      VariableDeclarator(node) {
        if (!dynamicImportName) return
        if (node.id.type !== 'Identifier') return
        if (!node.init) return

        // Check if this is a dynamic() call
        if (
          node.init.type === 'CallExpression' &&
          node.init.callee.type === 'Identifier' &&
          node.init.callee.name === dynamicImportName
        ) {
          dynamicVariables.add(node.id.name)
        }
      },

      // Track withFeatureGuard calls
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'withFeatureGuard') {
          return
        }

        const firstArg = node.arguments[0]
        if (firstArg && firstArg.type === 'Identifier') {
          featureGuardCalls.push({
            node,
            firstArgName: firstArg.name,
          })
        }
      },

      // Check for direct re-exports: export { Foo } from './components/Foo'
      ExportNamedDeclaration(node) {
        // Only check re-exports with a source (export { x } from 'y')
        if (!node.source) return

        const sourcePath = node.source.value

        // Check if re-exporting from internal component/hook paths
        // These patterns suggest component re-exports that bypass lazy loading
        const isInternalComponentPath =
          sourcePath.startsWith('./components') ||
          sourcePath.startsWith('./hooks') ||
          sourcePath.startsWith('./services') ||
          sourcePath.startsWith('../components') ||
          sourcePath.startsWith('../hooks') ||
          sourcePath.startsWith('../services')

        if (isInternalComponentPath) {
          // Check if any exported names look like components (PascalCase starting with uppercase)
          const componentExports = node.specifiers.filter((spec) => {
            const exportedName = spec.exported.name
            // PascalCase check: starts with uppercase, contains lowercase
            return /^[A-Z][a-zA-Z0-9]*$/.test(exportedName) && /[a-z]/.test(exportedName)
          })

          for (const spec of componentExports) {
            context.report({
              node: spec,
              messageId: 'directComponentReexport',
              data: { path: sourcePath },
            })
          }
        }
      },

      // Check at the end of the file
      'Program:exit'(node) {
        // Check 1: dynamic import without withFeatureGuard
        if (dynamicImportName && !hasFeatureGuardImport) {
          context.report({
            node,
            messageId: 'missingFeatureGuard',
          })
        }

        // Check 2: withFeatureGuard called with non-dynamic component
        for (const call of featureGuardCalls) {
          if (!dynamicVariables.has(call.firstArgName)) {
            context.report({
              node: call.node,
              messageId: 'nonDynamicComponent',
              data: { name: call.firstArgName },
            })
          }
        }
      },
    }
  },
}

/**
 * Local ESLint plugin containing project-specific rules.
 */
export const localRulesPlugin = {
  meta: {
    name: 'eslint-plugin-local-rules',
    version: '1.0.0',
  },
  rules: {
    'require-feature-guard': requireFeatureGuard,
  },
}
