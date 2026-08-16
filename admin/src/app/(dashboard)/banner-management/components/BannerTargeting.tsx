'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const audiences = [
  { id: 'SEG-001', name: 'Verified Landlords', match: 92 },
  { id: 'SEG-002', name: 'Tenants in Nairobi', match: 84 },
  { id: 'SEG-003', name: 'First-time Renters', match: 61 },
  { id: 'SEG-004', name: 'All Users', match: 100 },
]

export default function BannerTargeting() {
  const [selected, setSelected] = useState<string[]>(['SEG-001'])

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  return (
    <SectionCard title="Targeting" description="Choose which audience segments see this banner">
      <div className="space-y-2">
        {audiences.map((audience) => (
          <button
            key={audience.id}
            type="button"
            onClick={() => toggle(audience.id)}
            className={`w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors ${
              selected.includes(audience.id)
                ? 'border-primary bg-primary/5'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="font-medium text-slate-800">{audience.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{audience.match}% reach</span>
              {selected.includes(audience.id) && <StatusBadge variant="info" label="Selected" />}
            </div>
          </button>
        ))}
      </div>
    </SectionCard>
  )
}