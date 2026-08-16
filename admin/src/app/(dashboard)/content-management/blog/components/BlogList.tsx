'use client'

import { FileText } from 'lucide-react'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

interface BlogPost {
  id: string
  title: string
  category: string
  author: string
  status: 'published' | 'draft' | 'scheduled'
  publishedAt: string
}

const posts: BlogPost[] = [
  { id: 'BLG-001', title: 'How to verify your property on HomePulse', category: 'Guides', author: 'Mary Wanjiku', status: 'published', publishedAt: '2026-08-05' },
  { id: 'BLG-002', title: 'Renting in Nairobi: 2026 Market Outlook', category: 'Market', author: 'Amina Hassan', status: 'published', publishedAt: '2026-07-28' },
  { id: 'BLG-003', title: 'Security deposit guidelines for tenants', category: 'Legal', author: 'John Mwangi', status: 'draft', publishedAt: '—' },
  { id: 'BLG-004', title: 'Preparing your home for tenants', category: 'Landlords', author: 'Mary Wanjiku', status: 'scheduled', publishedAt: '2026-08-25' },
]

function statusVariant(status: BlogPost['status']) {
  return status === 'published' ? 'success' : status === 'draft' ? 'warning' : 'info'
}

export default function BlogList() {
  return (
    <DataTable<BlogPost>
      data={posts}
      searchPlaceholder="Search blog posts..."
      columns={[
        {
          key: 'title',
          header: 'Title',
          render: (p) => (
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-slate-300 shrink-0" />
              <span className="font-medium text-slate-900">{p.title}</span>
            </div>
          ),
        },
        { key: 'category', header: 'Category', render: (p) => p.category },
        { key: 'author', header: 'Author', render: (p) => p.author },
        {
          key: 'status',
          header: 'Status',
          render: (p) => <StatusBadge variant={statusVariant(p.status)} label={p.status} />,
        },
        { key: 'publishedAt', header: 'Published', render: (p) => p.publishedAt },
        {
          key: 'actions',
          header: 'Actions',
          render: () => <AdminButton size="sm" variant="outline">Edit</AdminButton>,
        },
      ]}
    />
  )
}