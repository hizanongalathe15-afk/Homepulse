'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import CampaignFlagModal from '../components/CampaignFlagModal'
import CampaignResolutionModal from '../components/CampaignResolutionModal'

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'CAM-001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Campaign Detail"
        description={`Campaign: ${id}`}
        breadcrumbs={[{ label: 'Campaigns', href: '/campaigns' }, { label: id }]}
        actions={
          <>
            <CampaignFlagModal />
            <CampaignResolutionModal />
          </>
        }
      />

      <SectionCard
        title="Campaign Information"
        action={<StatusBadge variant="success" label="Active" />}
      >
        <div>
          <InfoRow label="Campaign" value="Back-to-School Housing" />
          <InfoRow label="Channel" value="Social Media" />
          <InfoRow label="Budget" value="$12,000" />
          <InfoRow label="Spent" value="$8,900 (74%)" />
          <InfoRow label="Reach" value="184,200 users" />
          <InfoRow label="Run dates" value="2026-08-01 → 2026-08-31" />
        </div>
      </SectionCard>
    </div>
  )
}