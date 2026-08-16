'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const placements = [
  { name: 'home', label: 'Home Page', active: 3, ctr: 3.4 },
  { name: 'search', label: 'Search Results', active: 2, ctr: 3.1 },
  { name: 'property_detail', label: 'Property Detail', active: 1, ctr: 2.6 },
  { name: 'dashboard', label: 'User Dashboard', active: 4, ctr: 2.1 },
]

export default function BannerPlacementManager() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    home: true,
    search: true,
    property_detail: true,
    dashboard: false,
  })

  return (
    <SectionCard title="Placement Slots" description="Enable or disable banner slots per placement">
      <div className="space-y-3">
        {placements.map((placement) => (
          <div key={placement.name} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{placement.label}</p>
              <p className="text-xs text-slate-400">{placement.active} active · {placement.ctr}% avg CTR</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled[placement.name]}
              onClick={() => setEnabled((prev) => ({ ...prev, [placement.name]: !prev[placement.name] }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled[placement.name] ? 'bg-primary' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled[placement.name] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}