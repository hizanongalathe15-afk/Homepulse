'use client'

import { useState } from 'react'
import { AdminButton } from '@/components/ui/AdminButton'
import { SectionCard } from '@/components/features/SectionCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface FeedbackItem {
  id: string
  user: string
  userId: string
  property: string
  rating: number
  comment: string
  status: 'pending' | 'replied' | 'flagged' | 'resolved'
  submittedAt: string
}

const feedback: FeedbackItem[] = [
  { id: 'FB-001', user: 'John Mwangi', userId: 'USR-1002', property: 'Sunset Apartments', rating: 5, comment: 'Great place, very clean and well maintained.', status: 'replied', submittedAt: '2026-08-14' },
  { id: 'FB-002', user: 'Amina Hassan', userId: 'USR-1003', property: 'Beachside Villa', rating: 2, comment: 'Noise issues and late maintenance response.', status: 'pending', submittedAt: '2026-08-13' },
  { id: 'FB-003', user: 'David Kimani', userId: 'USR-1006', property: 'Lakeview Flats', rating: 4, comment: 'Good value for money, would recommend.', status: 'replied', submittedAt: '2026-08-12' },
  { id: 'FB-004', user: 'Faith Nyambura', userId: 'USR-1005', property: 'Hillcrest House', rating: 1, comment: 'Unprofessional landlord, avoid.', status: 'flagged', submittedAt: '2026-08-10' },
  { id: 'FB-005', user: 'Mary Wanjiku', userId: 'USR-1001', property: 'Green Park Residences', rating: 3, comment: 'Average experience, nothing special.', status: 'resolved', submittedAt: '2026-08-08' },
]

function ratingStars(rating: number) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-yellow-500' : 'text-slate-300'}>
          ★
        </span>
      ))}
    </span>
  )
}

function statusVariant(status: FeedbackItem['status']) {
  switch (status) {
    case 'pending': return 'warning'
    case 'replied': return 'success'
    case 'flagged': return 'destructive'
    case 'resolved': return 'info'
  }
}

export default function FeedbackList() {
  const [search, setSearch] = useState('')

  return (
    <DataTable<FeedbackItem>
      data={feedback}
      searchPlaceholder="Search feedback by user or property..."
      onRowClick={(f) => console.log('Feedback clicked', f.id)}
      columns={[
        {
          key: 'user',
          header: 'User',
          render: (f) => (
            <div>
              <p className="font-medium text-slate-900">{f.user}</p>
              <p className="text-xs text-slate-500">{f.userId}</p>
            </div>
          ),
        },
        { key: 'property', header: 'Property' },
        { key: 'rating', header: 'Rating', render: (f) => ratingStars(f.rating) },
        { key: 'comment', header: 'Comment', render: (f) => <span className="truncate max-w-xs block">{f.comment}</span> },
        {
          key: 'status',
          header: 'Status',
          render: (f) => <StatusBadge variant={statusVariant(f.status)} label={f.status} />,
        },
        {
          key: 'submittedAt',
          header: 'Submitted',
          render: (f) => new Date(f.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        },
      ]}
    />
  )
}
