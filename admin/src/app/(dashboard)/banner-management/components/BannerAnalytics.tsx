'use client'

import { Image, Eye, MousePointerClick, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Active Banners', value: '24', trend: 'up', trendValue: '3', icon: Image, sub: 'currently live' },
  { label: 'Impressions (30d)', value: '2.4M', trend: 'up', trendValue: '12%', icon: Eye, sub: 'served views' },
  { label: 'Average CTR', value: '2.9%', trend: 'up', trendValue: '0.3%', icon: MousePointerClick, sub: 'click-through' },
  { label: 'Top Placement', value: 'Home', trend: 'neutral', trendValue: '3.4% CTR', icon: TrendingUp, sub: 'home page' },
] as const

export default function BannerAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}