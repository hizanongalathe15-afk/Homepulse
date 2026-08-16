'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

const initialAttributes = [
  { name: 'Balcony', type: 'boolean' },
  { name: 'Floor Number', type: 'number' },
  { name: 'Furnished', type: 'boolean' },
  { name: 'Parking Slots', type: 'number' },
  { name: 'Pet Friendly', type: 'boolean' },
  { name: 'Security', type: 'boolean' },
]

export default function AttributeManager() {
  const [attributes, setAttributes] = useState(initialAttributes)
  const [name, setName] = useState('')
  const [type, setType] = useState<'boolean' | 'number' | 'text'>('boolean')

  const addAttribute = () => {
    if (name.trim() === '') return
    setAttributes((prev) => [...prev, { name: name.trim(), type }])
    setName('')
  }

  return (
    <SectionCard title="Property Attributes" description="Custom attributes shown on property listings">
      <div className="flex items-end gap-2 mb-4">
        <AdminInput
          className="flex-1 h-9 text-sm"
          placeholder="New attribute name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addAttribute()}
        />
        <select className="admin-input h-9 w-auto text-sm" value={type} onChange={(e) => setType(e.target.value as 'boolean' | 'number' | 'text')}>
          <option value="boolean">Boolean</option>
          <option value="number">Number</option>
          <option value="text">Text</option>
        </select>
        <AdminButton size="sm" onClick={addAttribute}>
          <Plus size={14} className="mr-1.5" /> Add
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {attributes.map((attr) => (
          <div key={attr.name} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2.5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-800">{attr.name}</span>
              <span className="text-xs text-slate-400 capitalize">{attr.type}</span>
            </div>
            <button
              type="button"
              onClick={() => setAttributes((prev) => prev.filter((a) => a.name !== attr.name))}
              className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500"
              aria-label={`Remove ${attr.name}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
