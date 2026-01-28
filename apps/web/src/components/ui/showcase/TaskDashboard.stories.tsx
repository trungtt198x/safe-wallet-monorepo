import type { Meta, StoryObj } from '@storybook/react'
import { TaskDashboard } from './TaskDashboard'

const meta = {
  title: 'UI/Showcase/TaskDashboard',
  component: TaskDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TaskDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomTitle: Story = {
  args: {
    title: 'Good morning, John!',
    subtitle: 'You have 15 tasks pending for today.',
  },
}

export const EmptyState: Story = {
  args: {
    title: 'No tasks yet',
    subtitle: 'Create your first task to get started.',
    tasks: [],
  },
}

export const FewTasks: Story = {
  args: {
    tasks: [
      {
        id: 'TASK-001',
        type: 'Feature',
        title: 'Implement user authentication',
        status: 'In Progress',
        priority: 'High',
      },
      {
        id: 'TASK-002',
        type: 'Bug',
        title: 'Fix navigation menu on mobile',
        status: 'Todo',
        priority: 'Medium',
      },
      {
        id: 'TASK-003',
        type: 'Documentation',
        title: 'Update API documentation',
        status: 'Done',
        priority: 'Low',
      },
    ],
  },
}
