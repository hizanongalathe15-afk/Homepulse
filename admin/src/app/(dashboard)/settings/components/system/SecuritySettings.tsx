'use client'

import { Shield, Lock, KeyRound, Ban, type LucideIcon } from 'lucide-react'
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
  { label: 'Failed Logins', value: '128', trend: 'down', trendValue: '5%', icon: Shield, sub: 'last 24h' },
  { label: 'Active Sessions', value: '1,024', trend: 'up', trendValue: '8%', icon: Lock, sub: 'across app' },
  { label: '2FA Adoption', value: '87%', trend: 'up', trendValue: '2%', icon: KeyRound, sub: 'enrolled users' },
  { label: 'Blocked IPs', value: '42', trend: 'neutral', trendValue: '3', icon: Ban, sub: 'active rules' },
]

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="Security Policies" description="Configure authentication and access controls.">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Require 2FA for all admin accounts</p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Password Policy</p>
              <p className="text-xs text-slate-500">Enforce strong passwords (min 12 chars)</p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput label="Session Timeout (minutes)" type="number" defaultValue="60" />
            <AdminInput label="Max Login Attempts" type="number" defaultValue="5" />
          </div>
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Update Security</AdminButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
