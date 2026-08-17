'use client'

import { ArrowRight } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const schedule = [
  { title: 'August Promo', start: '2026-08-01', end: '2026-08-31', status: 'active' },
  { title: 'Back-to-School', start: '2026-08-15', end: '2026-09-15', status: 'scheduled' },
  { title: 'Landlord Webinar', start: '2026-07-10', end: '2026-07-20', status: 'ended' },
]

export default function BannerScheduler() {
  return (
    <SectionCard title="Schedule" description="Timeline of banner start and end dates">
      <div className="space-y-3">
        {schedule.map((item) => (
          <div key={item.title} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">{item.start} <ArrowRight size={12} /> {item.end}</p>
            </div>
            <StatusBadge
              variant={item.status === 'active' ? 'success' : item.status === 'scheduled' ? 'warning' : 'default'}
              label={item.status}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}