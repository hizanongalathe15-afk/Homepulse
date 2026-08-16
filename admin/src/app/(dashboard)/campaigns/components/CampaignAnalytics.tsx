'use client'

import { Megaphone, MousePointerClick, Target, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Active Campaigns', value: '18', trend: 'up', trendValue: '2', icon: Megaphone, sub: 'running' },
  { label: 'Total Reach (30d)', value: '482K', trend: 'up', trendValue: '14%', icon: Target, sub: 'users reached' },
  { label: 'Avg. CTR', value: '3.8%', trend: 'up', trendValue: '0.4%', icon: MousePointerClick, sub: 'vs last month' },
  { label: 'Total Spend (30d)', value: '$84,200', trend: 'up', trendValue: '9%', icon: DollarSign, sub: 'campaign budget' },
] as const

export default function CampaignAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}