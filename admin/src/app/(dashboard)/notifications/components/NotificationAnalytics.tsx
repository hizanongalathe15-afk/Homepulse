'use client'

import { Send, CheckCircle2, Eye, MousePointerClick } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Sent (30d)', value: '248.5K', trend: 'up', trendValue: '12%', icon: Send, sub: 'all channels' },
  { label: 'Delivery Rate', value: '98.2%', trend: 'up', trendValue: '0.4%', icon: CheckCircle2, sub: 'delivered' },
  { label: 'Open Rate', value: '42.1%', trend: 'down', trendValue: '2.1%', icon: Eye, sub: 'unique opens' },
  { label: 'Click Rate', value: '8.7%', trend: 'up', trendValue: '1.3%', icon: MousePointerClick, sub: 'unique clicks' },
] as const

export default function NotificationAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
