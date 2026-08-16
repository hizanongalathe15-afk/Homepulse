'use client'

import { useState } from 'react'
import { Printer } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'
import { StatusBadge } from '@/components/ui/StatusBadge'

const sizes = ['4×6 sticker', 'A4 sheet (8 per page)', 'Business card']

const queue = [
  { code: 'HP-NBO-0012', copies: 50, size: '4×6 sticker' },
  { code: 'HP-MSA-0088', copies: 100, size: 'A4 sheet (8 per page)' },
  { code: 'HP-NBHD-001', copies: 20, size: 'Business card' },
]

export default function QRPrintManager() {
  const [size, setSize] = useState(sizes[0])
  const [printed, setPrinted] = useState(false)

  return (
    <SectionCard title="Print Manager" description="Prepare QR codes for offline distribution">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Print size</label>
          <select className="admin-input" value={size} onChange={(e) => setSize(e.target.value)}>
            {sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
          {queue.map((item) => (
            <div key={item.code} className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="font-mono text-xs font-medium text-slate-800">{item.code}</span>
              <span className="text-slate-500">{item.copies} copies · {item.size}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge variant={printed ? 'success' : 'info'} label={printed ? 'Sent to printer' : `${queue.reduce((n, q) => n + q.copies, 0)} labels`} />
          <AdminButton onClick={() => setPrinted(true)}>
            <Printer size={14} className="mr-1.5" /> Print Labels
          </AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}