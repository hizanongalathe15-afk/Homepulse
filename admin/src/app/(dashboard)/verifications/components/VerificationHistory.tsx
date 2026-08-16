'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const history = [
  { date: '2026-07-10', action: 'Identity verified', performedBy: 'System (auto)', result: 'approved' },
  { date: '2026-07-12', action: 'Address document verified', performedBy: 'Admin - J. Mwangi', result: 'approved' },
  { date: '2026-08-01', action: 'Land title deed submitted', performedBy: 'Applicant', result: 'pending' },
  { date: '2026-08-03', action: 'Police clearance submitted', performedBy: 'Applicant', result: 'pending' },
] as const

export default function VerificationHistory() {
  return (
    <SectionCard title="Verification History" description="Timeline of verification events">
      <div className="relative">
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
        <div className="space-y-5">
          {history.map((item) => (
            <div key={item.date + item.action} className="relative pl-6">
              <span
                className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white ${
                  item.result === 'approved' ? 'bg-green-500' : item.result === 'pending' ? 'bg-amber-400' : 'bg-red-500'
                }`}
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">{item.action}</p>
                <StatusBadge
                  variant={item.result === 'approved' ? 'success' : item.result === 'pending' ? 'warning' : 'destructive'}
                  label={item.result}
                />
              </div>
              <p className="text-xs text-slate-400">{item.performedBy} · {item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}