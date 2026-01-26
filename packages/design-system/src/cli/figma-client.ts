/**
 * Figma Client
 * 
 * Integration with Figma MCP for token extraction.
 * Currently supports light mode only.
 * 
 * TODO: When dark mode is available in Figma:
 * 1. Update get_variable_defs call to include mode parameter
 * 2. Map dark mode values to token.darkValue
 * 3. Update the sync-tokens CLI to handle both modes
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'

interface DesignSystemConfig {
  figma: {
    fileKey: string
    nodeId: string
    collectionName: string
    url: string
  }
  output: {
    directory: string
    formats: string[]
  }
  transform: {
    colorPrefix: string
    spacingPrefix: string
    typographyPrefix: string
    radiusPrefix: string
  }
}

/**
 * Loads the design system configuration
 */
export const loadConfig = (configPath?: string): DesignSystemConfig => {
  const defaultPath = join(dirname(dirname(dirname(__dirname))), '.design-system.config.json')
  const path = configPath ?? defaultPath

  try {
    const content = readFileSync(path, 'utf-8')
    return JSON.parse(content) as DesignSystemConfig
  } catch {
    throw new Error(`Failed to load config from ${path}`)
  }
}

/**
 * Placeholder for Figma MCP integration
 * 
 * In production, this would call the Figma MCP get_variable_defs tool.
 * For now, returns hardcoded tokens from the Figma file we analyzed.
 */
export const fetchFigmaVariables = async (
  _fileKey: string,
  _nodeId: string
): Promise<Record<string, string>> => {
  // These are the actual tokens from the Figma DS · Foundations file
  // Extracted via Figma MCP get_variable_defs on node-id 95:2000
  return {
    // Colors - Light Mode
    'color/background': '#f4f4f4',
    'color/foreground': '#121312',
    'color/card': '#fbfbfb',
    'color/card-foreground': '#353835',
    'color/muted-foreground': '#a3aaa3',
    'color/border': '#f4f4f4',
    'color/border-surface': '#ffffff',
    'color/text-muted': '#cad0cc',
    'color/state-positive': '#00b460',
    'color/bg-state-positive': '#e5f6ec',
    'color/state-negative': '#ff5f72',
    'color/bg-state-negative': '#ffe8eb',
    'color/primary': '#2f2f2f',
    
    // Spacing
    'space/1': '4',
    'space/xs': '8',
    'space/3': '12',
    'space/s': '16',
    'space/xl': '32',
    
    // Radius
    'radius/lg': '16',
    'radius/xl': '24',
  }
}

/**
 * Gets the Figma source info for manifest
 */
export const getFigmaSource = (config: DesignSystemConfig) => ({
  fileKey: config.figma.fileKey,
  nodeId: config.figma.nodeId,
  url: config.figma.url,
})
