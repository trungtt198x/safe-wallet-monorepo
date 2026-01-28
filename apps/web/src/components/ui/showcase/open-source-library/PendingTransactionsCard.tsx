'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../card'
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Badge } from '../../badge'
import { Button } from '../../button'
import { ChevronRightIcon } from 'lucide-react'

export interface Transaction {
  id: string
  title: string
  date: string
  avatarSrc?: string
  avatarFallback: string
  confirmations: {
    current: number
    required: number
  }
}

export interface PendingTransactionsCardProps {
  transactions: Transaction[]
  onViewAll?: () => void
}

export function PendingTransactionsCard({ transactions, onViewAll }: PendingTransactionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">Pending transactions</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View all
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center gap-3">
            <Avatar size="sm">
              {tx.avatarSrc && <AvatarImage src={tx.avatarSrc} alt={tx.title} />}
              <AvatarFallback>{tx.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{tx.title}</span>
              <span className="text-muted-foreground text-xs">{tx.date}</span>
            </div>
            <Badge variant="outline">
              {tx.confirmations.current}/{tx.confirmations.required}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
