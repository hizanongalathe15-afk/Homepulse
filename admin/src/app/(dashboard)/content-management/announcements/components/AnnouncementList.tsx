'use client'

import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

interface Announcement {
  id: string
  title: string
  audience: string
  status: 'active' | 'scheduled' | 'draft' | 'expired'
  scheduledFor: string
}

const initial: Announcement[] = [
  { id: 'ANC-001', title: 'New M-Pesa payment option', audience: 'All users', status: 'active', scheduledFor: '2026-08-10' },
  { id: 'ANC-002', title: 'Scheduled maintenance on Sunday', audience: 'Landlords & agents', status: 'scheduled', scheduledFor: '2026-08-17' },
  { id: 'ANC-003', title: 'Quarterly safety report published', audience: 'All users', status: 'active', scheduledFor: '2026-08-01' },
  { id: 'ANC-004', title: 'Referral rewards increased', audience: 'Tenants', status: 'draft', scheduledFor: '2026-09-01' },
]

function statusVariant(status: Announcement['status']) {
  return status === 'active' ? 'success' : status === 'scheduled' ? 'info' : status === 'expired' ? 'default' : 'warning'
}

export default function AnnouncementList() {
  const [items] = useState(initial)

  return (
    <DataTable<Announcement>
      data={items}
      searchPlaceholder="Search announcements..."
      columns={[
        { key: 'title', header: 'Announcement', render: (a) => <span className="font-medium text-slate-900">{a.title}</span> },
        { key: 'audience', header: 'Audience', render: (a) => a.audience },
        { key: 'scheduledFor', header: 'Scheduled', render: (a) => a.scheduledFor },
        {
          key: 'status',
          header: 'Status',
          render: (a) => <StatusBadge variant={statusVariant(a.status)} label={a.status} />,
        },
        {
          key: 'actions',
          header: 'Actions',
          render: () => <AdminButton size="sm" variant="outline">Edit</AdminButton>,
        },
      ]}
    />
  )
}