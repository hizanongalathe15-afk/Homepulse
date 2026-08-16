'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const templates = [
  { name: 'Standard Promo', desc: 'Single image, CTA button', placements: 4 },
  { name: 'Split Banner', desc: 'Two alternating messages', placements: 2 },
  { name: 'Countdown', desc: 'Live countdown to deadline', placements: 1 },
  { name: 'Video Loop', desc: 'Autoplay muted video', placements: 3 },
]

export default function BannerTemplates() {
  return (
    <SectionCard title="Banner Templates" description="Reusable layouts for new campaigns">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((template) => (
          <div key={template.name} className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="h-24 rounded-md bg-gradient-to-br from-primary/15 to-emerald-500/15 flex items-center justify-center mb-3">
              <span className="text-xs font-semibold text-primary">{template.name}</span>
            </div>
            <p className="text-sm font-medium text-slate-800">{template.name}</p>
            <p className="text-xs text-slate-400">{template.desc}</p>
            <div className="mt-2">
              <StatusBadge variant="info" label={`${template.placements} placements`} />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}