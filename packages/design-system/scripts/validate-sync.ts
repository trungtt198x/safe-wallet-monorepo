/**
 * Validate Figma Sync Script
 *
 * Automatically checks that a component sync from Figma is complete and correct.
 * Run this after syncing tokens or components from Figma.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ValidationResult {
  passed: boolean
  message: string
  category: string
}

const results: ValidationResult[] = []

function addResult(category: string, passed: boolean, message: string) {
  results.push({ category, passed, message })
}

// Check 1: tokens.css is imported in globals.css
function checkTokensCssImport(): void {
  const globalsPath = path.join(__dirname, '../src/web/styles/globals.css')

  if (!fs.existsSync(globalsPath)) {
    addResult('CSS Setup', false, 'globals.css not found')
    return
  }

  const content = fs.readFileSync(globalsPath, 'utf-8')
  const hasImport = content.includes("@import './tokens.css'") || content.includes('@import "./tokens.css"')

  if (hasImport) {
    addResult('CSS Setup', true, 'tokens.css is imported in globals.css')
  } else {
    addResult('CSS Setup', false, 'tokens.css is NOT imported in globals.css - add @import "./tokens.css"')
  }
}

// Check 2: Tailwind config has design tokens
function checkTailwindConfig(): void {
  const configPath = path.join(__dirname, '../tailwind.config.js')

  if (!fs.existsSync(configPath)) {
    addResult('Tailwind Config', false, 'tailwind.config.js not found')
    return
  }

  const content = fs.readFileSync(configPath, 'utf-8')

  const checks = [
    { key: 'surface', message: 'bg-surface color token' },
    { key: 'text-primary', message: 'text-primary color token' },
    { key: 'ds-1', message: 'ds-1 spacing token' },
    { key: 'ds-2', message: 'ds-2 spacing token' },
  ]

  let allFound = true
  const missing: string[] = []

  checks.forEach(({ key, message }) => {
    if (!content.includes(`'${key}'`)) {
      allFound = false
      missing.push(message)
    }
  })

  if (allFound) {
    addResult('Tailwind Config', true, 'All design tokens configured in Tailwind')
  } else {
    addResult('Tailwind Config', false, `Missing tokens: ${missing.join(', ')}`)
  }
}

// Check 3: Token files exist and are valid
function checkTokenFiles(): void {
  const tokenFiles = [
    'src/tokens/base/colors.tokens.json',
    'src/tokens/base/spacing.tokens.json',
    'src/tokens/base/radius.tokens.json',
    'src/tokens/semantic/light.tokens.json',
  ]

  tokenFiles.forEach((file) => {
    const filePath = path.join(__dirname, '..', file)

    if (!fs.existsSync(filePath)) {
      addResult('Token Files', false, `${file} does not exist`)
      return
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(content)

      if (!parsed.figma || !parsed.figma.fileKey) {
        addResult('Token Files', false, `${file} missing figma.fileKey`)
      } else {
        addResult('Token Files', true, `${file} is valid`)
      }
    } catch {
      addResult('Token Files', false, `${file} has invalid JSON`)
    }
  })
}

// Check 4: CSS variables are defined
function checkCssVariables(): void {
  const tokensPath = path.join(__dirname, '../src/web/styles/tokens.css')

  if (!fs.existsSync(tokensPath)) {
    addResult('CSS Variables', false, 'tokens.css does not exist')
    return
  }

  const content = fs.readFileSync(tokensPath, 'utf-8')

  const requiredVars = [
    '--ds-color-bg-surface',
    '--ds-color-text-primary',
    '--ds-spacing-8',
    '--ds-spacing-16',
    '--ds-radius-md',
  ]

  const missing = requiredVars.filter((v) => !content.includes(v))

  if (missing.length === 0) {
    addResult('CSS Variables', true, 'All required CSS variables defined')
  } else {
    addResult('CSS Variables', false, `Missing variables: ${missing.join(', ')}`)
  }
}

// Check 5: Component stories have Figma links
function checkStorybookLinks(): void {
  const storiesDir = path.join(__dirname, '../src/web/components/ui')

  if (!fs.existsSync(storiesDir)) {
    addResult('Storybook', false, 'Components directory not found')
    return
  }

  const storyFiles = fs.readdirSync(storiesDir).filter((f) => f.endsWith('.stories.tsx'))

  if (storyFiles.length === 0) {
    addResult('Storybook', false, 'No story files found')
    return
  }

  storyFiles.forEach((file) => {
    const filePath = path.join(storiesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    const hasFigmaLink = content.includes('design:') && content.includes('figma.com')
    const hasCorrectPath = content.includes("title: 'Design System/Components/")

    if (hasFigmaLink && hasCorrectPath) {
      addResult('Storybook', true, `${file} has Figma link and correct path`)
    } else {
      const issues: string[] = []
      if (!hasFigmaLink) issues.push('missing Figma link')
      if (!hasCorrectPath) issues.push('incorrect story path')
      addResult('Storybook', false, `${file}: ${issues.join(', ')}`)
    }
  })
}

// Check 6: Tests cover Figma fidelity
function checkTests(): void {
  const testDir = path.join(__dirname, '../src/web/components/ui')

  if (!fs.existsSync(testDir)) {
    addResult('Tests', false, 'Components directory not found')
    return
  }

  const testFiles = fs.readdirSync(testDir).filter((f) => f.endsWith('.test.tsx'))

  if (testFiles.length === 0) {
    addResult('Tests', false, 'No test files found')
    return
  }

  testFiles.forEach((file) => {
    const filePath = path.join(testDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    const hasFigmaFidelityTests = content.includes('Figma Design Fidelity') || content.includes('Figma design')
    const testsTokens =
      content.includes('toHaveClass') &&
      (content.includes('bg-surface') ||
        content.includes('rounded-md') ||
        content.includes('ds-1') ||
        content.includes('ds-2'))
    const testsAbsence = content.includes('not.toContain')

    if (hasFigmaFidelityTests && testsTokens && testsAbsence) {
      addResult('Tests', true, `${file} has comprehensive Figma fidelity tests`)
    } else {
      const issues: string[] = []
      if (!hasFigmaFidelityTests) issues.push('missing Figma fidelity describe block')
      if (!testsTokens) issues.push('not testing token classes')
      if (!testsAbsence) issues.push('not testing absence of unwanted styles')
      addResult('Tests', false, `${file}: ${issues.join(', ')}`)
    }
  })
}

// Main validation
async function main() {
  console.log('🔍 Validating Figma sync...\n')

  checkTokensCssImport()
  checkTailwindConfig()
  checkTokenFiles()
  checkCssVariables()
  checkStorybookLinks()
  checkTests()

  console.log('\n📊 Validation Results:\n')

  const categories = [...new Set(results.map((r) => r.category))]

  categories.forEach((category) => {
    const categoryResults = results.filter((r) => r.category === category)
    const passed = categoryResults.filter((r) => r.passed).length
    const total = categoryResults.length

    console.log(`${category}: ${passed}/${total} passed`)

    categoryResults.forEach((r) => {
      const icon = r.passed ? '  ✅' : '  ❌'
      console.log(`${icon} ${r.message}`)
    })

    console.log()
  })

  const allPassed = results.every((r) => r.passed)
  const totalPassed = results.filter((r) => r.passed).length
  const totalTests = results.length

  console.log(`\n${'='.repeat(60)}`)
  console.log(`Total: ${totalPassed}/${totalTests} checks passed`)
  console.log('='.repeat(60))

  if (allPassed) {
    console.log('\n✅ All validation checks passed! Figma sync is complete.\n')
    process.exit(0)
  } else {
    console.log('\n❌ Some validation checks failed. Please fix the issues above.\n')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Validation script failed:', error)
  process.exit(1)
})
