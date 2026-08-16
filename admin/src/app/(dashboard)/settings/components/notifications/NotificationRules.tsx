'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Toggle } from '@/components/features/Toggle'

interface Rule {
  id: string
  name: string
  event: string
  channel: string
  recipients: string
  active: boolean
}

const rules: Rule[] = [
  { id: '1', name: 'New Listing Alert', event: 'property.created', channel: 'Email', recipients: 'Landlords', active: true },
  { id: '2', name: 'Payment Success', event: 'payment.completed', channel: 'SMS', recipients: 'Tenants', active: true },
  { id: '3', name: 'Listing Flagged', event: 'property.flagged', channel: 'Push', recipients: 'Admins', active: true },
  { id: '4', name: 'New Message', event: 'message.received', channel: 'Email', recipients: 'Tenants', active: false },
  { id: '5', name: 'Subscription Expiring', event: 'subscription.expiring', channel: 'Email', recipients: 'Landlords', active: true },
]

export default function NotificationRules() {
  return (
    <SectionCard title="Notification Rules" description="Define when and how notifications are sent.">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <AdminInput placeholder="Search rules..." className="max-w-sm" />
          <AdminButton type="button">Create Rule</AdminButton>
        </div>
        <DataTable<Rule>
          data={rules}
          searchPlaceholder="Search rules..."
          columns={[
            { key: 'name', header: 'Rule', sortable: true, render: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
            { key: 'event', header: 'Trigger Event', render: (r) => <code className="text-xs bg-slate-100 px-2 py-1 rounded">{r.event}</code> },
            { key: 'channel', header: 'Channel', render: (r) => <StatusBadge variant={r.channel === 'Email' ? 'info' : r.channel === 'SMS' ? 'success' : 'warning'} label={r.channel} /> },
            { key: 'recipients', header: 'Recipients' },
            {
              key: 'active',
              header: 'Active',
              render: (r) => <Toggle checked={r.active} onChange={() => {}} />,
            },
            {
              key: 'actions',
              header: '',
              render: (r) => (
                <button type="button" className="text-sm text-primary hover:underline">Edit</button>
              ),
            },
          ]}
        />
      </div>
    </SectionCard>
  )
}
