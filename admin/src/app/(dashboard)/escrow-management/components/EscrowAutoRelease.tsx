'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const rules = [
  { id: 1, name: 'Auto-release 7 days after move-in confirmation', enabled: true, threshold: '7 days' },
  { id: 2, name: 'Auto-refund on mutual cancellation', enabled: true, threshold: 'Immediate' },
  { id: 3, name: 'Freeze release when dispute is open', enabled: true, threshold: 'On dispute' },
  { id: 4, name: 'Release upon lease expiry without claims', enabled: false, threshold: 'On expiry' },
]

export default function EscrowAutoRelease() {
  const [enabled, setEnabled] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: false,
  })

  return (
    <SectionCard title="Auto-Release Rules" description="Automated conditions that release or hold escrow funds">
      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{rule.name}</p>
              <p className="text-xs text-slate-400">Triggers: {rule.threshold}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled[rule.id]}
              onClick={() => setEnabled((prev) => ({ ...prev, [rule.id]: !prev[rule.id] }))}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${enabled[rule.id] ? 'bg-primary' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled[rule.id] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}