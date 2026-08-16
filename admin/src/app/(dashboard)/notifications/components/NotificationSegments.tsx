'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface Segment {
  id: string
  name: string
  description: string
  memberCount: number
  filters: string[]
  lastUpdated: string
  status: 'active' | 'inactive'
}

const segments: Segment[] = [
  { id: 'SEG-001', name: 'All Users', description: 'Every registered user on the platform', memberCount: 48200, filters: [], lastUpdated: '2026-08-14', status: 'active' },
  { id: 'SEG-002', name: 'Tenants', description: 'Users currently renting properties', memberCount: 12400, filters: ['role=tenant'], lastUpdated: '2026-08-13', status: 'active' },
  { id: 'SEG-003', name: 'Landlords', description: 'Verified property owners', memberCount: 3800, filters: ['role=landlord'], lastUpdated: '2026-08-10', status: 'active' },
  { id: 'SEG-004', name: 'New Users (7d)', description: 'Signed up in the last 7 days', memberCount: 620, filters: ['createdAt >= -7d'], lastUpdated: '2026-08-14', status: 'active' },
  { id: 'SEG-005', name: 'High Value', description: 'Users with transactions > $500', memberCount: 150, filters: ['ltv > 500'], lastUpdated: '2026-08-01', status: 'inactive' },
]

function statusVariant(status: Segment['status']) {
  return status === 'active' ? 'success' : 'default'
}

export default function NotificationSegments() {
  const [search, setSearch] = useState('')

  return (
    <SectionCard
      title="Segments"
      description="Target user groups for notification campaigns."
      action={
        <AdminButton variant="outline" size="sm">New Segment</AdminButton>
      }
    >
      <DataTable<Segment>
        data={segments}
        searchPlaceholder="Search segments..."
        onRowClick={(s) => console.log('Segment clicked', s.id)}
        columns={[
          { key: 'name', header: 'Name', render: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
          { key: 'description', header: 'Description', render: (s) => <span className="text-slate-500">{s.description}</span> },
          { key: 'memberCount', header: 'Members', render: (s) => s.memberCount.toLocaleString() },
          { key: 'filters', header: 'Filters', render: (s) => s.filters.length > 0 ? s.filters.join(', ') : 'None' },
          {
            key: 'status',
            header: 'Status',
            render: (s) => <StatusBadge variant={statusVariant(s.status)} label={s.status} />,
          },
          {
            key: 'lastUpdated',
            header: 'Updated',
            render: (s) => new Date(s.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          },
        ]}
      />
    </SectionCard>
  )
}
