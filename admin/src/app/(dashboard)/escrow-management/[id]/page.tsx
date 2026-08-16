'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import EscrowManualOverride from '../components/EscrowManualOverride'
import EscrowAuditTrail from '../components/EscrowAuditTrail'

export default function EscrowDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'ESC-1001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Escrow Detail"
        description={`Escrow account: ${id}`}
        breadcrumbs={[{ label: 'Escrow Management', href: '/escrow-management' }, { label: id }]}
        actions={<StatusBadge variant="warning" label="Funds held" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Escrow Information">
            <div>
              <InfoRow label="Reference" value={id} />
              <InfoRow label="Property" value="Sunset Apartments, Westlands" />
              <InfoRow label="Tenant" value="John Mwangi" />
              <InfoRow label="Landlord" value="Mary Wanjiku" />
              <InfoRow label="Amount" value="$4,500.00" />
              <InfoRow label="Held since" value="2026-08-05" />
            </div>
          </SectionCard>
          <EscrowAuditTrail />
        </div>
        <div>
          <EscrowManualOverride />
        </div>
      </div>
    </div>
  )
}