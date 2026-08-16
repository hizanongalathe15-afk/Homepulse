'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const templates = [
  { id: 'TPL-1', name: 'Monthly Revenue', desc: 'Revenue by city, method and channel', type: 'revenue' },
  { id: 'TPL-2', name: 'User Activity Summary', desc: 'Active users, retention and growth', type: 'user_activity' },
  { id: 'TPL-3', name: 'Property Performance', desc: 'Occupancy, pricing and approval queue', type: 'property_performance' },
  { id: 'TPL-4', name: 'Dispute Summary', desc: 'Open cases, resolution times and outcomes', type: 'dispute_summary' },
]

export default function ReportTemplates() {
  const [selected, setSelected] = useState(0)

  return (
    <SectionCard title="Templates" description="Pre-configured report definitions">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((template, index) => (
          <button
            key={template.name}
            type="button"
            onClick={() => setSelected(index)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              selected === index ? 'border-primary ring-1 ring-primary' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-slate-800">{template.name}</p>
              <StatusBadge variant="info" label={template.type} />
            </div>
            <p className="text-xs text-slate-400">{template.desc}</p>
          </button>
        ))}
      </div>
    </SectionCard>
  )
}