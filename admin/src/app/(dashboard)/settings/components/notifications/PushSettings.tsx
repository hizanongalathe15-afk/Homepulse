'use client'

import { Bell, Smartphone, MessageSquare, type LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface StatItem {
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  icon: LucideIcon
  sub: string
}

const stats: StatItem[] = [
  { label: 'Push Sent', value: '42,100', trend: 'up', trendValue: '8%', icon: Smartphone, sub: '30 days' },
  { label: 'Open Rate', value: '38%', trend: 'up', trendValue: '2%', icon: Bell, sub: 'push opens' },
  { label: 'Opt-outs', value: '1.8%', trend: 'down', trendValue: '0.4%', icon: MessageSquare, sub: 'disabled' },
]

export default function PushSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="Push Notification Settings" description="Configure Firebase Cloud Messaging and push topics.">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Push Notifications</p>
              <p className="text-xs text-slate-500">Send browser and mobile push notifications</p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <AdminInput label="Firebase Server Key" defaultValue="AAA..." />
          <AdminInput label="Firebase Sender ID" defaultValue="123456789" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Default Topic</label>
              <select className="admin-input">
                <option>global</option>
                <option>tenants</option>
                <option>landlords</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Icon URL</label>
              <input className="admin-input" defaultValue="https://cdn.homepulse.com/icon.png" readOnly />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Save Push Settings</AdminButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
