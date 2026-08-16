'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import QRPrintManager from '../components/QRPrintManager'
import QRScheduler from '../components/QRScheduler'
import QRTemplates from '../components/QRTemplates'

export default function QRDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'QR-001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="QR Code Detail"
        description={`Code record: ${id}`}
        breadcrumbs={[{ label: 'QR Management', href: '/qr-management' }, { label: id }]}
        actions={<StatusBadge variant="success" label="Active" />}
      />

      <SectionCard title="Code Information">
        <div>
          <InfoRow label="Code" value="HP-NBO-WST-0012" />
          <InfoRow label="Linked to" value="Sunset Apartments, Westlands (PROP-001)" />
          <InfoRow label="Type" value="Property" />
          <InfoRow label="Total scans" value="48,210" />
          <InfoRow label="Conversion rate" value="11.2%" />
          <InfoRow label="Created" value="2026-01-20" />
        </div>
      </SectionCard>

      <QRTemplates />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QRPrintManager />
        <QRScheduler />
      </div>
    </div>
  )
}