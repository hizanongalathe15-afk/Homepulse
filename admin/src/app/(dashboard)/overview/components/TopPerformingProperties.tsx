'use client'

import { TrendingUp } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

const properties = [
  { id: 'PROP-001', title: 'Sunset Apartments, Westlands', city: 'Nairobi', revenue: 45000, views: 3420, status: 'approved' as const },
  { id: 'PROP-002', title: 'Beachside Villa, Mombasa', city: 'Mombasa', revenue: 120000, views: 2810, status: 'approved' as const },
  { id: 'PROP-003', title: 'Hillcrest House, Nakuru', city: 'Nakuru', revenue: 85000, views: 1950, status: 'pending' as const },
  { id: 'PROP-004', title: 'Lakeview Flats, Kisumu', city: 'Kisumu', revenue: 28000, views: 1540, status: 'approved' as const },
  { id: 'PROP-005', title: 'Green Park Residences', city: 'Nairobi', revenue: 200000, views: 4200, status: 'flagged' as const },
]

function statusVariant(status: string) {
  switch (status) {
    case 'approved': return 'success'
    case 'pending': return 'warning'
    case 'flagged': return 'destructive'
    default: return 'default'
  }
}

export default function TopPerformingProperties() {
  return (
    <SectionCard title="Top Performing Properties" description="Ranked by revenue and views this month">
      <DataTable
        data={properties}
        searchPlaceholder="Search properties..."
        columns={[
          {
            key: 'title',
            header: 'Property',
            render: (p) => (
              <div>
                <p className="font-medium text-slate-900">{p.title}</p>
                <p className="text-xs text-slate-500">{p.city}</p>
              </div>
            ),
          },
          { key: 'views', header: 'Views', render: (p) => p.views.toLocaleString() },
          { key: 'revenue', header: 'Revenue', render: (p) => `$${p.revenue.toLocaleString()}` },
          {
            key: 'status',
            header: 'Status',
            render: (p) => <StatusBadge variant={statusVariant(p.status)} label={p.status} />,
          },
        ]}
      />
    </SectionCard>
  )
}
