'use client'

import { SquareDashed } from 'lucide-react'
import { Card } from '../../card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../table'
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../tabs'

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
    <Card className="flex flex-col gap-2 p-4">
      <h2 className="text-lg font-semibold px-2">Assets</h2>
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">
            <SquareDashed className="size-5" />
            Label
          </TabsTrigger>
          <TabsTrigger value="tab2">
            <SquareDashed className="size-5" />
            Label
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
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
        </TabsContent>
        <TabsContent value="tab2">
          <div className="p-4 text-muted-foreground text-sm">Tab 2 content</div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
