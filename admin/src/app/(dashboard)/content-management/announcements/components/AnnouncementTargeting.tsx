'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const segments = [
  { id: 'SEG-001', label: 'Verified Landlords', match: 92 },
  { id: 'SEG-002', label: 'Tenants in Nairobi', match: 61 },
  { id: 'SEG-003', label: 'Active Agents', match: 44 },
]

export default function AnnouncementTargeting() {
  const [selected, setSelected] = useState<string[]>(['SEG-001'])

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  return (
    <SectionCard title="Targeting" description="Refine who receives this announcement">
      <div className="space-y-2">
        {segments.map((segment) => (
          <button
            key={segment.id}
            type="button"
            onClick={() => toggle(segment.id)}
            className={`w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors ${
              selected.includes(segment.id) ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="font-medium text-slate-800">{segment.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{segment.match}% reach</span>
              {selected.includes(segment.id) && <StatusBadge variant="info" label="Selected" />}
            </div>
          </button>
        ))}
      </div>
    </SectionCard>
  )
}