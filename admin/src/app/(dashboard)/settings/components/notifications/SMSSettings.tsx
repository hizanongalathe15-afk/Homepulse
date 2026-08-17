'use client'

import { MessageSquare, Send, AlertTriangle, type LucideIcon } from 'lucide-react'
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
  { label: 'SMS Sent', value: '28,400', trend: 'up', trendValue: '4%', icon: Send, sub: '30 days' },
  { label: 'Delivery Rate', value: '97%', trend: 'up', trendValue: '1%', icon: MessageSquare, sub: 'delivered' },
  { label: 'Failed', value: '142', trend: 'down', trendValue: '6%', icon: AlertTriangle, sub: 'to retry' },
]

export default function SMSSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="SMS Settings" description="Configure SMS provider credentials and templates.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
              <select className="admin-input">
                <option>Africastalking</option>
                <option>Twilio</option>
                <option>Vonage</option>
              </select>
            </div>
            <AdminInput label="Sender ID" defaultValue="HOMEPULSE" />
          </div>
          <AdminInput label="API Key" defaultValue="App-1234567890abcdef" />
          <AdminInput label="API Secret" type="password" defaultValue="secret_..." />
          <AdminInput label="Webhook URL" defaultValue="https://api.homepulse.com/webhooks/sms" readOnly />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Enable SMS Notifications</p>
              <p className="text-xs text-slate-500">Send transactional SMS for payments and alerts</p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Save SMS Settings</AdminButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
