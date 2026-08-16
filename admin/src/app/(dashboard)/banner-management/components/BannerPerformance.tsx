'use client'

import { AdminLineChart } from '@/components/charts/LineChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { week: 'W1', impressions: 32000, clicks: 860 },
  { week: 'W2', impressions: 41000, clicks: 1120 },
  { week: 'W3', impressions: 48000, clicks: 1400 },
  { week: 'W4', impressions: 53000, clicks: 1630 },
  { week: 'W5', impressions: 59000, clicks: 1810 },
  { week: 'W6', impressions: 64000, clicks: 2010 },
]

export default function BannerPerformance() {
  return (
    <SectionCard title="Performance Over Time" description="Weekly impressions and clicks across banners">
      <AdminLineChart
        data={data}
        xKey="week"
        yKeys={['impressions', 'clicks']}
        colors={['#0ea5e9', '#f59e0b']}
        height={280}
      />
    </SectionCard>
  )
}