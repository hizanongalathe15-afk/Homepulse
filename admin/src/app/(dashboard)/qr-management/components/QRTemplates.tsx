'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const templates = [
  { name: 'Classic', desc: 'Black on white, minimal', uses: 8420, popular: true },
  { name: 'Branded Primary', desc: 'Brand blue with logo footer', uses: 2104, popular: false },
  { name: 'Dark Mode', desc: 'White on slate-900', uses: 1180, popular: false },
  { name: 'Rounded', desc: 'Soft corners and color accents', uses: 756, popular: false },
]

export default function QRTemplates() {
  const [selected, setSelected] = useState(0)

  return (
    <SectionCard title="Design Templates" description="Visual styles for generated QR codes">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {templates.map((template, index) => (
          <button
            key={template.name}
            type="button"
            onClick={() => setSelected(index)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              selected === index ? 'border-primary ring-1 ring-primary' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="h-16 w-16 mx-auto rounded-md bg-gradient-to-br from-slate-900 to-slate-700 relative mb-2">
              <div className="absolute inset-3 rounded-sm bg-white/90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <QrIcon className="w-5 h-5 text-slate-900" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-800">{template.name}</p>
            <p className="text-[10px] text-slate-400">{template.uses.toLocaleString()} uses</p>
            {template.popular && <StatusBadge variant="info" label="Popular" />}
          </button>
        ))}
      </div>
    </SectionCard>
  )
}

function QrIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
      <rect x="14" y="18" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </svg>
  )
}