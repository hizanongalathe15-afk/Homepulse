'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'

const reportTypes = ['user_activity', 'revenue', 'property_performance', 'dispute_summary', 'custom']
const formats = ['pdf', 'csv', 'excel']

export default function ReportBuilder() {
  const [type, setType] = useState(reportTypes[0])
  const [format, setFormat] = useState(formats[0])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <SectionCard title="Build a Report" description="Configure parameters and generate a report">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Report type</label>
          <select className="admin-input" value={type} onChange={(e) => setType(e.target.value)}>
            {reportTypes.map((r) => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
          <div className="flex gap-2">
            {formats.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`px-4 py-2 rounded-md border text-sm font-medium uppercase transition-colors ${
                  format === f ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="admin-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <input type="date" className="admin-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <AdminButton disabled={!dateFrom || !dateTo}>
          <FileText size={14} className="mr-1.5" /> Generate Report
        </AdminButton>
      </div>
    </SectionCard>
  )
}