'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const initialCategories = [
  { name: 'Guides', posts: 12 },
  { name: 'Market', posts: 8 },
  { name: 'Legal', posts: 5 },
  { name: 'Landlords', posts: 9 },
]

export default function BlogCategories() {
  const [categories, setCategories] = useState(initialCategories)
  const [name, setName] = useState('')

  const add = () => {
    if (name.trim() === '') return
    setCategories((prev) => [...prev, { name: name.trim(), posts: 0 }])
    setName('')
  }

  return (
    <SectionCard title="Categories" description="Blog post categories">
      <div className="flex items-center gap-2 mb-3">
        <AdminInput
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <AdminButton size="sm" onClick={add}>
          <Plus size={14} />
        </AdminButton>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm">
            <span className="font-medium text-slate-800">{category.name}</span>
            <StatusBadge variant="info" label={`${category.posts} posts`} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}