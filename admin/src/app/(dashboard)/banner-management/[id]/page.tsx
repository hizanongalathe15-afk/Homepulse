'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import BannerTargeting from '../components/BannerTargeting'

export default function BannerDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'BNR-001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Banner Detail"
        description={`Banner record: ${id}`}
        breadcrumbs={[{ label: 'Banner Management', href: '/banner-management' }, { label: id }]}
        actions={<StatusBadge variant="success" label="Active" />}
      />

      <SectionCard title="Banner Information">
        <div>
          <InfoRow label="Title" value="Welcome Home: August Promo" />
          <InfoRow label="Placement" value="Home Page" />
          <InfoRow label="Target URL" value="/promo/august" />
          <InfoRow label="Impressions" value="482,100" />
          <InfoRow label="CTR" value="2.9%" />
          <InfoRow label="Run dates" value="2026-08-01 → 2026-08-31" />
        </div>
      </SectionCard>

      <BannerTargeting />
    </div>
  )
}