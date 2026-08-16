'use client'

import { useState } from 'react'
import { AdminHeader } from '@/components/ui/AdminHeader'
import FraudAnalytics from './components/FraudAnalytics'
import FraudAlerts from './components/FraudAlerts'
import FraudFlaggedListings from './components/FraudFlaggedListings'
import FraudManualReview from './components/FraudManualReview'
import FraudRules from './components/FraudRules'

export default function FraudDetectionPage() {
  const [tab, setTab] = useState<'alerts' | 'listings' | 'review' | 'rules'>('alerts')

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Fraud Detection"
        description="Monitor, investigate, and prevent fraudulent activity."
      />
      <FraudAnalytics />
      <div className="flex items-center gap-2 border-b border-slate-200">
        {([
          { key: 'alerts', label: 'Alerts' },
          { key: 'listings', label: 'Flagged Listings' },
          { key: 'review', label: 'Manual Review' },
          { key: 'rules', label: 'Rules' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'alerts' && <FraudAlerts />}
      {tab === 'listings' && <FraudFlaggedListings />}
      {tab === 'review' && <FraudManualReview />}
      {tab === 'rules' && <FraudRules />}
    </div>
  )
}
