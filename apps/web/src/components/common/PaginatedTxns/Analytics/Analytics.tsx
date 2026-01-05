import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, Box, Typography, Stack } from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { RechartsDevtools } from '@recharts/devtools'
import { format } from 'date-fns'
import type useTxQueue from '@/hooks/useTxQueue'
import type useTxHistory from '@/hooks/useTxHistory'
import { isDateLabel } from '@/utils/transaction-guards'
import type { TransactionItemPage, QueuedItemPage } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { TransactionInfoType } from '@safe-global/store/gateway/types'

type TxResults = TransactionItemPage['results'][number] | QueuedItemPage['results'][number]

interface LinePoint {
  date: string
  transactions: number
}

interface CategorySlice {
  name: string
  value: number
  [key: string]: string | number
}

interface AnalyticsProps {
  pages: string[]
  useTxns: typeof useTxHistory | typeof useTxQueue
}

const TX_INFO_LABELS: Partial<Record<TransactionInfoType | string, string>> = {
  [TransactionInfoType.TRANSFER]: 'Transfers',
  [TransactionInfoType.SETTINGS_CHANGE]: 'Settings',
  [TransactionInfoType.CUSTOM]: 'Custom',
  [TransactionInfoType.CREATION]: 'Creation',
  [TransactionInfoType.SWAP_TRANSFER]: 'Swap Transfer',
  [TransactionInfoType.SWAP_ORDER]: 'Swap Order',
  [TransactionInfoType.TWAP_ORDER]: 'Twap Order',
  [TransactionInfoType.VAULT_DEPOSIT]: 'Vault Deposit',
  [TransactionInfoType.VAULT_REDEEM]: 'Vault Redeem',
  [TransactionInfoType.NATIVE_STAKING_DEPOSIT]: 'Staking Deposit',
  [TransactionInfoType.NATIVE_STAKING_WITHDRAW]: 'Staking Withdraw',
  [TransactionInfoType.NATIVE_STAKING_VALIDATORS_EXIT]: 'Staking Exit',
}

const PIE_COLORS = ['#6C5DD3', '#7AE7C7', '#FFB266', '#FF6B6B', '#4D96FF', '#FFC857', '#2EC4B6', '#F08080']

const getDateKey = (item: TxResults): string | null => {
  // Prefer transaction timestamp when available
  const timestamp =
    'transaction' in item && item.transaction?.timestamp
      ? item.transaction.timestamp
      : 'timestamp' in item
        ? item.timestamp
        : undefined

  if (!timestamp) return null
  const parsed = new Date(timestamp)
  if (Number.isNaN(parsed.getTime())) return null
  return format(parsed, 'dd-MM-yyyy')
}

const getCategory = (item: TxResults): string | null => {
  if (!('transaction' in item)) return null
  const type = item.transaction?.txInfo?.type
  if (!type) return null
  return TX_INFO_LABELS[type] ?? type
}

const PagesData = ({
  setPagesData,
  setCategoriesData,
  pageUrl,
  useTxns,
}: {
  setPagesData: React.Dispatch<React.SetStateAction<Map<string, LinePoint>>>
  setCategoriesData: React.Dispatch<React.SetStateAction<Map<string, number>>>
  pageUrl: string
  useTxns: typeof useTxHistory | typeof useTxQueue
}) => {
  const { page } = useTxns(pageUrl)

  useEffect(() => {
    if (!page) {
      return
    }

    const results = page.results as TxResults[]

    setPagesData((prev) => {
      const next = new Map(prev)
      results.forEach((result) => {
        if (isDateLabel(result)) return

        const dateKey = getDateKey(result)
        if (!dateKey) return

        const current = next.get(dateKey) ?? { date: dateKey, transactions: 0 }
        next.set(dateKey, { ...current, transactions: current.transactions + 1 })
      })
      return next
    })

    setCategoriesData((prev) => {
      const next = new Map(prev)
      results.forEach((result) => {
        if (isDateLabel(result)) return
        const category = getCategory(result)
        if (!category) return
        next.set(category, (next.get(category) ?? 0) + 1)
      })
      return next
    })
  }, [page, setCategoriesData, setPagesData])

  return null
}

const TransactionsLineChart = ({ data }: { data: LinePoint[] }) => {
  if (!data.length) {
    return (
      <Card>
        <CardHeader title="Transactions" subheader="Transactions per day" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No transactions to display yet.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title="Transactions" subheader="Transactions per day" />
      <CardContent sx={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 12,
              left: 4,
              bottom: 4,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis width={40} tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="transactions"
              activeDot={{ r: 4 }}
              dot={false}
              strokeWidth={2}
              stroke="#4D96FF"
            />
            <RechartsDevtools />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

const TransactionsPieChart = ({ data }: { data: CategorySlice[] }) => {
  if (!data.length) {
    return (
      <Card>
        <CardHeader title="Categories" subheader="Transactions by type" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No transaction categories to display yet.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title="Categories" subheader="Transactions by type" />
      <CardContent sx={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="80%"
              cx="50%"
              cy="50%"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip contentStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

const Analytics = ({ pages, useTxns }: AnalyticsProps) => {
  const [pagesData, setPagesData] = useState<Map<string, LinePoint>>(new Map())
  const [categoriesData, setCategoriesData] = useState<Map<string, number>>(new Map())

  const sortedLineData = useMemo(() => {
    // Attempt to parse dd-MM-yyyy as "day-month-year"
    // Use Date.UTC to guarantee correct sorting regardless of locale
    const parseDateKey = (key: string): number => {
      const [day, month, year] = key.split('-').map(Number)
      // Guard for invalid keys, fallback to epoch
      if (!day || !month || !year) return 0
      return Date.UTC(year, month - 1, day)
    }

    return Array.from(pagesData.values()).sort((a, b) => parseDateKey(a.date) - parseDateKey(b.date))
  }, [pagesData])

  const pieData = useMemo(() => {
    return Array.from(categoriesData.entries()).map(([name, value]) => ({ name, value }))
  }, [categoriesData])

  return (
    <Box mb={3}>
      <Typography variant="h6" paragraph>
        Statistics from {sortedLineData[0]?.date} to {sortedLineData[sortedLineData.length - 1]?.date}
      </Typography>

      {pages.map((pageUrl) => (
        <PagesData
          key={pageUrl}
          setPagesData={setPagesData}
          setCategoriesData={setCategoriesData}
          pageUrl={pageUrl}
          useTxns={useTxns}
        />
      ))}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box width="50%">
          <TransactionsLineChart data={sortedLineData} />
        </Box>
        <Box width="50%">
          <TransactionsPieChart data={pieData} />
        </Box>
      </Stack>
    </Box>
  )
}

export default Analytics
