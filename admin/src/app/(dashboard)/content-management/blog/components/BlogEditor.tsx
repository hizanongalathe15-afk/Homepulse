'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

const categories = ['Guides', 'Market', 'Legal', 'Landlords', 'Tenants']

export default function BlogEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [cover, setCover] = useState<string | null>(null)

  return (
    <SectionCard title="Write a Post" description="Create or edit a blog article">
      <div className="space-y-4">
        <AdminInput
          label="Title"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea
            className="admin-input min-h-[240px]"
            placeholder="Write in Markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-3 cursor-pointer hover:border-primary/60 transition-colors">
            <span className="text-xs text-slate-500">{cover ?? 'Upload cover image'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setCover(e.target.files?.[0]?.name ?? null)} />
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <AdminButton variant="outline">Preview</AdminButton>
          <AdminButton disabled={title.trim() === '' || content.trim() === ''}>
            <Save size={14} className="mr-1.5" /> Publish
          </AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}