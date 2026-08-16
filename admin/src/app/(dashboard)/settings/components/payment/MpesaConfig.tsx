'use client'

import { Phone, Webhook, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'

const stats = [
  { label: 'M-Pesa Volume', value: '$128,400', trend: 'up', trendValue: '4.2%', icon: DollarSign, sub: '30 days' },
  { label: 'STK Pushes', value: '3,402', trend: 'up', trendValue: '2%', icon: Phone, sub: 'sent' },
  { label: 'Failed Pushes', value: '89', trend: 'down', trendValue: '15%', icon: Webhook, sub: 'retryable' },
]

export default function MpesaConfig() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="M-Pesa Configuration" description="Manage Daraja API credentials and callbacks.">
        <div className="space-y-4">
          <AdminInput label="Consumer Key" defaultValue="wZ1xY2z..." />
          <AdminInput label="Consumer Secret" type="password" defaultValue="aB3cD4..." />
          <AdminInput label="Passkey" type="password" defaultValue="bfb279f9aa9b..." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Environment</label>
              <select className="admin-input">
                <option>Sandbox</option>
                <option>Production</option>
              </select>
            </div>
            <AdminInput label="Shortcode" defaultValue="174379" />
          </div>
          <AdminInput label="Callback URL" defaultValue="https://api.homepulse.com/webhooks/mpesa" readOnly />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Enable B2C Payouts</p>
              <p className="text-xs text-slate-500">Allow direct payouts to landlords</p>
            </div>
            <Toggle checked={false} onChange={() => {}} />
          </div>
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Save Configuration</AdminButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
