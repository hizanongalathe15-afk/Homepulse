'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Upload } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'

const categories = ['Getting Started', 'Landlords', 'Tenants', 'Safety']

export default function TutorialCreator() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [video, setVideo] = useState<string | null>(null)

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="text-lg font-semibold text-slate-900">New Tutorial</h3>
      </div>
      <div className="admin-card-body space-y-4">
        <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 cursor-pointer hover:border-primary/60 transition-colors">
          <Upload size={20} className="text-slate-400 mb-2" />
          <span className="text-sm text-slate-500">{video ?? 'Upload tutorial video'}</span>
          <span className="text-xs text-slate-400 mt-0.5">MP4 or WebM · max 500 MB</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideo(e.target.files?.[0]?.name ?? null)} />
        </label>
        <AdminInput label="Title" placeholder="e.g. Paying rent with M-Pesa" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <AdminButton disabled={title.trim() === '' || video === null}>
          <Plus size={14} className="mr-1.5" /> Publish Tutorial
        </AdminButton>
      </div>
    </div>
  )
}