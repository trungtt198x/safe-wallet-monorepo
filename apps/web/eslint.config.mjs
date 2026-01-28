import unusedImports from 'eslint-plugin-unused-imports'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import boundaries from 'eslint-plugin-boundaries'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { localRulesPlugin } from './eslint-local-rules.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/.next/',
      '**/.github/',
      '**/cypress/',
      '**/src/types/contracts/',
      '**/.storybook/test-runner.mjs',
    ],
  },
  ...compat.extends('next', 'prettier', 'plugin:storybook/recommended'),
  {
    plugins: {
      'unused-imports': unusedImports,
      '@typescript-eslint': typescriptEslint,
      'no-only-tests': noOnlyTests,
      boundaries: boundaries,
      'local-rules': localRulesPlugin,
    },

    settings: {
      'boundaries/elements': [
        { type: 'feature', pattern: 'src/features/*', capture: ['featureName'] },
        { type: 'shared', pattern: 'src/*', mode: 'folder' },
      ],
      'boundaries/ignore': ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },

    rules: {
      '@next/next/no-img-element': 'off',
      '@next/next/google-font-display': 'off',
      '@next/next/google-font-preconnect': 'off',
      '@next/next/no-page-custom-font': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'no-constant-condition': 'warn',

      'unused-imports/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
        },
      ],

      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: 'useAsync',
        },
      ],

      'no-only-tests/no-only-tests': 'error',
      'object-shorthand': ['error', 'properties'],
      'jsx-quotes': ['error', 'prefer-double'],

      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],

      // Feature architecture: Prevent importing feature internals from outside the feature
      // Allowed imports:
      //   - @/features/{name} (index.ts - public API)
      //   - @/features/{name}/types (shared types)
      //   - @/features/{name}/components (sub-barrel for complex features)
      //   - @/features/{name}/hooks (sub-barrel for complex features)
      //   - @/features/{name}/services (sub-barrel for complex features)
      //   - @/features/{name}/store (sub-barrel for complex features)
      // Blocked: Anything inside those folders like @/features/*/components/Foo
      // Set to 'warn' during migration phase - will be changed to 'error' after all features are migrated
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              // Block internal imports (anything inside sub-folders)
              // Allows: @/features/foo/components (sub-barrel index.ts)
              // Blocks: @/features/foo/components/Bar (individual component)
              group: [
                '@/features/*/components/*',
                '@/features/*/hooks/*',
                '@/features/*/services/*',
                '@/features/*/store/*',
              ],
              message:
                'Import from feature barrel or sub-barrel only (e.g., @/features/foo or @/features/foo/components).',
            },
          ],
        },
      ],

      // Feature boundaries: Features must use relative imports internally
      // This ensures barrel exports are only used by external consumers,
      // which allows tools like knip to detect truly unused barrel exports.
      'boundaries/element-types': [
        'warn',
        {
          default: 'allow',
          rules: [
            {
              // Features can import from other features, but only through barrels
              from: ['feature'],
              allow: [
                // Allow importing from other features' public APIs
                ['feature', { featureName: '!${from.featureName}' }],
              ],
              disallow: [
                // Disallow importing from same feature via absolute paths (use relative instead)
                ['feature', { featureName: '${from.featureName}' }],
              ],
              message:
                'Use relative imports within a feature. Absolute @/features/* imports are for cross-feature only.',
            },
          ],
        },
      ],

      // Feature architecture: Require withFeatureGuard for dynamic imports in barrel files
      // This ensures all exported components are properly gated by feature flags.
      // Set to 'warn' during migration phase - will be changed to 'error' after all features are migrated
      'local-rules/require-feature-guard': 'warn',
    },
  },
  // Override for story files: allow type-only imports from @storybook/react
  // since @storybook/nextjs re-exports these types but TypeScript doesn't always resolve them correctly
  {
    files: ['**/*.stories.tsx', '**/*.stories.ts'],
    rules: {
      'storybook/no-renderer-packages': 'off',
    },
  },
]
