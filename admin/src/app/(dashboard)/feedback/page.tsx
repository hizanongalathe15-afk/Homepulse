'use client'

import { AdminHeader } from '@/components/ui/AdminHeader'
import FeedbackAnalytics from './components/FeedbackAnalytics'
import FeedbackFilters from './components/FeedbackFilters'
import FeedbackList from './components/FeedbackList'
import FeedbackResponse from './components/FeedbackResponse'

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Feedback"
        description="Review user feedback, ratings and support requests."
        actions={<FeedbackResponse />}
      />
      <FeedbackAnalytics />
      <div className="admin-card">
        <div className="admin-card-header">
          <FeedbackFilters />
        </div>
        <div className="admin-card-body p-0">
          <FeedbackList />
        </div>
      </div>
    </div>
  )
}
