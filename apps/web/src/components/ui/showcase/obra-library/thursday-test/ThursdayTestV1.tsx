'use client'

/**
 * Thursday Test V1: Less Componentized
 *
 * This version is implemented from Figma node 15:2185 which had minimal componentization.
 * The Figma output was verbose with lots of inline styles. This implementation
 * manually converts to shadcn/ui components while preserving the visual design.
 *
 * Key observations:
 * - 8 asset rows in the original design
 * - Manual table cells with inline styling in Figma
 * - Code Connect detected: Avatar, Tabs, Table, Pagination
 */

import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const assets = [
  { id: '1', name: 'Safe Token', symbol: 'SAFE', amount: '3.18K', price: '123$', value: '$ 445' },
  { id: '2', name: 'Origin Ether', symbol: 'OETH', amount: '0.0185', price: '123$', value: '$ 445' },
  { id: '3', name: 'Wrapped Ether', symbol: 'WETH', amount: '0.01305', price: '123$', value: '$ 445' },
  { id: '4', name: 'Wrapped Ether', symbol: 'WETH', amount: '0.01305', price: '123$', value: '$ 445' },
  { id: '5', name: 'Wrapped Ether', symbol: 'WETH', amount: '0.01305', price: '123$', value: '$ 445' },
  { id: '6', name: 'Wrapped Ether', symbol: 'WETH', amount: '0.01305', price: '123$', value: '$ 445' },
  { id: '7', name: 'Wrapped Ether', symbol: 'WETH', amount: '0.01305', price: '123$', value: '$ 445' },
  { id: '8', name: 'Table cell', symbol: '', amount: 'Table cell', price: 'Ether', value: '123$' },
]

export function ThursdayTestV1() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[944px]">
      <h1 className="text-xl font-semibold">Portfolio</h1>

      <Card>
        <CardHeader>
          <Tabs defaultValue="assets">
            <TabsList>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
            </TabsList>
            <TabsContent value="assets">
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
                            <span className="text-sm">{asset.name}</span>
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
            </TabsContent>
            <TabsContent value="positions">
              <div className="p-4 text-muted-foreground">Positions content</div>
            </TabsContent>
            <TabsContent value="nfts">
              <div className="p-4 text-muted-foreground">NFTs content</div>
            </TabsContent>
          </Tabs>
        </CardHeader>

        <CardFooter className="justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  )
}
