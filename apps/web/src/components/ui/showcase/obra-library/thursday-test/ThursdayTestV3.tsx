'use client'

/**
 * Thursday Test V3: Most Componentized
 *
 * This version is implemented from Figma node 1:3203 which was the most componentized.
 * The Figma design used a Card component with explicit slots:
 * - headerSlot="15:1295"
 * - mainSlot="10:2700"
 * - footerSlot="5:1610"
 *
 * Key observations:
 * - Figma output was ~3.5x smaller than V1/V2 (~200 vs ~750 lines)
 * - Code Connect automatically detected Card with slots
 * - Only 4 asset rows shown (cleaner, less redundant data)
 * - Structure maps directly to CardHeader/CardContent/CardFooter
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

// V3 only has 4 rows - cleaner representation
const assets = [
  { id: '1', name: 'Safe Token', symbol: 'SAFE', amount: '3.18K', price: '123$', value: '$ 445' },
  { id: '2', name: 'Origin Ether', symbol: 'OETH', amount: '0.0185', price: '123$', value: '$ 445' },
  { id: '3', name: 'Wrapped Ether', symbol: 'WETH', amount: '0.01305', price: '123$', value: '$ 445' },
  { id: '4', name: 'Table cell', symbol: '', amount: 'Table cell', price: 'Ether', value: '123$' },
]

/**
 * Cleanest implementation - directly maps to Figma's slot-based Card structure.
 * The componentized Figma design produced cleaner, more maintainable code.
 */
export function ThursdayTestV3() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[944px]">
      <h1 className="text-xl font-semibold">Portfolio</h1>

      <Card>
        {/* headerSlot - Tabs */}
        <CardHeader>
          <Tabs defaultValue="assets">
            <TabsList>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        {/* mainSlot - Data Table */}
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

        {/* footerSlot - Pagination */}
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
