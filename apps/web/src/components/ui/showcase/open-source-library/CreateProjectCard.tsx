'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../card'
import { Badge } from '../../badge'
import { Button } from '../../button'
import { Checkbox } from '../../checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../dropdown-menu'
import { MoreHorizontalIcon, PencilIcon, CopyIcon, Trash2Icon } from 'lucide-react'

type ProjectStatus = 'Success' | 'Processing' | 'Failed'

export interface Project {
  id: string
  status: ProjectStatus
  email: string
  amount: string
}

export interface CreateProjectCardProps {
  title?: string
  description?: string
  projects: Project[]
  onProjectAction?: (projectId: string, action: 'edit' | 'copy' | 'delete') => void
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const variantMap: Record<ProjectStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Success: 'default',
    Processing: 'secondary',
    Failed: 'destructive',
  }

  return <Badge variant={variantMap[status]}>{status}</Badge>
}

export function CreateProjectCard({
  title = 'Create project',
  description = 'Deploy your new project in one-click.',
  projects,
  onProjectAction,
}: CreateProjectCardProps) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

  const allSelected = selectedRows.size === projects.length && projects.length > 0
  const someSelected = selectedRows.size > 0 && selectedRows.size < projects.length

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(projects.map((p) => p.id)))
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Header</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} data-state={selectedRows.has(project.id) ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox checked={selectedRows.has(project.id)} onCheckedChange={() => toggleRow(project.id)} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{project.email}</TableCell>
                <TableCell>{project.amount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onProjectAction?.(project.id, 'edit')}>
                        <PencilIcon />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onProjectAction?.(project.id, 'copy')}>
                        <CopyIcon />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => onProjectAction?.(project.id, 'delete')}>
                        <Trash2Icon />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
