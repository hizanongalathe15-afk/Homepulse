'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'

const initialCategories = [
  { name: 'Getting Started', tutorials: 3 },
  { name: 'Landlords', tutorials: 4 },
  { name: 'Tenants', tutorials: 5 },
  { name: 'Safety', tutorials: 2 },
]

export default function TutorialCategories() {
  const [categories, setCategories] = useState(initialCategories)
  const [name, setName] = useState('')

  const add = () => {
    if (name.trim() === '') return
    setCategories((prev) => [...prev, { name: name.trim(), tutorials: 0 }])
    setName('')
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="text-lg font-semibold text-slate-900">Categories</h3>
      </div>
      <div className="admin-card-body space-y-4">
        <div className="flex items-center gap-2">
          <AdminInput placeholder="New category" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          <AdminButton size="sm" onClick={add}>
            Add
          </AdminButton>
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm">
              <span className="font-medium text-slate-800">{category.name}</span>
              <span className="text-xs text-slate-400">{category.tutorials} tutorials</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}