'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? 'ANC-001'

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Announcement Detail"
        description={`Announcement: ${id}`}
        breadcrumbs={[
          { label: 'Content', href: '/content-management' },
          { label: 'Announcements', href: '/content-management/announcements' },
          { label: id },
        ]}
      />
    </div>
  )
}