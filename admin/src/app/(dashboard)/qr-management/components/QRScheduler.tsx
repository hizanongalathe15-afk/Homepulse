'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const jobs = [
  { id: 1, task: 'Renew 120 expired codes', cadence: 'Daily at 03:00', nextRun: '2026-08-16 03:00', status: 'active' },
  { id: 2, task: 'Email scan digest to admins', cadence: 'Weekly on Monday', nextRun: '2026-08-18 08:00', status: 'active' },
  { id: 3, task: 'Deactivate inactive codes (90d)', cadence: 'Monthly on 1st', nextRun: '2026-09-01 02:00', status: 'paused' },
]

export default function QRScheduler() {
  return (
    <SectionCard title="Scheduled Tasks" description="Automated QR maintenance jobs">
      <div className="divide-y divide-slate-100">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-start justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{job.task}</p>
              <p className="text-xs text-slate-400">{job.cadence} · next run {job.nextRun}</p>
            </div>
            <StatusBadge variant={job.status === 'active' ? 'success' : 'default'} label={job.status} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}