'use client'

import { useState } from 'react'
import { Trash2, Play, Save } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'

const segmentIds = ['SEG-001', 'SEG-002', 'SEG-003']

export default function SegmentActions() {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const isAllSelected = selected.length === segmentIds.length

  const toggleAll = () => {
    setSelected(isAllSelected ? [] : segmentIds)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <AdminButton variant="outline" size="sm" onClick={toggleAll}>
        {isAllSelected ? 'Deselect all' : 'Select all'}
      </AdminButton>
      <AdminButton
        variant="outline"
        size="sm"
        disabled={selected.length === 0}
        onClick={() => setSelected([])}
      >
        <Play size={14} className="mr-1.5" /> Run ({selected.length})
      </AdminButton>
      <AdminButton
        variant="destructive"
        size="sm"
        disabled={selected.length === 0}
        onClick={() => setSelected([])}
      >
        <Trash2 size={14} className="mr-1.5" /> Delete
      </AdminButton>
      <AdminButton variant="default" size="sm" onClick={() => setSelected([])}>
        <Save size={14} className="mr-1.5" /> Save Changes
      </AdminButton>
    </div>
  )
}