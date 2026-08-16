'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface Report {
  id: string
  name: string
  format: string
  generatedBy: string
  date: string
  status: 'completed' | 'generating' | 'failed'
}

const reports: Report[] = [
  { id: 'RPT-101', name: 'August Revenue Report', format: 'PDF', generatedBy: 'Admin - J. Kimani', date: '2026-08-01', status: 'completed' },
  { id: 'RPT-102', name: 'User Activity - Q2', format: 'CSV', generatedBy: 'Scheduled', date: '2026-08-03', status: 'completed' },
  { id: 'RPT-103', name: 'Property Performance', format: 'Excel', generatedBy: 'Admin - S. Otieno', date: '2026-08-12', status: 'generating' },
]

export default function ReportExporter() {
  const [downloaded, setDownloaded] = useState<string[]>([])

  const download = (id: string) => setDownloaded((prev) => [...prev, id])

  return (
    <SectionCard title="Generated Reports" description="Download previously generated reports">
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{report.name}</p>
              <p className="text-xs text-slate-400">{report.generatedBy} · {report.date} · {report.format}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge
                variant={report.status === 'completed' ? 'success' : report.status === 'failed' ? 'destructive' : 'info'}
                label={report.status}
              />
              {report.status === 'completed' && (
                <AdminButton size="sm" variant="outline" onClick={() => download(report.id)}>
                  <Download size={14} className="mr-1" /> {downloaded.includes(report.id) ? 'Downloaded' : 'Download'}
                </AdminButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}