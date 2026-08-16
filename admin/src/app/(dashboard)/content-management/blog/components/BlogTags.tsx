'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

const initialTags = ['renting', 'nairobi', 'landlord-tips', 'security-deposit', 'mpesa']

export default function BlogTags() {
  const [tags, setTags] = useState(initialTags)
  const [value, setValue] = useState('')

  const add = () => {
    if (value.trim() === '' || tags.includes(value.trim())) return
    setTags((prev) => [...prev, value.trim()])
    setValue('')
  }

  return (
    <SectionCard title="Tags" description="Manage blog topic tags">
      <div className="flex items-center gap-2 mb-3">
        <AdminInput
          placeholder="Add a tag"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <AdminButton size="sm" onClick={add}>
          <Plus size={14} />
        </AdminButton>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
            #{tag}
            <button
              type="button"
              onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
              className="text-slate-400 hover:text-red-500"
              aria-label={`Remove ${tag}`}
            >
              <Trash2 size={12} />
            </button>
          </span>
        ))}
      </div>
    </SectionCard>
  )
}