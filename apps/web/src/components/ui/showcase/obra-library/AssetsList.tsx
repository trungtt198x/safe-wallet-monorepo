'use client'

import * as React from 'react'
import { Card } from '../../card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../table'
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Button } from '../../button'

export interface Asset {
  id: string
  name: string
  value: string
  avatarSrc?: string
  avatarFallback?: string
}

export interface AssetsListProps {
  assets: Asset[]
}

export function AssetsList({ assets }: AssetsListProps) {
  return (
    <Card className="!ring-border/20 !shadow-none flex flex-col gap-4 p-5">
      <h2 className="text-lg font-semibold">Assets</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Label
        </Button>
        <Button variant="outline" size="sm">
          Label
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table heading</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    {asset.avatarSrc && <AvatarImage src={asset.avatarSrc} alt={asset.name} />}
                    <AvatarFallback>{asset.avatarFallback || asset.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{asset.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{asset.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
