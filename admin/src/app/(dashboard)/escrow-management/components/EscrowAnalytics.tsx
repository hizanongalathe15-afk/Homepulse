'use client'

import { Wallet, Lock, Landmark, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Active Escrows', value: '1,284', trend: 'up', trendValue: '4%', icon: Wallet, sub: 'funds in holding' },
  { label: 'Held Balance', value: '$342,800', trend: 'up', trendValue: '6.2%', icon: Lock, sub: 'locked funds' },
  { label: 'Released (30d)', value: '418', trend: 'up', trendValue: '11%', icon: Landmark, sub: 'transactions' },
  { label: 'Disputes Linked', value: '37', trend: 'down', trendValue: '8%', icon: TrendingUp, sub: 'escrows in dispute' },
] as const

export default function EscrowAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}