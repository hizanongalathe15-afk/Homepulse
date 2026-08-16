'use client'

import { ShieldCheck, FileText, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Pending Reviews', value: '48', trend: 'up', trendValue: '6', icon: Clock, sub: 'in queue' },
  { label: 'Approved (30d)', value: '1,240', trend: 'up', trendValue: '14%', icon: CheckCircle2, sub: 'verifications' },
  { label: 'Rejected (30d)', value: '96', trend: 'down', trendValue: '9%', icon: XCircle, sub: 'failed checks' },
  { label: 'Avg. Review Time', value: '4.2h', trend: 'down', trendValue: '0.8h', icon: FileText, sub: 'per applicant' },
] as const

export default function VerificationStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}