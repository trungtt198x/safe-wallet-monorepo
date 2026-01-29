import type { Meta, StoryObj } from '@storybook/react'
import { ThursdayTestV1 } from './ThursdayTestV1'
import { ThursdayTestV2 } from './ThursdayTestV2'
import { ThursdayTestV3 } from './ThursdayTestV3'

/**
 * Thursday Test: Figma Code Connect Experiment
 *
 * This story compares three different Figma component structures to evaluate
 * how Code Connect integration affects code generation quality.
 *
 * - V1: Less componentized (node 15:2185) - 8 rows, inline styles
 * - V2: With annotations (node 15:2648) - Same as V1 with designer guidance
 * - V3: Most componentized (node 1:3203) - 4 rows, Card with slots
 *
 * Key finding: Better Figma structure = Better code generation
 */

const meta = {
  title: 'UI/Showcase/ObraLibrary/ThursdayTest',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const V1LessComponentized: Story = {
  render: () => <ThursdayTestV1 />,
  parameters: {
    docs: {
      description: {
        story:
          'V1 from Figma node 15:2185. Less componentized with 8 asset rows. Figma output was ~750 lines with lots of inline Tailwind classes.',
      },
    },
  },
}

export const V2WithAnnotations: Story = {
  render: () => <ThursdayTestV2 />,
  parameters: {
    docs: {
      description: {
        story:
          'V2 from Figma node 15:2648. Same visual as V1 but includes `data-annotations` with implementation guidance from designer: "this element should be a component Card with 3 slots..."',
      },
    },
  },
}

export const V3Componentized: Story = {
  render: () => <ThursdayTestV3 />,
  parameters: {
    docs: {
      description: {
        story:
          'V3 from Figma node 1:3203. Most componentized version with only 4 rows. Figma output was ~200 lines. Card component with explicit headerSlot, mainSlot, footerSlot.',
      },
    },
  },
}
