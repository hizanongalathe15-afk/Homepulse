'use client'

import type { Banner } from '@/types/banner.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const banners: Banner[] = [
  { id: 'BNR-001', title: 'Welcome Home: August Promo', imageUrl: '', targetUrl: '/promo/august', placement: 'home', status: 'active', startDate: new Date('2026-08-01'), impressions: 482100, clicks: 14200, ctr: 2.9, createdAt: new Date('2026-07-25') },
  { id: 'BNR-002', title: 'First Month Free', imageUrl: '', targetUrl: '/properties', placement: 'search', status: 'active', startDate: new Date('2026-08-05'), impressions: 221045, clicks: 6900, ctr: 3.1, createdAt: new Date('2026-08-01') },
  { id: 'BNR-003', title: 'Landlord Webinar', imageUrl: '', targetUrl: '/events/webinar', placement: 'dashboard', status: 'paused', startDate: new Date('2026-07-10'), endDate: new Date('2026-07-20'), impressions: 98400, clicks: 2100, ctr: 2.1, createdAt: new Date('2026-07-05') },
  { id: 'BNR-004', title: 'Verified Badge Offer', imageUrl: '', targetUrl: '/verification', placement: 'property_detail', status: 'draft', startDate: new Date('2026-09-01'), impressions: 0, clicks: 0, ctr: 0, createdAt: new Date('2026-08-10') },
]

function statusVariant(status: Banner['status']) {
  return status === 'active' ? 'success' : status === 'paused' ? 'warning' : status === 'expired' ? 'default' : 'info'
}

export default function BannerList() {
  return (
    <DataTable<Banner>
      data={banners}
      searchPlaceholder="Search banners by title or placement..."
      columns={[
        { key: 'title', header: 'Banner', render: (b) => <span className="font-medium text-slate-900">{b.title}</span> },
        { key: 'placement', header: 'Placement', render: (b) => <span className="capitalize">{b.placement.replace('_', ' ')}</span> },
        { key: 'impressions', header: 'Impressions', render: (b) => b.impressions.toLocaleString() },
        { key: 'clicks', header: 'Clicks', render: (b) => b.clicks.toLocaleString() },
        { key: 'ctr', header: 'CTR', render: (b) => `${b.ctr.toFixed(1)}%` },
        {
          key: 'status',
          header: 'Status',
          render: (b) => <StatusBadge variant={statusVariant(b.status)} label={b.status} />,
        },
        {
          key: 'actions',
          header: 'Actions',
          render: () => (
            <div className="flex gap-2">
              <AdminButton size="sm" variant="outline">Edit</AdminButton>
            </div>
          ),
        },
      ]}
    />
  )
}