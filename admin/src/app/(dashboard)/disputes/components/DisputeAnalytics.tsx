'use client'

import { AlertTriangle, Hourglass, Scale, CheckCircle2 } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Open Disputes', value: '63', trend: 'up', trendValue: '8', icon: AlertTriangle, sub: 'awaiting action' },
  { label: 'Under Review', value: '24', trend: 'neutral', trendValue: '3', icon: Scale, sub: 'being investigated' },
  { label: 'In Mediation', value: '12', trend: 'down', trendValue: '4', icon: Hourglass, sub: 'mediator assigned' },
  { label: 'Resolved (30d)', value: '187', trend: 'up', trendValue: '15%', icon: CheckCircle2, sub: 'closed cases' },
] as const

export default function DisputeAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}