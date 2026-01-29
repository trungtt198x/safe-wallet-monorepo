'use client'

/**
 * AssetsCard: Displays asset list in a card
 *
 * From Figma node 5:1624 - Card with 2 slots containing:
 * - Header with title and View all button
 * - Asset table with avatar, name, amount, price, value
 */

import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export interface Asset {
  id: string
  name: string
  symbol: string
  amount: string
  price: string
  value: string
}

export interface AssetsCardProps {
  assets?: Asset[]
}

const defaultAssets: Asset[] = [
  { id: '1', name: 'Safe Token', symbol: 'SAFE', amount: '3.18K', price: '123$', value: '$445' },
  { id: '2', name: 'Origin Ether', symbol: 'OETH', amount: '0.0185', price: '123$', value: '$445' },
  { id: '3', name: 'Wrapped Ether', symbol: 'WETH', amount: '0.01305', price: '123$', value: '$445' },
  { id: '4', name: 'Ether', symbol: 'ETH', amount: '0.00533', price: '123$', value: '$445' },
]

export function AssetsCard({ assets = defaultAssets }: AssetsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{asset.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {asset.amount} {asset.symbol}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{asset.price}</TableCell>
                <TableCell className="text-right">{asset.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
