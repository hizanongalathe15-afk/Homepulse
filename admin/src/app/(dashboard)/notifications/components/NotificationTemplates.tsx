'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface Template {
  id: string
  name: string
  category: string
  channel: 'push' | 'email' | 'sms' | 'in_app'
  lastUsed: string
  usageCount: number
  status: 'active' | 'draft' | 'archived'
}

const templates: Template[] = [
  { id: 'TMP-001', name: 'Welcome Message', category: 'Onboarding', channel: 'push', lastUsed: '2026-08-10', usageCount: 14200, status: 'active' },
  { id: 'TMP-002', name: 'Rent Reminder', category: 'Payments', channel: 'email', lastUsed: '2026-08-14', usageCount: 8930, status: 'active' },
  { id: 'TMP-003', name: 'Viewing Confirmation', category: 'Bookings', channel: 'sms', lastUsed: '2026-08-12', usageCount: 3450, status: 'active' },
  { id: 'TMP-004', name: 'Maintenance Update', category: 'Support', channel: 'in_app', lastUsed: '2026-08-08', usageCount: 1200, status: 'draft' },
  { id: 'TMP-005', name: 'Lease Renewal', category: 'Legal', channel: 'email', lastUsed: '2026-07-29', usageCount: 560, status: 'archived' },
]

function channelVariant(channel: Template['channel']) {
  switch (channel) {
    case 'push': return 'info'
    case 'email': return 'default'
    case 'sms': return 'warning'
    case 'in_app': return 'success'
  }
}

function statusVariant(status: Template['status']) {
  switch (status) {
    case 'active': return 'success'
    case 'draft': return 'warning'
    case 'archived': return 'default'
  }
}

export default function NotificationTemplates() {
  const [search, setSearch] = useState('')

  return (
    <SectionCard
      title="Templates"
      description="Reusable notification templates across channels."
      action={
        <AdminButton variant="outline" size="sm">New Template</AdminButton>
      }
    >
      <DataTable<Template>
        data={templates}
        searchPlaceholder="Search templates..."
        onRowClick={(t) => console.log('Template clicked', t.id)}
        columns={[
          { key: 'name', header: 'Name', render: (t) => <span className="font-medium text-slate-900">{t.name}</span> },
          { key: 'category', header: 'Category' },
          {
            key: 'channel',
            header: 'Channel',
            render: (t) => <StatusBadge variant={channelVariant(t.channel)} label={t.channel.replace('_', ' ')} />,
          },
          { key: 'usageCount', header: 'Usage', render: (t) => t.usageCount.toLocaleString() },
          {
            key: 'status',
            header: 'Status',
            render: (t) => <StatusBadge variant={statusVariant(t.status)} label={t.status} />,
          },
          {
            key: 'lastUsed',
            header: 'Last Used',
            render: (t) => new Date(t.lastUsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          },
        ]}
      />
    </SectionCard>
  )
}
