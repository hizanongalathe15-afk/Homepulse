'use client'

import { AdminPieChart } from '@/components/charts/PieChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { name: 'M-Pesa', value: 412000 },
  { name: 'Stripe', value: 214000 },
  { name: 'Bank Transfer', value: 148000 },
  { name: 'Cash', value: 59000 },
]

export default function PaymentMethodBreakdown() {
  return (
    <SectionCard title="Payment Method Breakdown" description="Share of revenue by payment method">
      <AdminPieChart data={data} height={280} />
    </SectionCard>
  )
}