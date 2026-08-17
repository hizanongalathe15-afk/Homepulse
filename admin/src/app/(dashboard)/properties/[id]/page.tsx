'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import PropertyDetailCard from '../components/PropertyDetailCard'
import PropertyImagesManager from '../components/PropertyImagesManager'
import PropertyVerificationModal from '../components/PropertyVerificationModal'
import PropertyFlagModal from '../components/PropertyFlagModal'
import PropertyDeleteModal from '../components/PropertyDeleteModal'
import { SectionCard } from '@/components/features/SectionCard'

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'PROP-001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Property Details"
        description={`Property ID: ${id}`}
        breadcrumbs={[{ label: 'Properties', href: '/properties' }, { label: id }]}
        actions={
          <>
            <PropertyVerificationModal />
            <PropertyFlagModal />
            <PropertyDeleteModal />
          </>
        }
      />

      <PropertyDetailCard propertyId={id} />

      <SectionCard title="Gallery" description="Manage listing photos">
        <PropertyImagesManager />
      </SectionCard>
    </div>
  )
}