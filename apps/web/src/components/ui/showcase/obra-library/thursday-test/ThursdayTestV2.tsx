'use client'

/**
 * Thursday Test V2: With Annotations
 *
 * This version is implemented from Figma node 15:2648 which includes data-annotations.
 * The key annotation found was:
 * "this element should be a component Card with 3 slots, 1 slot is tabs,
 * 2nd is data table, 3rd is pagination but aligned to the right side.
 * dont change any other spacing, keep it as in this screen"
 *
 * Key observations:
 * - Same visual as V1 but with explicit guidance from designer
 * - Annotation suggests Card with 3 slots architecture
 * - Demonstrates how designers can communicate intent to AI
 */

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

/**
 * Implementation follows the annotation guidance:
 * - Slot 1: Tabs (CardHeader)
 * - Slot 2: Data Table (CardContent)
 * - Slot 3: Pagination aligned right (CardFooter)
 */
export function ThursdayTestV2() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[944px]">
      <h1 className="text-xl font-semibold">Portfolio</h1>

      <Card>
        {/* Slot 1: Tabs */}
        <CardHeader>
          <Tabs defaultValue="assets">
            <TabsList>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        {/* Slot 2: Data Table */}
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
        </CardContent>

        {/* Slot 3: Pagination aligned right (per annotation) */}
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
