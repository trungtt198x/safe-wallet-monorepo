'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'
import { Badge } from '../badge'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu'
import { Input } from '../input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table'

import {
  FilterIcon,
  PlusIcon,
  MoreHorizontalIcon,
  ClockIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CopyIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react'

type TaskType = 'Documentation' | 'Feature' | 'Bug'
type TaskStatus = 'In Progress' | 'Done' | 'Todo' | 'Canceled'
type TaskPriority = 'Low' | 'Medium' | 'High'

interface Task {
  id: string
  type: TaskType
  title: string
  status: TaskStatus
  priority: TaskPriority
}

const SAMPLE_TASKS: Task[] = [
  {
    id: 'TASK-8782',
    type: 'Documentation',
    title: "You can't compress the program without quantifying the open-source SS...",
    status: 'In Progress',
    priority: 'Medium',
  },
  {
    id: 'TASK-1138',
    type: 'Feature',
    title: "Generating the driver won't do anything, we need to quantify the 1080p SM ...",
    status: 'In Progress',
    priority: 'Medium',
  },
  {
    id: 'TASK-8404',
    type: 'Documentation',
    title: "Calculating the bus won't do anything, we need to navigate the back-end...",
    status: 'In Progress',
    priority: 'High',
  },
  {
    id: 'TASK-5365',
    type: 'Bug',
    title: 'We need to generate the virtual HEX alarm!',
    status: 'In Progress',
    priority: 'Low',
  },
  {
    id: 'TASK-1024',
    type: 'Documentation',
    title: "Backing up the pixel won't do anything, we need to transmit the primary I...",
    status: 'In Progress',
    priority: 'Low',
  },
  {
    id: 'TASK-1571',
    type: 'Documentation',
    title: "Overriding the microchip won't do anything, we need to transmit the digit...",
    status: 'In Progress',
    priority: 'Low',
  },
  {
    id: 'TASK-8484',
    type: 'Feature',
    title: "I'll input the neural DRAM circuit, that should protocol the SMTP interface!",
    status: 'In Progress',
    priority: 'Medium',
  },
  {
    id: 'TASK-9616',
    type: 'Bug',
    title: 'We need to parse the solid state UDP firewall!',
    status: 'In Progress',
    priority: 'Low',
  },
  {
    id: 'TASK-4920',
    type: 'Feature',
    title: 'We need to synthesize the cross-platform ASCII pixel!',
    status: 'In Progress',
    priority: 'Medium',
  },
  {
    id: 'TASK-5168',
    type: 'Bug',
    title: "Bypassing the hard drive won't do anything, we need to input the bluetooth ...",
    status: 'In Progress',
    priority: 'High',
  },
]

const ROWS_PER_PAGE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '30', value: '30' },
  { label: '50', value: '50' },
]

function TaskTypeBadge({ type }: { type: TaskType }) {
  const variantMap: Record<TaskType, 'default' | 'secondary' | 'outline'> = {
    Documentation: 'outline',
    Feature: 'default',
    Bug: 'secondary',
  }

  return <Badge variant={variantMap[type]}>{type}</Badge>
}

function PriorityIndicator({ priority }: { priority: TaskPriority }) {
  const iconMap: Record<TaskPriority, React.ReactNode> = {
    Low: <ArrowDownIcon className="size-4" />,
    Medium: <ArrowRightIcon className="size-4" />,
    High: <ArrowUpIcon className="size-4" />,
  }

  return (
    <span className="flex items-center gap-2">
      {iconMap[priority]}
      {priority}
    </span>
  )
}

function StatusIndicator({ status }: { status: TaskStatus }) {
  return (
    <span className="flex items-center gap-2">
      <ClockIcon className="size-4" />
      {status}
    </span>
  )
}

function TaskRowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontalIcon />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Make a copy
        </DropdownMenuItem>
        <DropdownMenuItem>
          <StarIcon />
          Favorite
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface TaskDashboardProps {
  title?: string
  subtitle?: string
  tasks?: Task[]
  avatarSrc?: string
  avatarFallback?: string
}

export function TaskDashboard({
  title = 'Welcome back!',
  subtitle = "Here's a list of your tasks for this month.",
  tasks = SAMPLE_TASKS,
  avatarSrc = 'https://github.com/shadcn.png',
  avatarFallback = 'CN',
}: TaskDashboardProps) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [rowsPerPage, setRowsPerPage] = React.useState('10')

  const allSelected = selectedRows.size === tasks.length && tasks.length > 0
  const someSelected = selectedRows.size > 0 && selectedRows.size < tasks.length

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(tasks.map((t) => t.id)))
    }
  }

  const toggleRow = (id: string) => {
    const newSet = new Set(selectedRows)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedRows(newSet)
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <Avatar size="default">
          <AvatarImage src={avatarSrc} alt="User avatar" />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </div>

      {/* Filters + Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <FilterIcon className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
              <Input placeholder="Filter tasks..." className="w-80 pl-8" />
            </div>
            <Button variant="outline" size="sm">
              Status
            </Button>
            <Button variant="outline" size="sm">
              Priority
            </Button>
            <Button variant="ghost" size="sm">
              Reset
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              View
            </Button>
            <Button size="sm">
              <PlusIcon data-icon="inline-start" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="w-28">Task</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-28">Priority</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} data-state={selectedRows.has(task.id) ? 'selected' : undefined}>
                  <TableCell>
                    <Checkbox checked={selectedRows.has(task.id)} onCheckedChange={() => toggleRow(task.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TaskTypeBadge type={task.type} />
                      <span className="max-w-md truncate">{task.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusIndicator status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityIndicator priority={task.priority} />
                  </TableCell>
                  <TableCell>
                    <TaskRowActions />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {selectedRows.size} of {tasks.length} row(s) selected.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page</span>
              <Select
                items={ROWS_PER_PAGE_OPTIONS}
                value={rowsPerPage}
                onValueChange={(value) => value && setRowsPerPage(value)}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROWS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm">Page 1 of 2</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon-sm" disabled>
                <ChevronsLeftIcon />
                <span className="sr-only">First page</span>
              </Button>
              <Button variant="outline" size="icon-sm" disabled>
                <ChevronLeftIcon />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button variant="outline" size="icon-sm">
                <ChevronRightIcon />
                <span className="sr-only">Next page</span>
              </Button>
              <Button variant="outline" size="icon-sm">
                <ChevronsRightIcon />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
