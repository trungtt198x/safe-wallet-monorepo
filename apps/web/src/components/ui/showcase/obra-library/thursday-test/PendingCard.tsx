'use client'

/**
 * PendingCard: Displays pending transactions
 *
 * From Figma node 10:1791 - Card with 2 slots containing:
 * - Header with title and View all button
 * - List of pending transactions with avatar, title, date, and signature count badge
 */

import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export interface PendingTransaction {
  id: string
  title: string
  date: string
  signatureCount: string
  avatarFallback?: string
}

export interface PendingCardProps {
  transactions?: PendingTransaction[]
}

const defaultTransactions: PendingTransaction[] = [
  { id: '1', title: 'Send 5 ETH', date: 'Jan 21', signatureCount: '1/3' },
  { id: '2', title: 'Send 5 ETH', date: 'Jan 21', signatureCount: '1/3' },
  { id: '3', title: 'Send 5 ETH', date: 'Jan 21', signatureCount: '1/3' },
  { id: '4', title: 'Send 5 ETH', date: 'Jan 21', signatureCount: '1/3' },
]

export function PendingCard({ transactions = defaultTransactions }: PendingCardProps) {
  return (
    <Card className="w-[280px] shrink-0">
      <CardHeader>
        <CardTitle>Pending</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{tx.avatarFallback || 'CN'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{tx.title}</span>
                <span className="text-xs text-muted-foreground">{tx.date}</span>
              </div>
              <Badge variant="secondary">{tx.signatureCount}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
