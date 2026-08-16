'use client'

import { AdminFunnelChart } from '@/components/charts/FunnelChart'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { name: 'Scans', value: 346920 },
  { name: 'Property Views', value: 189340 },
  { name: 'Contact Made', value: 112600 },
  { name: 'Visit Booked', value: 61800 },
  { name: 'Booking Completed', value: 38960 },
]

export default function QRConversionRate() {
  return (
    <SectionCard title="QR Conversion Funnel" description="Scan-to-booking conversion journey">
      <AdminFunnelChart data={data} height={300} />
    </SectionCard>
  )
}