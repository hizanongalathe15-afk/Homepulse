'use client'

import { AdminLineChart } from '@/components/charts/LineChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { month: 'Mar', safety: 71, incidentRate: 12 },
  { month: 'Apr', safety: 73, incidentRate: 11 },
  { month: 'May', safety: 76, incidentRate: 10 },
  { month: 'Jun', safety: 78, incidentRate: 9 },
  { month: 'Jul', safety: 81, incidentRate: 8 },
  { month: 'Aug', safety: 83, incidentRate: 7 },
]

export default function SafetyScoreTrends() {
  return (
    <SectionCard title="Safety Score Trends" description="Average neighbourhood safety score & incident rate">
      <AdminLineChart
        data={data}
        xKey="month"
        yKeys={['safety']}
        colors={['#0ea5e9']}
        height={280}
      />
    </SectionCard>
  )
}