import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import Link from 'next/link'

const sections = [
  { name: 'Announcements', href: '/content-management/announcements', desc: 'Platform-wide broadcast messages', count: 4 },
  { name: 'Blog', href: '/content-management/blog', desc: 'Articles, guides and market insights', count: 12 },
  { name: 'FAQ', href: '/content-management/faq', desc: 'Help center questions and answers', count: 48 },
  { name: 'Tutorials', href: '/content-management/tutorials', desc: 'Step-by-step user guides', count: 9 },
]

export default function ContentManagementPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Content Management"
        description="Manage announcements, blog, FAQ and tutorials."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="admin-card hover:shadow-md transition-shadow">
            <div className="admin-card-body">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{section.name}</h3>
                <span className="text-sm text-slate-400">{section.count} items</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{section.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}