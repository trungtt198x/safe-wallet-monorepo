import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import GridViewIcon from '@mui/icons-material/GridView'
import { ToggleButtonGroup } from './index'

const meta = {
  component: ToggleButtonGroup,
  parameters: {
    layout: 'centered',
  },
  // Skip visual regression tests until baseline snapshots are generated
  tags: ['autodocs', '!test'],
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof ToggleButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

const defaultChildren = [
  { title: 'Tokens', content: null },
  { title: 'NFTs', content: null },
]

const threeOptionsChildren = [
  { title: 'All', content: null },
  { title: 'Pending', content: null },
  { title: 'Completed', content: null },
]

const iconChildren = [
  { title: <ListIcon />, content: null },
  { title: <GridViewIcon />, content: null },
]

const iconAndTextChildren = [
  {
    title: (
      <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
        <ListIcon fontSize="small" /> List
      </Typography>
    ),
    content: null,
  },
  {
    title: (
      <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
        <GridViewIcon fontSize="small" /> Grid
      </Typography>
    ),
    content: null,
  },
]

const preselectedChildren = [
  { title: 'Assets', content: null },
  { title: 'Positions', content: null },
]

export const Default: Story = {
  args: {
    children: defaultChildren,
  },
  render: (args) => <ToggleButtonGroup value={args.value}>{args.children}</ToggleButtonGroup>,
}

export const ThreeOptions: Story = {
  args: {
    children: threeOptionsChildren,
  },
  render: (args) => <ToggleButtonGroup value={args.value}>{args.children}</ToggleButtonGroup>,
}

export const WithIcons: Story = {
  args: {
    children: iconChildren,
  },
  render: (args) => <ToggleButtonGroup value={args.value}>{args.children}</ToggleButtonGroup>,
}

export const WithIconsAndText: Story = {
  args: {
    children: iconAndTextChildren,
  },
  render: (args) => <ToggleButtonGroup value={args.value}>{args.children}</ToggleButtonGroup>,
}

export const PreselectedValue: Story = {
  args: {
    value: 1,
    children: preselectedChildren,
  },
  render: (args) => <ToggleButtonGroup value={args.value}>{args.children}</ToggleButtonGroup>,
}
