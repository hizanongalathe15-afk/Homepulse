'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const initialCategories = [
  { id: 'CAT-01', name: 'Residential', properties: 12400, active: true },
  { id: 'CAT-02', name: 'Commercial', properties: 3400, active: true },
  { id: 'CAT-03', name: 'Land', properties: 3104, active: true },
]

export default function CategoryManager() {
  const [categories, setCategories] = useState(initialCategories)
  const [name, setName] = useState('')

  const addCategory = () => {
    if (name.trim() === '') return
    setCategories((prev) => [
      ...prev,
      { id: `CAT-${String(prev.length + 1).padStart(2, '0')}`, name: name.trim(), properties: 0, active: true },
    ])
    setName('')
  }

  return (
    <SectionCard title="Categories" description="Top-level property categories">
      <div className="flex items-end gap-2 mb-4">
        <AdminInput
          className="flex-1 h-9 text-sm"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCategory()}
        />
        <AdminButton size="sm" onClick={addCategory}>
          <Plus size={14} className="mr-1.5" /> Add
        </AdminButton>
      </div>

      <div className="divide-y divide-slate-100">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{category.name}</p>
              <p className="text-xs text-slate-400">{category.properties.toLocaleString()} properties</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge variant={category.active ? 'success' : 'default'} label={category.active ? 'Active' : 'Inactive'} />
              <button
                type="button"
                onClick={() => setCategories((prev) => prev.filter((c) => c.id !== category.id))}
                className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500"
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}