'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const resolutions = [
  { id: 'RES-001', campaign: 'First-Renter Discount', issue: 'Prohibited incentive offered', status: 'open', date: '2026-08-12' },
  { id: 'RES-002', campaign: 'Corporate Relocation', issue: 'Misleading claims in ad copy', status: 'resolved', date: '2026-07-28' },
]

export default function CampaignResolution() {
  const [statuses, setStatuses] = useState<Record<string, string>>({
    'RES-001': 'open',
    'RES-002': 'resolved',
  })

  const resolve = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'resolved' }))
  }

  return (
    <SectionCard title="Compliance Queue" description="Campaigns flagged for review and their resolutions">
      <div className="space-y-3">
        {resolutions.map((res) => (
          <div key={res.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{res.campaign}</p>
              <p className="text-xs text-slate-400">{res.issue} · {res.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={statuses[res.id] === 'open' ? 'destructive' : 'success'} label={statuses[res.id]} />
              {statuses[res.id] === 'open' && (
                <AdminButton size="sm" onClick={() => resolve(res.id)}>
                  Resolve
                </AdminButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}