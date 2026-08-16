'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AdminButton } from '@/components/ui/AdminButton'

interface ExpiringCode {
  code: string
  property: string
  expiresAt: string
  daysLeft: number
}

const initial: ExpiringCode[] = [
  { code: 'HP-NBO-0012', property: 'Sunset Apartments, Westlands', expiresAt: '2026-08-25', daysLeft: 9 },
  { code: 'HP-MSA-0088', property: 'Beachside Villa, Mombasa', expiresAt: '2026-09-01', daysLeft: 16 },
  { code: 'HP-CMP-0042', property: 'Back-to-School Campaign', expiresAt: '2026-08-30', daysLeft: 14 },
]

export default function QRExpiryManager() {
  const [codes, setCodes] = useState(initial)
  const [extended, setExtended] = useState<string[]>([])

  const extend = (code: string) => {
    setExtended((prev) => [...prev, code])
  }

  return (
    <SectionCard
      title="Expiry Manager"
      description="Renew codes that are about to expire"
      action={<StatusBadge variant="warning" label={`${codes.length} expiring soon`} />}
    >
      <div className="divide-y divide-slate-100">
        {codes.map((item) => {
          const done = extended.includes(item.code)
          return (
            <div key={item.code} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Clock size={16} className={item.daysLeft <= 7 ? 'text-red-500' : 'text-amber-500'} />
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.code}</p>
                  <p className="text-xs text-slate-400">{item.property}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {done ? 'Extended to 2027-01-01' : `Expires ${item.expiresAt} (${item.daysLeft}d)`}
                </span>
                <AdminButton size="sm" variant={done ? 'outline' : 'default'} disabled={done} onClick={() => extend(item.code)}>
                  {done ? 'Extended' : 'Extend +30d'}
                </AdminButton>
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}