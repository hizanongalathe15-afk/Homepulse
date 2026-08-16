'use client'

import { CreditCard, Webhook, RefreshCcw } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { Toggle } from '@/components/features/Toggle'
import { StatusBadge } from '@/components/ui/StatusBadge'

const stats = [
  { label: 'Stripe Volume', value: '$482,100', trend: 'up', trendValue: '6.8%', icon: CreditCard, sub: '30 days' },
  { label: 'Webhooks', value: '1,204', trend: 'up', trendValue: '3%', icon: Webhook, sub: 'delivered' },
  { label: 'Failed Charges', value: '23', trend: 'down', trendValue: '8%', icon: RefreshCcw, sub: 'retryable' },
]

export default function StripeConfig() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <SectionCard title="Stripe Configuration" description="Manage Stripe API keys and webhooks.">
        <div className="space-y-4">
          <AdminInput label="Publishable Key" defaultValue="pk_test_51M..." />
          <AdminInput label="Secret Key" type="password" defaultValue="sk_test_51M..." />
          <AdminInput label="Webhook Secret" type="password" defaultValue="whsec_..." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Environment</label>
              <select className="admin-input">
                <option>Test</option>
                <option>Live</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Webhook URL</label>
              <input className="admin-input" defaultValue="https://api.homepulse.com/webhooks/stripe" readOnly />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Enable Automatic Payouts</p>
              <p className="text-xs text-slate-500">Send payouts to connected accounts daily</p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <div className="flex justify-end pt-2">
            <AdminButton type="button">Save Configuration</AdminButton>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
