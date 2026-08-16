'use client'

import { useState } from 'react'
import { PlayCircle, Plus, Trash2 } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { StatusBadge } from '@/components/ui/StatusBadge'

const initialTutorials = [
  { id: 1, title: 'How to list your property', category: 'Landlords', duration: '4:32', status: 'published' },
  { id: 2, title: 'Paying rent with M-Pesa', category: 'Tenants', duration: '2:18', status: 'published' },
  { id: 3, title: 'Understanding safety scores', category: 'Safety', duration: '3:05', status: 'draft' },
]

export default function TutorialList() {
  const [tutorials, setTutorials] = useState(initialTutorials)
  const [filter, setFilter] = useState('')

  const filtered = tutorials.filter((t) => t.title.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="admin-card">
      <div className="admin-card-header flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Tutorials</h3>
        <AdminInput className="max-w-[240px] h-9" placeholder="Search tutorials" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      <div className="admin-card-body space-y-3">
        {filtered.map((tutorial) => (
          <div key={tutorial.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
            <div className="flex items-center gap-3">
              <PlayCircle size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-slate-800">{tutorial.title}</p>
                <p className="text-xs text-slate-400">{tutorial.category} · {tutorial.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge variant={tutorial.status === 'published' ? 'success' : 'warning'} label={tutorial.status} />
              <button
                type="button"
                onClick={() => setTutorials((prev) => prev.filter((t) => t.id !== tutorial.id))}
                className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500"
                aria-label="Delete tutorial"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}