'use client'

import { SectionCard } from '@/components/features/SectionCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const users = [
  { name: 'Mary Wanjiku', email: 'mary.wanjiku@gmail.com', role: 'landlord', match: 98 },
  { name: 'Amina Hassan', email: 'amina.hassan@gmail.com', role: 'agent', match: 92 },
  { name: 'David Kimani', email: 'david.kimani@gmail.com', role: 'tenant', match: 87 },
  { name: 'Faith Nyambura', email: 'faith.nyambura@gmail.com', role: 'tenant', match: 74 },
]

export default function SegmentPreview() {
  return (
    <SectionCard
      title="Segment Preview"
      description={`${users.length} users would be included in this segment`}
      action={<StatusBadge variant="info" label="Live preview" />}
    >
      <div className="divide-y divide-slate-100">
        {users.map((user) => (
          <div key={user.email} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 capitalize">{user.role}</span>
              <span className="text-sm font-semibold text-primary">{user.match}%</span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}