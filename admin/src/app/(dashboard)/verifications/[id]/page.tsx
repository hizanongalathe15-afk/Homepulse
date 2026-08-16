'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { AdminButton } from '@/components/ui/AdminButton'
import IdentityVerification from '../components/IdentityVerification'
import DocumentVerification from '../components/DocumentVerification'
import BackgroundCheck from '../components/BackgroundCheck'
import VerificationHistory from '../components/VerificationHistory'

export default function VerificationDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'VRF-1001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Verification Review"
        description={`Request ${id} — identity & background screening`}
        breadcrumbs={[{ label: 'Verifications', href: '/verifications' }, { label: id }]}
        actions={
          <>
            <AdminButton variant="outline">Reject</AdminButton>
            <AdminButton>Approve</AdminButton>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IdentityVerification />
        <BackgroundCheck />
        <DocumentVerification />
        <VerificationHistory />
      </div>
    </div>
  )
}