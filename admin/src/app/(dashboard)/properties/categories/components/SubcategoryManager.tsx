'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

const initialSubcategories = [
  { id: 'SUB-01', name: 'Studio', parent: 'Residential' },
  { id: 'SUB-02', name: '1-Bedroom', parent: 'Residential' },
  { id: 'SUB-03', name: '2-Bedroom', parent: 'Residential' },
  { id: 'SUB-04', name: 'Office Space', parent: 'Commercial' },
  { id: 'SUB-05', name: 'Retail Shop', parent: 'Commercial' },
  { id: 'SUB-06', name: 'Agricultural', parent: 'Land' },
]

export default function SubcategoryManager() {
  const [subcategories, setSubcategories] = useState(initialSubcategories)
  const [name, setName] = useState('')
  const [parent, setParent] = useState('Residential')

  const addSubcategory = () => {
    if (name.trim() === '') return
    setSubcategories((prev) => [
      ...prev,
      { id: `SUB-${String(prev.length + 1).padStart(2, '0')}`, name: name.trim(), parent },
    ])
    setName('')
  }

  return (
    <SectionCard title="Subcategories" description="Nested property types under categories">
      <div className="flex items-end gap-2 mb-4">
        <AdminInput
          className="flex-1 h-9 text-sm"
          placeholder="New subcategory name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSubcategory()}
        />
        <select className="admin-input h-9 w-auto text-sm" value={parent} onChange={(e) => setParent(e.target.value)}>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Land</option>
          <option>Industrial</option>
        </select>
        <AdminButton size="sm" onClick={addSubcategory}>
          <Plus size={14} className="mr-1.5" /> Add
        </AdminButton>
      </div>

      <div className="divide-y divide-slate-100">
        {subcategories.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-800">{sub.name}</p>
              <p className="text-xs text-slate-400">{sub.parent}</p>
            </div>
            <button
              type="button"
              onClick={() => setSubcategories((prev) => prev.filter((s) => s.id !== sub.id))}
              className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500"
              aria-label={`Delete ${sub.name}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
