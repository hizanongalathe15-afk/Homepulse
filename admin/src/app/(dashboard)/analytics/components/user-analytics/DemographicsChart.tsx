'use client'

import { AdminPieChart } from '@/components/charts/PieChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { name: '18-24', value: 4820 },
  { name: '25-34', value: 12340 },
  { name: '35-44', value: 9620 },
  { name: '45-54', value: 7410 },
  { name: '55+', value: 3700 },
]

export default function DemographicsChart() {
  return (
    <SectionCard title="User Demographics" description="Distribution of users by age group">
      <AdminPieChart data={data} height={280} />
    </SectionCard>
  )
}