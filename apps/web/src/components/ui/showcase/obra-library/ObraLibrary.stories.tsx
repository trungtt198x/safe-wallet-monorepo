import type { Meta, StoryObj } from '@storybook/react'
import { ObraLibrary } from './ObraLibrary'

const sampleAssets = [
  {
    id: '1',
    name: 'Name',
    value: '123$',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'N',
  },
  {
    id: '2',
    name: 'Name',
    value: '123$',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'N',
  },
  {
    id: '3',
    name: 'Name',
    value: '123$',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'N',
  },
  {
    id: '4',
    name: 'Name',
    value: '123$',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'N',
  },
]

const samplePendingItems = [
  {
    id: '1',
    name: 'Name',
    value: '1/3',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'N',
  },
  {
    id: '2',
    name: 'Name',
    value: '1/3',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'N',
  },
  {
    id: '3',
    name: 'Name',
    value: '1/3',
    avatarSrc: 'https://github.com/shadcn.png',
    avatarFallback: 'N',
  },
]

const meta = {
  title: 'UI/Showcase/ObraLibrary/ObraLibrary',
  component: ObraLibrary,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onFilterChange: { action: 'filter changed' },
  },
} satisfies Meta<typeof ObraLibrary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    totalAssetValue: '$16,801.50',
    assets: sampleAssets,
    pendingItems: samplePendingItems,
    filters: ['Label', 'Label', 'Label'],
    activeFilter: 'Label',
  },
}

export const WithCustomFilters: Story = {
  args: {
    totalAssetValue: '$16,801.50',
    assets: sampleAssets,
    pendingItems: samplePendingItems,
    filters: ['All', 'Tokens', 'NFTs'],
    activeFilter: 'All',
  },
}

export const EmptyAssets: Story = {
  args: {
    totalAssetValue: '$0.00',
    assets: [],
    pendingItems: [],
    filters: ['Label', 'Label', 'Label'],
  },
}

export const LargeAssetValue: Story = {
  args: {
    totalAssetValue: '$1,234,567.89',
    assets: sampleAssets,
    pendingItems: samplePendingItems,
    filters: ['Label', 'Label', 'Label'],
  },
}

export const MultipleAssets: Story = {
  args: {
    totalAssetValue: '$16,801.50',
    assets: [
      ...sampleAssets,
      {
        id: '5',
        name: 'BTC',
        value: '$45,000.00',
        avatarSrc: 'https://github.com/shadcn.png',
        avatarFallback: 'B',
      },
      {
        id: '6',
        name: 'USDC',
        value: '$10,000.00',
        avatarSrc: 'https://github.com/shadcn.png',
        avatarFallback: 'U',
      },
    ],
    pendingItems: samplePendingItems,
    filters: ['Label', 'Label', 'Label'],
  },
}
