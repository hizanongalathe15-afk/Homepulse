'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { AdminButton } from '@/components/ui/AdminButton'
import { Calendar, User, Eye, Edit, Trash2, Send } from 'lucide-react'

const mockAnnouncements: Record<string, { title: string; content: string; target: string; status: string; date: string; author: string }> = {
  'ANC-001': {
    title: 'Platform Maintenance Scheduled',
    content: 'We will be performing scheduled maintenance on the platform this weekend. Services may be intermittently unavailable between 2:00 AM and 6:00 AM EAT on Sunday.',
    target: 'All Users',
    status: 'Published',
    date: '2025-01-15',
    author: 'Admin',
  },
  'ANC-002': {
    title: 'New Payment Methods Available',
    content: 'We have added support for additional payment methods including M-Pesa STK Push and Stripe cards. Users can now choose their preferred payment method during checkout.',
    target: 'Tenants',
    status: 'Published',
    date: '2025-01-10',
    author: 'Admin',
  },
  'ANC-003': {
    title: 'Holiday Schedule',
    content: 'Support will be limited during the upcoming holiday period. We will resume normal operations on January 2nd.',
    target: 'Landlords',
    status: 'Draft',
    date: '2025-01-05',
    author: 'Admin',
  },
}

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'ANC-001'
  const announcement = mockAnnouncements[id] || {
    title: 'Announcement',
    content: 'Announcement details not found.',
    target: 'All Users',
    status: 'Draft',
    date: new Date().toISOString().split('T')[0],
    author: 'Admin',
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={announcement.title}
        description={`Announcement ID: ${id}`}
        breadcrumbs={[
          { label: 'Content', href: '/content-management' },
          { label: 'Announcements', href: '/content-management/announcements' },
          { label: id },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" icon={<Edit size={16} />}>
              Edit
            </AdminButton>
            <AdminButton variant="outline" icon={<Send size={16} />}>
              Resend
            </AdminButton>
            <AdminButton variant="destructive" icon={<Trash2 size={16} />}>
              Delete
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-slate-900">Details</h3>
          </div>
          <div className="admin-card-body space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-slate-400" size={18} />
              <div>
                <p className="text-sm font-medium text-slate-900">{announcement.author}</p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-slate-400" size={18} />
              <div>
                <p className="text-sm font-medium text-slate-900">{announcement.date}</p>
                <p className="text-xs text-slate-500">Published Date</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="text-slate-400" size={18} />
              <div>
                <p className="text-sm font-medium text-slate-900">{announcement.target}</p>
                <p className="text-xs text-slate-500">Target Audience</p>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {announcement.status}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card md:col-span-2">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-slate-900">Content</h3>
          </div>
          <div className="admin-card-body">
            <p className="text-slate-700 whitespace-pre-wrap">{announcement.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
