'use client'

import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/ui/AdminHeader'
import { SectionCard } from '@/components/features/SectionCard'
import { InfoRow } from '@/components/features/InfoRow'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'
import FeedbackResponse from '../components/FeedbackResponse'

const feedback = {
  id: 'FB-001',
  user: 'John Mwangi',
  userId: 'USR-1002',
  email: 'john.mwangi@example.com',
  property: 'Sunset Apartments, Westlands',
  rating: 5,
  comment: 'Great place, very clean and well maintained. The landlord was responsive and the move-in process was smooth.',
  status: 'replied',
  submittedAt: '2026-08-14T10:24:00Z',
  repliedAt: '2026-08-14T14:05:00Z',
  repliedBy: 'Admin User',
  reply: 'Thank you for your kind words, John! We are glad you enjoyed your stay.',
}

export default function FeedbackDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? feedback.id

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Feedback ${id}`}
        description={`From ${feedback.user}`}
        breadcrumbs={[{ label: 'Feedback', href: '/feedback' }, { label: id }]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge variant={feedback.status === 'replied' ? 'success' : 'warning'} label={feedback.status} />
            <FeedbackResponse />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SectionCard title="Reviewer Info">
            <div>
              <InfoRow label="User" value={feedback.user} />
              <InfoRow label="User ID" value={feedback.userId} />
              <InfoRow label="Email" value={feedback.email} />
              <InfoRow label="Property" value={feedback.property} />
              <InfoRow label="Rating" value="★★★★★" />
            </div>
          </SectionCard>
          <SectionCard title="Status">
            <div>
              <InfoRow label="Status" value={<StatusBadge variant={feedback.status === 'replied' ? 'success' : 'warning'} label={feedback.status} />} />
              <InfoRow label="Submitted" value={new Date(feedback.submittedAt).toLocaleString()} />
              {feedback.repliedAt && (
                <InfoRow label="Replied" value={new Date(feedback.repliedAt).toLocaleString()} />
              )}
              {feedback.repliedBy && (
                <InfoRow label="Replied By" value={feedback.repliedBy} />
              )}
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Comment">
            <p className="text-sm text-slate-700 leading-relaxed">{feedback.comment}</p>
          </SectionCard>
          {feedback.reply && (
            <SectionCard title="Official Reply">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-700 leading-relaxed">{feedback.reply}</p>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  )
}
