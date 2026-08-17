'use client'

import { Building2, Mail, Clock, Globe, type LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'

interface StatItem {
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  icon: LucideIcon
  sub: string
}

const stats: StatItem[] = [
  { label: 'Active Listings', value: '12,458', trend: 'up', trendValue: '3.2%', icon: Building2, sub: 'this month' },
  { label: 'Support Inbox', value: '34', trend: 'down', trendValue: '12%', icon: Mail, sub: 'unread' },
  { label: 'Avg Response', value: '2.4h', trend: 'neutral', trendValue: '0.1h', icon: Clock, sub: 'last 7 days' },
  { label: 'Active Regions', value: '8', trend: 'up', trendValue: '1', icon: Globe, sub: 'countries' },
]

export default function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="General Configuration" description="Basic platform settings and branding.">
        <div className="space-y-4">
          <AdminInput label="Site Name" defaultValue="Homepulse" />
          <AdminInput label="Support Email" type="email" defaultValue="support@homepulse.com" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput label="Timezone" defaultValue="Africa/Nairobi" />
            <AdminInput label="Date Format" defaultValue="MM/DD/YYYY" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-medium text-slate-900">Registration Open</p>
              <p className="text-xs text-slate-500">Allow new users to sign up</p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Save Changes</AdminButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
