import { AdminHeader } from '@/components/ui/AdminHeader'
import BlogCategories from './components/BlogCategories'
import BlogTags from './components/BlogTags'
import BlogList from './components/BlogList'

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Blog"
        description="Write and manage blog articles."
        breadcrumbs={[{ label: 'Content', href: '/content-management' }, { label: 'Blog' }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BlogCategories />
        <BlogTags />
      </div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-slate-900">All Posts</h3>
        </div>
        <div className="admin-card-body p-0">
          <BlogList />
        </div>
      </div>
    </div>
  )
}