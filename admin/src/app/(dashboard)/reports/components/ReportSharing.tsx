'use client'

import { useState } from 'react'
import { Users, Share2, Link2 } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

const shares = [
  { id: 'SHR-1', recipient: 'Finance Team', method: 'Email', createdAt: '2026-08-01' },
  { id: 'SHR-2', recipient: 'Ops Admins', method: 'Slack', createdAt: '2026-08-05' },
  { id: 'SHR-3', recipient: 'Board Members', method: 'Link', createdAt: '2026-08-10' },
]

export default function ReportSharing() {
  const [copied, setCopied] = useState(false)

  return (
    <SectionCard title="Sharing" description="Access and share generated reports">
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-md border border-slate-100 p-3">
          <Link2 size={16} className="text-slate-400 shrink-0" />
          <span className="text-sm font-mono text-slate-700 flex-1 truncate">homepulse.example/share/rpt-101</span>
          <AdminButton size="sm" variant="outline" onClick={() => setCopied(true)}>
            {copied ? 'Copied' : 'Copy Link'}
          </AdminButton>
        </div>

        <div className="divide-y divide-slate-100">
          {shares.map((share) => (
            <div key={share.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <Share2 size={14} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-800">{share.recipient}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant="info" label={share.method} />
                <span className="text-xs text-slate-400">{share.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}