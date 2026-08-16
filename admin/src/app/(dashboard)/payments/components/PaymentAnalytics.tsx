'use client'

import { DollarSign, RefreshCcw, ArrowDownCircle, RotateCcw } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Total Revenue (30d)', value: '$694,200', trend: 'up', trendValue: '7.3%', icon: DollarSign, sub: 'all methods' },
  { label: 'Transactions (30d)', value: '8,412', trend: 'up', trendValue: '5.1%', icon: ArrowDownCircle, sub: 'completed' },
  { label: 'Failed Payments', value: '184', trend: 'down', trendValue: '12%', icon: RefreshCcw, sub: 'to resolve' },
  { label: 'Refunds (30d)', value: '$18,420', trend: 'down', trendValue: '9%', icon: RotateCcw, sub: 'processed' },
] as const

export default function PaymentAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}