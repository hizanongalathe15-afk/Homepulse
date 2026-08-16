'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Dispute } from '@/types/dispute.types'
import EvidenceViewer from '../components/EvidenceViewer'
import MediationChat from '../components/MediationChat'
import EscrowActionButtons from '../components/EscrowActionButtons'
import DisputeResolutionModal from '../components/DisputeResolutionModal'

const dispute: Dispute = {
  id: 'DSP-1001', caseNumber: 'HP-CASE-482', userId: 'USR-1002', userName: 'John Mwangi',
  propertyId: 'PROP-001', propertyTitle: 'Sunset Apartments, Westlands', type: 'security_deposit',
  status: 'under_review', priority: 'high', description: 'Deposit not refunded after lease end.',
  evidence: ['receipt.pdf'], assignedTo: 'J. Kimani',
  createdAt: new Date('2026-07-28'), updatedAt: new Date('2026-08-02'),
}

export default function DisputeDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? dispute.id

  return (
    <div className="space-y-6">
      <AdminHeader
        title={dispute.caseNumber}
        description={`Dispute id: ${id}`}
        breadcrumbs={[{ label: 'Disputes', href: '/disputes' }, { label: dispute.caseNumber }]}
        actions={<DisputeResolutionModal />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SectionCard title="Case Overview">
            <div>
              <InfoRow label="Claimant" value={dispute.userName} />
              <InfoRow label="Property" value={dispute.propertyTitle} />
              <InfoRow label="Type" value={dispute.type.replace('_', ' ')} />
              <InfoRow
                label="Status"
                value={<StatusBadge variant={dispute.status === 'under_review' ? 'warning' : 'success'} label={dispute.status} />}
              />
              <InfoRow label="Assigned to" value={dispute.assignedTo ?? 'Unassigned'} />
            </div>
          </SectionCard>
          <SectionCard title="Escrow Funds">
            <EscrowActionButtons />
          </SectionCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <MediationChat />
          <EvidenceViewer />
        </div>
      </div>
    </div>
  )
}