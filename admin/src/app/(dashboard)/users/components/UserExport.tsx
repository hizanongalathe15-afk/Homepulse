'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'

export default function UserExport() {
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null)

  const handleExport = (format: 'csv' | 'pdf') => {
    setExporting(format)
    // In a production setup this would call /api/export/{format} with the current filters.
    setTimeout(() => setExporting(null), 800)
  }

  return (
    <div className="flex items-center gap-2">
      <AdminButton
        variant="outline"
        size="sm"
        disabled={exporting !== null}
        onClick={() => handleExport('csv')}
      >
        <Download size={14} className="mr-1.5" />
        {exporting === 'csv' ? 'Exporting...' : 'CSV'}
      </AdminButton>
      <AdminButton
        variant="outline"
        size="sm"
        disabled={exporting !== null}
        onClick={() => handleExport('pdf')}
      >
        <Download size={14} className="mr-1.5" />
        {exporting === 'pdf' ? 'Exporting...' : 'PDF'}
      </AdminButton>
    </div>
  )
}