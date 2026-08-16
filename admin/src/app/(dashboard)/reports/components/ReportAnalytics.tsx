'use client'

import { FileText, Clock, CheckCircle2, Users } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Reports Generated', value: '312', trend: 'up', trendValue: '18%', icon: FileText, sub: 'this month' },
  { label: 'Scheduled Reports', value: '26', trend: 'up', trendValue: '4', icon: Clock, sub: 'active schedules' },
  { label: 'Completed', value: '294', trend: 'up', trendValue: '12%', icon: CheckCircle2, sub: 'success rate 94%' },
  { label: 'Shares', value: '1,840', trend: 'up', trendValue: '31%', icon: Users, sub: 'total shares' },
] as const

export default function ReportAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}