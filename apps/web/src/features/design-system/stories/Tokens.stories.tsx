import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import tokens from '@safe-global/design-system/tokens/tokens.json'

interface SwatchProps {
  name: string
  value: string
  cssVar: string
}

const ColorSwatch = ({ name, value, cssVar }: SwatchProps) => (
  <div className="flex items-center gap-4 p-2">
    <div
      className="h-12 w-12 rounded border border-gray-200"
      style={{ backgroundColor: `hsl(${value})` }}
    />
    <div>
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-gray-500">{cssVar}</p>
      <p className="text-xs text-gray-400">hsl({value})</p>
    </div>
  </div>
)

interface SpacingSwatchProps {
  name: string
  value: string
  cssVar: string
}

const SpacingSwatch = ({ name, value, cssVar }: SpacingSwatchProps) => (
  <div className="flex items-center gap-4 p-2">
    <div className="flex items-center h-12 w-24">
      <div className="h-4 bg-primary" style={{ width: value }} />
    </div>
    <div>
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-gray-500">{cssVar}</p>
      <p className="text-xs text-gray-400">{value}</p>
    </div>
  </div>
)

interface RadiusSwatchProps {
  name: string
  value: string
  cssVar: string
}

const RadiusSwatch = ({ name, value, cssVar }: RadiusSwatchProps) => (
  <div className="flex items-center gap-4 p-2">
    <div
      className="h-12 w-12 bg-primary"
      style={{ borderRadius: value }}
    />
    <div>
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-gray-500">{cssVar}</p>
      <p className="text-xs text-gray-400">{value}</p>
    </div>
  </div>
)

interface SectionProps {
  title: string
  children: ReactNode
}

const Section = ({ title, children }: SectionProps) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {children}
    </div>
  </div>
)

const TokensDisplay = () => {
  const colorTokens = tokens.tokens.filter((t) => t.category === 'color')
  const spacingTokens = tokens.tokens.filter((t) => t.category === 'spacing')
  const radiusTokens = tokens.tokens.filter((t) => t.category === 'radius')

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-2">Design Tokens</h1>
      <p className="text-gray-600 mb-6">
        Synced from Figma DS · Foundations on {new Date(tokens.generatedAt).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Total: {tokens.stats.totalTokens} tokens ({tokens.stats.colors} colors, {tokens.stats.spacing} spacing, {tokens.stats.radius} radius)
      </p>

      <Section title="Colors">
        {colorTokens.map((token) => (
          <ColorSwatch
            key={token.cssVariable}
            name={token.figmaName}
            value={token.lightValue}
            cssVar={token.cssVariable}
          />
        ))}
      </Section>

      <Section title="Spacing">
        {spacingTokens.map((token) => (
          <SpacingSwatch
            key={token.cssVariable}
            name={token.figmaName}
            value={token.lightValue}
            cssVar={token.cssVariable}
          />
        ))}
      </Section>

      <Section title="Border Radius">
        {radiusTokens.map((token) => (
          <RadiusSwatch
            key={token.cssVariable}
            name={token.figmaName}
            value={token.lightValue}
            cssVar={token.cssVariable}
          />
        ))}
      </Section>
    </div>
  )
}

const meta: Meta<typeof TokensDisplay> = {
  title: 'Design System/Tokens',
  component: TokensDisplay,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const AllTokens: Story = {}
