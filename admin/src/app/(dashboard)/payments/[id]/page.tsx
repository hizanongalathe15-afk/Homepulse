'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import PaymentRefundModal from '../components/PaymentRefundModal'
import PaymentDisputeModal from '../components/PaymentDisputeModal'

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'PAY-10001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Payment Detail"
        description={`Transaction: ${id}`}
        breadcrumbs={[{ label: 'Payments', href: '/payments' }, { label: id }]}
        actions={
          <>
            <PaymentDisputeModal />
            <PaymentRefundModal />
          </>
        }
      />

      <SectionCard
        title="Transaction Information"
        action={<StatusBadge variant="success" label="Completed" />}
      >
        <div>
          <InfoRow label="Reference" value="REF-MP-8842" />
          <InfoRow label="User" value="John Mwangi (USR-1002)" />
          <InfoRow label="Property" value="Sunset Apartments, Westlands" />
          <InfoRow label="Amount" value="$4,500.00" />
          <InfoRow label="Method" value="M-Pesa (Paybill 203090)" />
          <InfoRow label="Paid at" value="2026-08-14 10:24" />
        </div>
      </SectionCard>
    </div>
  )
}