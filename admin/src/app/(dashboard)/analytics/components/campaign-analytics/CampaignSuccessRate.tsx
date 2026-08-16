'use client'

import { AdminBarChart } from '@/components/charts/BarChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { name: 'Social Media', launched: 6, success: 5 },
  { name: 'Email', launched: 4, success: 3 },
  { name: 'SMS Blast', launched: 3, success: 2 },
  { name: 'Referral', launched: 2, success: 2 },
  { name: 'Outdoor', launched: 2, success: 1 },
  { name: 'In-app', launched: 1, success: 1 },
]

export default function CampaignSuccessRate() {
  return (
    <SectionCard title="Campaign Success Rate" description="Successful campaigns per channel">
      <AdminBarChart
        data={data}
        xKey="name"
        yKeys={['success']}
        colors={['#10b981']}
        height={280}
      />
    </SectionCard>
  )
}