'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const experiment = [
  { variant: 'A - "Limited Time"', impressions: 120400, clicks: 3980, ctr: 3.3, leading: true },
  { variant: 'B - "While Stocks Last"', impressions: 120400, clicks: 3250, ctr: 2.7, leading: false },
]

export default function BannerABTesting() {
  const [running, setRunning] = useState(true)

  return (
    <SectionCard
      title="A/B Testing"
      description="Split test between two banner variations"
      action={<StatusBadge variant={running ? 'success' : 'default'} label={running ? 'Running' : 'Stopped'} />}
    >
      <div className="space-y-4">
        {experiment.map((exp) => (
          <div key={exp.variant}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-slate-800">{exp.variant}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{exp.ctr.toFixed(1)}% CTR</span>
                {exp.leading && <StatusBadge variant="info" label="Leading" />}
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(exp.ctr / 3.5) * 100}%` }} />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-slate-500">Total impressions: {experiment[0].impressions.toLocaleString()}</span>
          <div className="flex gap-2">
            <AdminButton size="sm" variant="outline" onClick={() => setRunning(false)}>Stop Test</AdminButton>
            <AdminButton size="sm" onClick={() => setRunning(true)}>{running ? 'Restart' : 'Start Test'}</AdminButton>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}