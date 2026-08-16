'use client'

import { AdminBarChart } from '@/components/charts/BarChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { city: 'Nairobi', occupancy: 88, available: 12 },
  { city: 'Mombasa', occupancy: 79, available: 21 },
  { city: 'Kisumu', occupancy: 84, available: 16 },
  { city: 'Nakuru', occupancy: 82, available: 18 },
  { city: 'Eldoret', occupancy: 76, available: 24 },
  { city: 'Thika', occupancy: 85, available: 15 },
]

export default function OccupancyRates() {
  return (
    <SectionCard title="Occupancy Rates by City" description="Percentage of units occupied per city">
      <AdminBarChart
        data={data}
        xKey="city"
        yKeys={['occupancy']}
        colors={['#10b981']}
        height={280}
      />
    </SectionCard>
  )
}