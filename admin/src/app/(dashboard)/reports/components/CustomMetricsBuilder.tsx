'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'

interface Metric {
  id: string
  label: string
  type: 'sum' | 'average' | 'count' | 'max' | 'min'
}

const initialMetrics: Metric[] = [
  { id: 'M1', label: 'Total revenue', type: 'sum' },
  { id: 'M2', label: 'Average rent', type: 'average' },
  { id: 'M3', label: 'Dispute count', type: 'count' },
]

export default function CustomMetricsBuilder() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [label, setLabel] = useState('')
  const [type, setType] = useState<Metric['type']>('sum')

  const add = () => {
    if (label.trim() === '') return
    setMetrics((prev) => [...prev, { id: `M${prev.length + 1}`, label: label.trim(), type }])
    setLabel('')
  }

  return (
    <SectionCard title="Custom Metrics" description="Define custom metrics for report templates">
      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <input
            className="admin-input flex-1 h-9 text-sm"
            placeholder="Metric label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <select className="admin-input h-9 w-auto text-sm" value={type} onChange={(e) => setType(e.target.value as Metric['type'])}>
            {(['sum', 'average', 'count', 'max', 'min'] as const).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <AdminButton size="sm" onClick={add}>
            <Plus size={14} />
          </AdminButton>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
          {metrics.map((metric) => (
            <div key={metric.id} className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="font-medium text-slate-800">{metric.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase">{metric.type}</span>
                <button
                  type="button"
                  onClick={() => setMetrics((prev) => prev.filter((m) => m.id !== metric.id))}
                  className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500"
                  aria-label="Remove metric"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}