'use client'

import { AdminLineChart } from '@/components/charts/LineChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { month: 'Jan', average: 1050, median: 1020 },
  { month: 'Feb', average: 1080, median: 1050 },
  { month: 'Mar', average: 1120, median: 1080 },
  { month: 'Apr', average: 1140, median: 1100 },
  { month: 'May', average: 1180, median: 1130 },
  { month: 'Jun', average: 1210, median: 1160 },
  { month: 'Jul', average: 1220, median: 1170 },
  { month: 'Aug', average: 1240, median: 1190 },
]

export default function PriceTrends() {
  return (
    <SectionCard title="Price Trends" description="Average vs median monthly rent (USD)">
      <AdminLineChart
        data={data}
        xKey="month"
        yKeys={['average', 'median']}
        colors={['#0ea5e9', '#10b981']}
        height={280}
      />
    </SectionCard>
  )
}