'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

const placements = ['home', 'search', 'property_detail', 'dashboard']

export default function BannerCreator() {
  const [title, setTitle] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [placement, setPlacement] = useState(placements[0])
  const [image, setImage] = useState<string | null>(null)

  return (
    <SectionCard title="Create Banner" description="Design a new promotional banner">
      <div className="space-y-4">
        <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-8 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors">
          <Upload size={20} className="text-slate-400 mb-2" />
          {image ? (
            <span className="text-sm font-medium text-primary">{image}</span>
          ) : (
            <>
              <span className="text-sm text-slate-500">Upload banner image</span>
              <span className="text-xs text-slate-400 mt-0.5">Recommended 1200×400 · PNG or JPG</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0]?.name ?? null)}
          />
        </label>

        <AdminInput
          label="Title"
          placeholder="e.g. Welcome Home: August Promo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <AdminInput
          label="Target URL"
          placeholder="https://homepulse.example/promo"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Placement</label>
          <select className="admin-input" value={placement} onChange={(e) => setPlacement(e.target.value)}>
            {placements.map((p) => (
              <option key={p} value={p}>{p.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end pt-2">
          <AdminButton disabled={!image || title.trim() === '' || targetUrl.trim() === ''}>
            Save as Draft
          </AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}