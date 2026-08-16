'use client'

import { QrCode, ScanLine, MousePointerClick, Clock } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'

const stats = [
  { label: 'Total QR Codes', value: '12,480', trend: 'up', trendValue: '5.2%', icon: QrCode, sub: 'all time' },
  { label: 'Scans (30d)', value: '96,240', trend: 'up', trendValue: '18.4%', icon: ScanLine, sub: 'this month' },
  { label: 'Avg. Conversion', value: '11.2%', trend: 'up', trendValue: '1.3%', icon: MousePointerClick, sub: 'scan to action' },
  { label: 'Expiring (30d)', value: '648', trend: 'down', trendValue: '2%', icon: Clock, sub: 'need renewal' },
] as const

export default function QRAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}