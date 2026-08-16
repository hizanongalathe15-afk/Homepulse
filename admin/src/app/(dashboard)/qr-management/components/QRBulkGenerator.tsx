'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const rows = [
  { property: 'PROP-006 — Riverside Studio', prefix: 'HP-NBO', count: 1 },
  { property: 'PROP-007 — Kileleshwa 3-Bed', prefix: 'HP-NBO', count: 3 },
  { property: 'PROP-008 — Naivasha Holiday Homes', prefix: 'HP-NAV', count: 5 },
]

export default function QRBulkGenerator() {
  const [file, setFile] = useState<string | null>(null)

  return (
    <SectionCard title="Bulk Generator" description="Generate many QR codes from an uploaded list or manual entries">
      {/* CSV upload */}
      <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors mb-4">
        <Upload size={20} className="text-slate-400 mb-2" />
        {file ? (
          <span className="text-sm font-medium text-primary">{file}</span>
        ) : (
          <>
            <span className="text-sm text-slate-500">Upload a CSV of properties</span>
            <span className="text-xs text-slate-400 mt-0.5">Columns: identifier, prefix, quantity</span>
          </>
        )}
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
        />
      </label>

      <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg mb-4">
        {rows.map((row) => (
          <div key={row.property} className="flex items-center justify-between px-3 py-2.5 text-sm">
            <span className="font-medium text-slate-800">{row.property}</span>
            <span className="text-slate-500">{row.count} codes</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge variant="info" label={`${rows.reduce((n, r) => n + r.count, 0)} codes ready`} />
        <AdminButton disabled={!file}>
          <Upload size={14} className="mr-1.5" /> Generate Batch
        </AdminButton>
      </div>
    </SectionCard>
  )
}