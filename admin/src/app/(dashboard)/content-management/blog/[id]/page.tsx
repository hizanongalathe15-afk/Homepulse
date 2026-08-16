'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import BlogEditor from '../components/BlogEditor'
import BlogSEO from '../components/BlogSEO'

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'BLG-001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Edit Post"
        description={`Blog post: ${id}`}
        breadcrumbs={[
          { label: 'Content', href: '/content-management' },
          { label: 'Blog', href: '/content-management/blog' },
          { label: id },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BlogEditor />
        </div>
        <div>
          <BlogSEO />
        </div>
      </div>
    </div>
  )
}