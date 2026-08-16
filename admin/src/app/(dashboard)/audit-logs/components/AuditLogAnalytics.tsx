'use client'

import { FileText, AlertTriangle, UserCheck, ShieldAlert } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Total Events (30d)', value: '84.2K', trend: 'up', trendValue: '14%', icon: FileText, sub: 'all actions' },
  { label: 'Critical Events', value: '23', trend: 'down', trendValue: '5', icon: AlertTriangle, sub: 'requires review' },
  { label: 'Unique Actors', value: '1,204', trend: 'up', trendValue: '3%', icon: UserCheck, sub: 'active admins' },
  { label: 'Failed Auth', value: '142', trend: 'down', trendValue: '18%', icon: ShieldAlert, sub: 'blocked attempts' },
] as const

export default function AuditLogAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
