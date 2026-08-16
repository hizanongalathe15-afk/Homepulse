'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const disputes = [
  { id: 'DSP-1001', caseNumber: 'HP-CASE-482', escrow: 'ESC-1003', amount: 2800, status: 'open' },
  { id: 'DSP-1002', caseNumber: 'HP-CASE-203', escrow: 'ESC-1005', amount: 1200, status: 'open' },
  { id: 'DSP-1003', caseNumber: 'HP-CASE-204', escrow: 'ESC-1006', amount: 6400, status: 'under_review' },
]

export default function EscrowDisputes() {
  return (
    <SectionCard title="Escrows in Dispute" description="Held funds linked to active disputes">
      <div className="space-y-3">
        {disputes.map((dispute) => (
          <div key={dispute.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{dispute.caseNumber}</p>
              <p className="text-xs text-slate-400">{dispute.escrow} · ${dispute.amount.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={dispute.status === 'open' ? 'destructive' : 'warning'} label={dispute.status} />
              <AdminButton size="sm" variant="outline">Open Case</AdminButton>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}