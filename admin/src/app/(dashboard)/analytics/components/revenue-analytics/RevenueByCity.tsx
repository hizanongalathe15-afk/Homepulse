'use client'

import { AdminBarChart } from '@/components/charts/BarChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { city: 'Nairobi', revenue: 342000 },
  { city: 'Mombasa', revenue: 156000 },
  { city: 'Kisumu', revenue: 98000 },
  { city: 'Nakuru', revenue: 84000 },
  { city: 'Eldoret', revenue: 61000 },
  { city: 'Thika', revenue: 52000 },
]

export default function RevenueByCity() {
  return (
    <SectionCard title="Revenue by City" description="Total revenue generated per city">
      <AdminBarChart
        data={data}
        xKey="city"
        yKeys={['revenue']}
        colors={['#0ea5e9']}
        height={280}
      />
    </SectionCard>
  )
}