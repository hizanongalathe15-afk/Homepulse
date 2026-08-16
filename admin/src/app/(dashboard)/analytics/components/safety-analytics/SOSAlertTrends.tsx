'use client'

import { AdminLineChart } from '@/components/charts/LineChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { week: 'W1', sos: 12, resolved: 10 },
  { week: 'W2', sos: 15, resolved: 13 },
  { week: 'W3', sos: 11, resolved: 11 },
  { week: 'W4', sos: 9, resolved: 8 },
  { week: 'W5', sos: 10, resolved: 9 },
  { week: 'W6', sos: 7, resolved: 7 },
  { week: 'W7', sos: 8, resolved: 7 },
  { week: 'W8', sos: 6, resolved: 6 },
]

export default function SOSAlertTrends() {
  return (
    <SectionCard title="SOS Alert Trends" description="Alerts raised vs resolved per week">
      <AdminLineChart
        data={data}
        xKey="week"
        yKeys={['sos', 'resolved']}
        colors={['#ef4444', '#10b981']}
        height={280}
      />
    </SectionCard>
  )
}