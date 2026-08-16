'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface VerificationItem {
  document: string
  status: 'verified' | 'pending' | 'rejected'
  updatedAt: string
}

const items: VerificationItem[] = [
  { document: 'National ID', status: 'verified', updatedAt: '2026-07-10' },
  { document: 'Proof of Address', status: 'verified', updatedAt: '2026-07-12' },
  { document: 'Land Title Deed', status: 'pending', updatedAt: '2026-08-01' },
  { document: 'Police Clearance', status: 'pending', updatedAt: '2026-08-03' },
]

export default function UserVerificationStatus() {
  return (
    <SectionCard title="Verification Status" description="Document verification details">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.document} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-800">{item.document}</p>
              <p className="text-xs text-slate-400">Updated {item.updatedAt}</p>
            </div>
            <StatusBadge
              variant={item.status === 'verified' ? 'success' : item.status === 'rejected' ? 'destructive' : 'warning'}
              label={item.status}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}