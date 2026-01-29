import type { Meta, StoryObj } from '@storybook/react'
import { ThursdayTestV1 } from './ThursdayTestV1'
import { ThursdayTestV2 } from './ThursdayTestV2'
import { ThursdayTestV3 } from './ThursdayTestV3'
import { AssetTableV1 } from './AssetTableV1'
import { AssetTableV2 } from './AssetTableV2'
import { AssetTableV3 } from './AssetTableV3'
import { Dashboard } from './Dashboard'
import { TotalValueCard } from './TotalValueCard'
import { AssetsCard } from './AssetsCard'
import { PendingCard } from './PendingCard'

/**
 * Thursday Test: Figma Code Connect Experiment
 *
 * This story compares different Figma component structures to evaluate
 * how Code Connect integration affects code generation quality.
 *
 * ## Dashboard (node 1:3235)
 * Full home screen with Total Value, Assets, and Pending cards
 *
 * ## Portfolio Screens
 * - V1: Less componentized (node 15:2185) - Sidebar + Asset table with 8 rows
 * - V2: With annotations (node 15:2648) - Same as V1 with designer guidance
 * - V3: Most componentized (node 1:3203) - Sidebar + Asset table with 4 rows
 *
 * ## Individual Components
 * - Isolated components for focused comparison
 *
 * Key finding: Better Figma structure = Better code generation
 */

const meta = {
  title: 'UI/Showcase/ObraLibrary/ThursdayTest',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Dashboard Story
export const DashboardScreen: Story = {
  render: () => <Dashboard />,
  parameters: {
    docs: {
      description: {
        story:
          'Full dashboard from Figma node 1:3235. Home screen with Total Value card, Assets table, and Pending transactions.',
      },
    },
  },
}

// Portfolio Full Screen Stories
export const PortfolioV1: Story = {
  render: () => <ThursdayTestV1 />,
  parameters: {
    docs: {
      description: {
        story:
          'Portfolio screen from Figma node 15:2185. Sidebar + Asset table with 8 rows. Figma output was ~750 lines with lots of inline Tailwind classes.',
      },
    },
  },
}

export const PortfolioV2: Story = {
  render: () => <ThursdayTestV2 />,
  parameters: {
    docs: {
      description: {
        story:
          'Portfolio screen from Figma node 15:2648. Same visual as V1 but includes `data-annotations` with implementation guidance from designer.',
      },
    },
  },
}

export const PortfolioV3: Story = {
  render: () => <ThursdayTestV3 />,
  parameters: {
    docs: {
      description: {
        story:
          'Portfolio screen from Figma node 1:3203. Most componentized with only 4 rows. Figma output was ~200 lines. Card component with explicit slots.',
      },
    },
  },
}

// Individual Card Components
export const TotalValueCardOnly: Story = {
  render: () => (
    <div className="p-6 bg-muted/40 min-h-screen">
      <div className="max-w-[400px]">
        <TotalValueCard totalValue="1234$" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Total value card with Send/Receive/Swap action buttons.',
      },
    },
  },
}

export const AssetsCardOnly: Story = {
  render: () => (
    <div className="p-6 bg-muted/40 min-h-screen">
      <div className="max-w-[666px]">
        <AssetsCard />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Assets card with table showing token holdings.',
      },
    },
  },
}

export const PendingCardOnly: Story = {
  render: () => (
    <div className="p-6 bg-muted/40 min-h-screen">
      <PendingCard />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pending transactions card with signature count badges.',
      },
    },
  },
}

// Asset Table Only Stories
export const AssetTableOnlyV1: Story = {
  render: () => (
    <div className="p-6 bg-muted/40 min-h-screen">
      <AssetTableV1 />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Asset table component only (V1) - 8 rows, less componentized Figma structure.',
      },
    },
  },
}

export const AssetTableOnlyV2: Story = {
  render: () => (
    <div className="p-6 bg-muted/40 min-h-screen">
      <AssetTableV2 />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Asset table component only (V2) - With annotation guidance for Card slots.',
      },
    },
  },
}

export const AssetTableOnlyV3: Story = {
  render: () => (
    <div className="p-6 bg-muted/40 min-h-screen">
      <AssetTableV3 />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Asset table component only (V3) - 4 rows, most componentized with Card slots.',
      },
    },
  },
}
