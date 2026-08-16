'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const campaigns = [
  { name: 'Back-to-School Housing', budget: 12000, spent: 8900, clicks: 12400, roi: 1.8, status: 'active' },
  { name: 'Beachside Thika Promo', budget: 8000, spent: 6200, clicks: 9800, roi: 1.4, status: 'active' },
  { name: 'Student Accommodation', budget: 5000, spent: 4100, clicks: 7200, roi: 2.1, status: 'paused' },
  { name: 'Corporate Relocation', budget: 15000, spent: 13400, clicks: 6400, roi: 0.9, status: 'expired' },
]

export default function TrendingCampaigns() {
  return (
    <SectionCard title="Trending Campaigns" description="Latest marketing campaign performance">
      <div className="space-y-4">
        {campaigns.map((c) => (
          <div key={c.name}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-slate-800">{c.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">
                  ${(c.spent / 1000).toFixed(1)}k spent · {c.clicks.toLocaleString()} clicks
                </span>
                <StatusBadge
                  variant={c.status === 'active' ? 'success' : c.status === 'paused' ? 'warning' : 'default'}
                  label={c.status}
                />
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min((c.spent / c.budget) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}