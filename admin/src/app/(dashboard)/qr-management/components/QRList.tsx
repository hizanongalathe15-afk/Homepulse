'use client'

import type { QRCode } from '@/types/qr.types'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const codes: QRCode[] = [
  { id: 'QR-001', code: 'HP-NBO-WST-0012', propertyId: 'PROP-001', propertyTitle: 'Sunset Apartments, Westlands', type: 'property', status: 'active', scanCount: 48210, conversionRate: 11.2, createdAt: new Date('2026-01-20') },
  { id: 'QR-002', code: 'HP-MSA-0088', propertyId: 'PROP-002', propertyTitle: 'Beachside Villa, Mombasa', type: 'property', status: 'active', scanCount: 31045, conversionRate: 12.3, createdAt: new Date('2026-02-10') },
  { id: 'QR-003', code: 'HP-CMP-0042', propertyId: '', propertyTitle: 'Back-to-School Campaign', type: 'campaign', status: 'active', scanCount: 22118, conversionRate: 9.8, createdAt: new Date('2026-03-01') },
  { id: 'QR-004', code: 'HP-NBO-0412', propertyId: 'PROP-005', propertyTitle: 'Green Park Residences', type: 'property', status: 'inactive', scanCount: 14903, conversionRate: 7.6, createdAt: new Date('2026-04-15'), expiresAt: new Date('2026-07-01') },
  { id: 'QR-005', code: 'HP-NBHD-001', propertyId: '', propertyTitle: 'Westlands Neighbourhood', type: 'neighborhood', status: 'active', scanCount: 8840, conversionRate: 10.4, createdAt: new Date('2026-05-22') },
]

function statusVariant(status: QRCode['status']) {
  return status === 'active' ? 'success' : status === 'expired' ? 'default' : 'warning'
}

export default function QRList() {
  return (
    <DataTable<QRCode>
      data={codes}
      searchPlaceholder="Search by code, property or campaign..."
      columns={[
        {
          key: 'code',
          header: 'Code',
          render: (q) => <span className="font-mono text-xs text-slate-900">{q.code}</span>,
        },
        { key: 'propertyTitle', header: 'Linked To', render: (q) => q.propertyTitle || '—' },
        { key: 'type', header: 'Type', render: (q) => <span className="capitalize">{q.type}</span> },
        { key: 'scanCount', header: 'Scans', render: (q) => q.scanCount.toLocaleString() },
        { key: 'conversionRate', header: 'Conversion', render: (q) => `${q.conversionRate}%` },
        {
          key: 'status',
          header: 'Status',
          render: (q) => <StatusBadge variant={statusVariant(q.status)} label={q.status} />,
        },
        {
          key: 'actions',
          header: 'Actions',
          render: () => (
            <div className="flex gap-2">
              <AdminButton size="sm" variant="outline">Details</AdminButton>
            </div>
          ),
        },
      ]}
    />
  )
}