'use client'

import { AdminLineChart } from '@/components/charts/LineChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { month: 'Jan', retention: 62, active: 18400 },
  { month: 'Feb', retention: 64, active: 19800 },
  { month: 'Mar', retention: 66, active: 21400 },
  { month: 'Apr', retention: 68, active: 22900 },
  { month: 'May', retention: 69, active: 24900 },
  { month: 'Jun', retention: 71, active: 27100 },
  { month: 'Jul', retention: 72, active: 29400 },
  { month: 'Aug', retention: 71, active: 32800 },
]

export default function UserRetentionChart() {
  return (
    <SectionCard title="User Retention" description="Retention rate and active users over time">
      <AdminLineChart
        data={data}
        xKey="month"
        yKeys={['retention']}
        colors={['#8b5cf6']}
        height={280}
      />
    </SectionCard>
  )
}