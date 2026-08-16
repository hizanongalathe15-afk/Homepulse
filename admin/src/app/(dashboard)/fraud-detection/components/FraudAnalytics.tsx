'use client'

import { ShieldAlert, ShieldCheck, Ban, FileSearch } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Active Alerts', value: '17', trend: 'up', trendValue: '4', icon: ShieldAlert, sub: 'new today' },
  { label: 'Resolved Cases', value: '89', trend: 'up', trendValue: '12%', icon: ShieldCheck, sub: 'last 30 days' },
  { label: 'Banned Users', value: '6', trend: 'neutral', trendValue: '2', icon: Ban, sub: 'pending appeal' },
  { label: 'Under Review', value: '24', trend: 'down', trendValue: '8', icon: FileSearch, sub: 'awaiting action' },
] as const

export default function FraudAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
