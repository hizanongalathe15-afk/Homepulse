'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface HistoryItem {
  id: string
  title: string
  channel: string
  segment: string
  sentAt: string
  delivered: number
  opened: number
  clicked: number
  status: 'sent' | 'partial' | 'failed'
}

const history: HistoryItem[] = [
  { id: 'NTF-001', title: 'Welcome Message', channel: 'push', segment: 'New Users (7d)', sentAt: '2026-08-14T08:00:00Z', delivered: 620, opened: 312, clicked: 45, status: 'sent' },
  { id: 'NTF-002', title: 'Rent Reminder', channel: 'email', segment: 'Tenants', sentAt: '2026-08-14T06:00:00Z', delivered: 12280, opened: 6100, clicked: 820, status: 'sent' },
  { id: 'NTF-003', title: 'Viewing Confirmation', channel: 'sms', segment: 'All Users', sentAt: '2026-08-13T14:30:00Z', delivered: 48200, opened: 0, clicked: 120, status: 'sent' },
  { id: 'NTF-004', title: 'Weekend Promo', channel: 'push', segment: 'Landlords', sentAt: '2026-08-12T09:00:00Z', delivered: 3600, opened: 1800, clicked: 290, status: 'partial' },
  { id: 'NTF-005', title: 'Maintenance Update', channel: 'in_app', segment: 'Tenants', sentAt: '2026-08-11T11:00:00Z', delivered: 11800, opened: 4200, clicked: 310, status: 'failed' },
]

function statusVariant(status: HistoryItem['status']) {
  switch (status) {
    case 'sent': return 'success'
    case 'partial': return 'warning'
    case 'failed': return 'destructive'
  }
}

export default function NotificationHistory() {
  const [search, setSearch] = useState('')

  return (
    <SectionCard
      title="History"
      description="Delivery performance for past notifications."
      action={
        <AdminButton variant="outline" size="sm">Export CSV</AdminButton>
      }
    >
      <DataTable<HistoryItem>
        data={history}
        searchPlaceholder="Search notifications..."
        onRowClick={(h) => console.log('History clicked', h.id)}
        columns={[
          { key: 'title', header: 'Notification', render: (h) => <span className="font-medium text-slate-900">{h.title}</span> },
          { key: 'channel', header: 'Channel', render: (h) => <span className="capitalize">{h.channel.replace('_', ' ')}</span> },
          { key: 'segment', header: 'Segment' },
          {
            key: 'sentAt',
            header: 'Sent At',
            render: (h) => new Date(h.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          },
          { key: 'delivered', header: 'Delivered', render: (h) => h.delivered.toLocaleString() },
          { key: 'opened', header: 'Opened', render: (h) => h.opened.toLocaleString() },
          { key: 'clicked', header: 'Clicked', render: (h) => h.clicked.toLocaleString() },
          {
            key: 'status',
            header: 'Status',
            render: (h) => <StatusBadge variant={statusVariant(h.status)} label={h.status} />,
          },
        ]}
      />
    </SectionCard>
  )
}
