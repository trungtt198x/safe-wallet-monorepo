#!/usr/bin/env node
/**
 * Token Sync CLI
 * 
 * Syncs design tokens from Figma to CSS files.
 * Usage: yarn sync-tokens [options]
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { loadConfig, fetchFigmaVariables, getFigmaSource } from './figma-client'
import { transformFigmaVariables, generateCssFile, generateManifest, generateHeader } from './transform'

interface CLIOptions {
  dryRun: boolean
  verbose: boolean
  output?: string
}

const parseArgs = (): CLIOptions => {
  const args = process.argv.slice(2)
  return {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose'),
    output: args.find((a) => a.startsWith('--output='))?.split('=')[1],
  }
}

const log = (message: string, verbose: boolean) => {
  if (verbose) {
    console.log(message)
  }
}

const main = async () => {
  const options = parseArgs()
  const startTime = Date.now()

  console.log('🎨 Token Sync CLI')
  console.log('─'.repeat(40))

  try {
    // Load configuration
    log('Loading configuration...', options.verbose)
    const configPath = join(dirname(dirname(__dirname)), '.design-system.config.json')
    const config = loadConfig(configPath)
    log(`  File: ${config.figma.fileKey}`, options.verbose)
    log(`  Node: ${config.figma.nodeId}`, options.verbose)

    // Fetch tokens from Figma
    console.log('📥 Fetching tokens from Figma...')
    const variables = await fetchFigmaVariables(config.figma.fileKey, config.figma.nodeId)
    const tokenCount = Object.keys(variables).length
    console.log(`  Found ${tokenCount} variables`)

    // Transform tokens
    log('Transforming tokens...', options.verbose)
    const tokens = transformFigmaVariables(variables, config.transform)

    // Count by category
    const colorCount = tokens.filter((t) => t.category === 'color').length
    const spacingCount = tokens.filter((t) => t.category === 'spacing').length
    const typographyCount = tokens.filter((t) => t.category === 'typography').length
    const radiusCount = tokens.filter((t) => t.category === 'radius').length

    console.log('✓ Transformed tokens:')
    console.log(`  • ${colorCount} colors`)
    console.log(`  • ${spacingCount} spacing`)
    console.log(`  • ${typographyCount} typography`)
    console.log(`  • ${radiusCount} radius`)

    // Determine output directory
    const outputDir = options.output ?? join(dirname(dirname(__dirname)), config.output.directory)

    if (options.dryRun) {
      console.log('\n[DRY RUN] Would write to:', outputDir)
      console.log('[DRY RUN] Files:')
      console.log('  • colors.css')
      console.log('  • spacing.css')
      console.log('  • typography.css')
      console.log('  • radius.css')
      console.log('  • index.css')
      console.log('  • tokens.json')
    } else {
      // Ensure output directory exists
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
      }

      // Generate and write CSS files
      const files = [
        { name: 'colors.css', category: 'color' as const },
        { name: 'spacing.css', category: 'spacing' as const },
        { name: 'typography.css', category: 'typography' as const },
        { name: 'radius.css', category: 'radius' as const },
      ]

      console.log('\n📝 Writing files...')

      for (const file of files) {
        const content = generateCssFile(tokens, file.category, generateHeader(file.category))
        if (content) {
          const filePath = join(outputDir, file.name)
          writeFileSync(filePath, content + '\n')
          const count = tokens.filter((t) => t.category === file.category).length
          console.log(`  ✓ ${file.name} (${count} tokens)`)
        }
      }

      // Generate index.css
      const indexContent = `/**
 * Design System Tokens - Combined Import
 * Generated: ${new Date().toISOString()}
 */

@import './colors.css';
@import './spacing.css';
@import './typography.css';
@import './radius.css';
`
      writeFileSync(join(outputDir, 'index.css'), indexContent)
      console.log('  ✓ index.css')

      // Generate manifest
      const manifest = generateManifest(tokens, getFigmaSource(config))
      writeFileSync(join(outputDir, 'tokens.json'), JSON.stringify(manifest, null, 2) + '\n')
      console.log('  ✓ tokens.json')
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n✅ Token sync complete in ${elapsed}s`)
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Failed to sync tokens')
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
