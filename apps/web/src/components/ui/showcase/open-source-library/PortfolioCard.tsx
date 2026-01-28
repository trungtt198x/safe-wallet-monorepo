'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../card'
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Button } from '../../button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../table'
import { ChevronRightIcon } from 'lucide-react'

export interface Asset {
  id: string
  name: string
  symbol: string
  avatarSrc?: string
  price: string
  amount: string
}

export interface Position {
  id: string
  name: string
  symbol: string
  avatarSrc?: string
  price: string
  amount: string
}

export interface PortfolioCardProps {
  assets: Asset[]
  positions: Position[]
  onViewAll?: () => void
}

function AssetTable({ items }: { items: Asset[] | Position[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  {item.avatarSrc && <AvatarImage src={item.avatarSrc} alt={item.name} />}
                  <AvatarFallback>{item.symbol.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground text-xs">{item.symbol}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell className="text-right">{item.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function PortfolioCard({ assets, positions, onViewAll }: PortfolioCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Portfolio</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View all
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assets">
          <TabsList>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
          </TabsList>
          <TabsContent value="assets" className="mt-4">
            <AssetTable items={assets} />
          </TabsContent>
          <TabsContent value="positions" className="mt-4">
            <AssetTable items={positions} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
