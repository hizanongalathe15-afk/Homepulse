'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const evidence = [
  { name: 'rent-receipt.pdf', type: 'PDF', size: '142 KB', uploadedBy: 'John Mwangi', date: '2026-07-29' },
  { name: 'mpesa-transaction.png', type: 'Image', size: '1.1 MB', uploadedBy: 'John Mwangi', date: '2026-07-30' },
  { name: 'move-out-checklist.jpg', type: 'Image', size: '890 KB', uploadedBy: 'Mary Wanjiku', date: '2026-07-31' },
  { name: 'conversation-log.txt', type: 'Text', size: '18 KB', uploadedBy: 'System', date: '2026-08-01' },
]

export default function EvidenceViewer() {
  return (
    <SectionCard title="Evidence" description="Documents and files submitted by both parties">
      <div className="space-y-2">
        {evidence.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-md border border-slate-100 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {item.type === 'PDF' ? 'PDF' : item.type === 'Image' ? 'IMG' : 'TXT'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                <p className="text-xs text-slate-400">{item.size} · uploaded by {item.uploadedBy}</p>
              </div>
            </div>
            <StatusBadge variant="info" label={item.type} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}