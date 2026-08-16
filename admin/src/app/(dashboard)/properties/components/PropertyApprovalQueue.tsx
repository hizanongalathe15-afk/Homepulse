'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const queue = [
  { id: 'PROP-006', title: 'Riverside Studio', landlord: 'Grace Muthoni', submitted: '2h ago' },
  { id: 'PROP-007', title: 'Kileleshwa 3-Bed', landlord: 'Samuel Kariuki', submitted: '5h ago' },
  { id: 'PROP-008', title: 'Naivasha Holiday Homes', landlord: 'Lucy Nduta', submitted: '1d ago' },
  { id: 'PROP-009', title: 'Embakasi Warehousing', landlord: 'Oscar Ochieng', submitted: '2d ago' },
  { id: 'PROP-010', title: 'Roysambu Duplex', landlord: 'Grace Achieng', submitted: '3d ago' },
]

export default function PropertyApprovalQueue() {
  return (
    <SectionCard
      title="Approval Queue"
      description="Properties waiting for moderation review"
      action={<StatusBadge variant="warning" label={`${queue.length} pending`} />}
    >
      <div className="divide-y divide-slate-100">
        {queue.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-400">{item.landlord} · submitted {item.submitted}</p>
            </div>
            <div className="flex items-center gap-2">
              <AdminButton size="sm" variant="outline">Review</AdminButton>
              <AdminButton size="sm" onClick={() => undefined}>Approve</AdminButton>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}