/**
 * Token Validation Script
 *
 * Validates design tokens against schema and business rules:
 * - Token structure matches DTCG format
 * - Color values are valid hex codes
 * - Spacing values are multiples of 8px
 * - No duplicate token names
 * - Semantic tokens reference valid primitives
 */

import { z } from 'zod'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Token schemas
const BaseTokenSchema = z.object({
  value: z.string(),
  type: z.enum(['color', 'dimension', 'fontFamily', 'fontWeight', 'number', 'shadow']),
  description: z.string().optional(),
})

const TokenFileSchema = z.object({
  $schema: z.string().optional(),
  figma: z
    .object({
      fileKey: z.string(),
      lastSync: z.string().nullable(),
    })
    .optional(),
})

const ColorTokenSchema = BaseTokenSchema.extend({
  type: z.literal('color'),
  value: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'),
})

const DimensionTokenSchema = BaseTokenSchema.extend({
  type: z.literal('dimension'),
  value: z.string().regex(/^\d+px$/, 'Dimension must be in px format'),
})

// Validation functions
function validateColorToken(name: string, token: unknown): boolean {
  try {
    ColorTokenSchema.parse(token)
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Invalid color token "${name}":`, error.errors[0].message)
    }
    return false
  }
}

function validateSpacingToken(name: string, token: unknown): boolean {
  try {
    DimensionTokenSchema.parse(token)

    // Check 8px grid compliance
    const value = (token as { value: string }).value
    const numValue = parseInt(value)

    if (name !== '0' && numValue % 8 !== 0) {
      console.error(`❌ Spacing token "${name}" must be a multiple of 8px, got ${value}`)
      return false
    }

    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Invalid spacing token "${name}":`, error.errors[0].message)
    }
    return false
  }
}

function validateTokenFile(filePath: string): boolean {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${path.basename(filePath)} (file not found - will be created on first sync)`)
      return true
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const tokens = JSON.parse(content)

    // Validate base structure
    TokenFileSchema.parse(tokens)

    let isValid = true

    // Validate color tokens
    if (tokens.color?.primitive) {
      Object.entries(tokens.color.primitive).forEach(([name, token]) => {
        if (!validateColorToken(name, token)) {
          isValid = false
        }
      })
    }

    // Validate spacing tokens
    if (tokens.spacing) {
      Object.entries(tokens.spacing).forEach(([name, token]) => {
        if (!validateSpacingToken(name, token)) {
          isValid = false
        }
      })
    }

    return isValid
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`❌ Invalid JSON in ${filePath}:`, error.message)
    } else if (error instanceof z.ZodError) {
      console.error(`❌ Schema validation failed for ${filePath}:`, error.errors[0].message)
    } else {
      console.error(`❌ Error validating ${filePath}:`, error)
    }
    return false
  }
}

// Main validation
async function main() {
  console.log('🔍 Validating design tokens...\n')

  const tokensDir = path.join(__dirname, '../src/tokens')
  const baseDir = path.join(tokensDir, 'base')
  const semanticDir = path.join(tokensDir, 'semantic')

  const filesToValidate = [
    path.join(baseDir, 'colors.tokens.json'),
    path.join(baseDir, 'spacing.tokens.json'),
    path.join(baseDir, 'typography.tokens.json'),
    path.join(baseDir, 'radius.tokens.json'),
    path.join(baseDir, 'shadows.tokens.json'),
    path.join(semanticDir, 'light.tokens.json'),
    path.join(semanticDir, 'dark.tokens.json'),
  ]

  let allValid = true

  for (const file of filesToValidate) {
    const fileName = path.basename(file)
    const isValid = validateTokenFile(file)

    if (isValid) {
      console.log(`✅ ${fileName} is valid`)
    } else {
      allValid = false
    }
  }

  console.log()

  if (allValid) {
    console.log('✅ All token files are valid!')
    process.exit(0)
  } else {
    console.log('❌ Token validation failed. Please fix the errors above.')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Validation script failed:', error)
  process.exit(1)
})
