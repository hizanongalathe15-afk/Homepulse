'use client'

import { useState } from 'react'

export function useAdminExport() {
  const [exporting, setExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'excel'>('csv')

  const exportData = useCallback(async (endpoint: string, filters?: Record<string, unknown>) => {
    setExporting(true)
    try {
      const response = await fetch(`/api/export/${exportFormat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ endpoint, filters }),
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${Date.now()}.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } finally {
      setExporting(false)
    }
  }, [exportFormat])

  return {
    exporting,
    exportFormat,
    setExportFormat,
    exportData,
  }
}
