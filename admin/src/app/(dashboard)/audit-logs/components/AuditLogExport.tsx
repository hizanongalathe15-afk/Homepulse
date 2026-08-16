'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'
import { Download } from 'lucide-react'

export default function AuditLogExport() {
  const [format, setFormat] = useState('csv')
  const [open, setOpen] = useState(false)

  return (
    <>
      <AdminButton variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Download size={16} className="mr-2" />
        Export
      </AdminButton>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Export Audit Logs</h3>
              <p className="mt-1 text-sm text-slate-500">Choose format and download.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                <select className="admin-input w-full" value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <AdminButton variant="secondary" onClick={() => setOpen(false)}>Cancel</AdminButton>
              <AdminButton onClick={() => setOpen(false)}>Download</AdminButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
