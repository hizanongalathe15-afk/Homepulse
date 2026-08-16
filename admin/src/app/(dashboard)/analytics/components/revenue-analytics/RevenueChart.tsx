'use client'

import { AdminLineChart } from '@/components/charts/LineChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { month: 'Jan', revenue: 42000, expenses: 18500 },
  { month: 'Feb', revenue: 45800, expenses: 19200 },
  { month: 'Mar', revenue: 51200, expenses: 20400 },
  { month: 'Apr', revenue: 48900, expenses: 19800 },
  { month: 'May', revenue: 56400, expenses: 21500 },
  { month: 'Jun', revenue: 61200, expenses: 22800 },
  { month: 'Jul', revenue: 65800, expenses: 23600 },
  { month: 'Aug', revenue: 69400, expenses: 24100 },
]

export default function RevenueChart() {
  return (
    <SectionCard title="Revenue Trend" description="Monthly revenue vs expenses (USD)">
      <AdminLineChart
        data={data}
        xKey="month"
        yKeys={['revenue', 'expenses']}
        colors={['#10b981', '#f59e0b']}
        height={280}
      />
    </SectionCard>
  )
}