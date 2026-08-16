'use client'

import { useState } from 'react'
import { AdminHeader } from '@/components/ui/AdminHeader'
import SupportAnalytics from './components/SupportAnalytics'
import SupportTickets from './components/SupportTickets'
import { LiveMetricsProvider } from '@/contexts/LiveMetricsContext'

export default function SupportPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'escalated'>('all')

  return (
    <LiveMetricsProvider>
      <div className="space-y-6">
        <AdminHeader
          title="Support"
          description="Manage customer support tickets and live chat sessions."
        />
        <SupportAnalytics />
        <SupportTickets filter={filter} onFilterChange={setFilter} />
      </div>
    </LiveMetricsProvider>
  )
}
