'use client'

import { MessageSquare, Star, Reply, Clock } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Total Reviews', value: '12.4K', trend: 'up', trendValue: '8.2%', icon: MessageSquare, sub: 'all time' },
  { label: 'Avg Rating', value: '4.2', trend: 'up', trendValue: '0.3', icon: Star, sub: 'out of 5' },
  { label: 'Response Rate', value: '76%', trend: 'up', trendValue: '5.1%', icon: Reply, sub: 'last 30d' },
  { label: 'Pending', value: '89', trend: 'down', trendValue: '12', icon: Clock, sub: 'awaiting reply' },
] as const

export default function FeedbackAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
