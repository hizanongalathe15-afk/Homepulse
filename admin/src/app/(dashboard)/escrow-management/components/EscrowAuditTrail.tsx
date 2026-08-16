'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const events = [
  { time: '2026-08-05 14:22', actor: 'System', action: 'Escrow opened · $4,500.00', type: 'created' },
  { time: '2026-08-05 14:24', actor: 'John Mwangi', action: 'Deposit confirmed via M-Pesa', type: 'payment' },
  { time: '2026-08-10 09:31', actor: 'Admin - J. Kimani', action: 'Dispute linked (HP-CASE-482)', type: 'dispute' },
  { time: '2026-08-12 11:05', actor: 'System', action: 'Auto-hold triggered by open dispute', type: 'hold' },
] as const

function variant(type: string) {
  return type === 'created' ? 'info' : type === 'payment' ? 'success' : type === 'dispute' ? 'destructive' : 'warning'
}

export default function EscrowAuditTrail() {
  return (
    <SectionCard title="Audit Trail" description="Immutable event log for this escrow account">
      <div className="relative">
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
        <div className="space-y-5">
          {events.map((event) => (
            <div key={event.time + event.action} className="relative pl-6">
              <span className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white bg-primary shadow" />
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">{event.action}</p>
                <StatusBadge variant={variant(event.type)} label={event.type} />
              </div>
              <p className="text-xs text-slate-400">{event.actor} · {event.time}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}