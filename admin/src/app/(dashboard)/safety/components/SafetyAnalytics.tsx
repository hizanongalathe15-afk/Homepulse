'use client'

import { ShieldAlert, FileText, Phone, ShieldCheck } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Active SOS Alerts', value: '7', trend: 'up', trendValue: '3', icon: ShieldAlert, sub: 'last 24 hours' },
  { label: 'Incidents Today', value: '12', trend: 'down', trendValue: '5', icon: FileText, sub: 'vs yesterday' },
  { label: 'Avg Safety Score', value: '8.4', trend: 'up', trendValue: '0.3', icon: ShieldCheck, sub: 'out of 10' },
  { label: 'Emergency Contacts', value: '24', trend: 'neutral', trendValue: '0', icon: Phone, sub: 'verified' },
] as const

export default function SafetyAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
