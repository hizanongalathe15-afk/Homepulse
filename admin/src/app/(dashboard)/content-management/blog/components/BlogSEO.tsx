'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function BlogSEO() {
  const [slug, setSlug] = useState('how-to-rent-property-on-homepulse')
  const [title, setTitle] = useState('How to Rent a Property on HomePulse')
  const [description, setDescription] = useState('Step-by-step guide to renting properties on HomePulse, including verification, deposits and safety checks.')

  return (
    <SectionCard title="SEO Settings" description="Search engine metadata for the post">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">homepulse.example/blog/</span>
            <input className="admin-input" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
          <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
          <textarea className="admin-input min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="rounded-lg border border-slate-100 p-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Search size={12} /> google.com
          </div>
          <p className="text-sm font-semibold text-blue-600 mt-1">{title}</p>
          <p className="text-xs text-green-700 mt-0.5">homepulse.example/blog/{slug}</p>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge variant="success" label="SEO optimized" />
          <AdminButton size="sm">Apply Metadata</AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}