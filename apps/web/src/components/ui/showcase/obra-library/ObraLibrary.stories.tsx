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
} satisfies Meta<typeof ObraLibrary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    totalAssetValue: '1234$',
    assets: sampleAssets,
    pendingItems: samplePendingItems,
  },
}
