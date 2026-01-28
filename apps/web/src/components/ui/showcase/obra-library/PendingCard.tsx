'use client'

import * as React from 'react'
import { Card } from '../../card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../table'
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Button } from '../../button'

export interface PendingItem {
  id: string
  name: string
  value: string
  avatarSrc?: string
  avatarFallback?: string
}

export interface PendingCardProps {
  items: PendingItem[]
  filters?: string[]
  activeFilter?: string
  onFilterChange?: (filter: string) => void
}

export function PendingCard({ items, filters = ['Label', 'Label'], activeFilter, onFilterChange }: PendingCardProps) {
  return (
    <Card className="!ring-border/20 !shadow-none flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Pending</h2>
        <div className="flex items-center gap-2">
          {filters.map((filter, index) => {
            const isActive = activeFilter === filter || (activeFilter === undefined && index === 0)
            return (
              <Button
                key={index}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange?.(filter)}
              >
                {filter}
              </Button>
            )
          })}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table heading</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar size="sm">
                      {item.avatarSrc && <AvatarImage src={item.avatarSrc} alt={item.name} />}
                      <AvatarFallback>{item.avatarFallback || item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
