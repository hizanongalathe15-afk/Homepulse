'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const schedules = [
  { id: 'SCH-1', name: 'Weekly Revenue Digest', cadence: 'Every Monday 08:00', format: 'PDF', nextRun: '2026-08-18 08:00' },
  { id: 'SCH-2', name: 'Monthly User Report', cadence: '1st of month 06:00', format: 'Excel', nextRun: '2026-09-01 06:00' },
  { id: 'SCH-3', name: 'Quarterly Dispute Summary', cadence: 'Quarterly', format: 'CSV', nextRun: '2026-10-01 08:00' },
]

export default function ReportScheduler() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    'SCH-1': true,
    'SCH-2': true,
    'SCH-3': false,
  })

  return (
    <SectionCard title="Schedules" description="Automated report generation jobs">
      <div className="space-y-3">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{schedule.name}</p>
              <p className="text-xs text-slate-400">{schedule.cadence} · {schedule.format} · next run {schedule.nextRun}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={enabled[schedule.id] ? 'success' : 'default'} label={enabled[schedule.id] ? 'Enabled' : 'Paused'} />
              <button
                type="button"
                role="switch"
                aria-checked={enabled[schedule.id]}
                onClick={() => setEnabled((prev) => ({ ...prev, [schedule.id]: !prev[schedule.id] }))}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${enabled[schedule.id] ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled[schedule.id] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}