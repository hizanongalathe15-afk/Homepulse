'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const escrows = [
  { id: 'ESC-1001', property: 'Sunset Apartments, Westlands', tenant: 'John Mwangi', amount: 4500, status: 'active' },
  { id: 'ESC-1002', property: 'Beachside Villa, Mombasa', tenant: 'Diana Njeri', amount: 12000, status: 'active' },
  { id: 'ESC-1003', property: 'Lakeview Flats, Kisumu', tenant: 'David Kimani', amount: 2800, status: 'dispute' },
  { id: 'ESC-1004', property: 'Hillcrest House, Nakuru', tenant: 'Robert Kip', amount: 8500, status: 'released' },
]

function statusVariant(status: string) {
  return status === 'active' ? 'info' : status === 'dispute' ? 'destructive' : 'success'
}

export default function EscrowOverview() {
  return (
    <SectionCard title="Active Escrows" description="Recently held or released escrow accounts">
      <div className="divide-y divide-slate-100">
        {escrows.map((escrow) => (
          <div key={escrow.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{escrow.property}</p>
              <p className="text-xs text-slate-400">{escrow.tenant} · {escrow.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-900">${escrow.amount.toLocaleString()}</span>
              <StatusBadge variant={statusVariant(escrow.status)} label={escrow.status} />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}