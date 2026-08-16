'use client'

import { SectionCard } from '@/components/features/SectionCard'

const segments = [
  { name: 'Verified Landlords', count: 6120, color: 'bg-emerald-500' },
  { name: 'Tenants', count: 28410, color: 'bg-sky-500' },
  { name: 'Property Agents', count: 1842, color: 'bg-violet-500' },
  { name: 'High-trust Users', count: 920, color: 'bg-amber-500' },
  { name: 'Inactive (90+ days)', count: 4211, color: 'bg-slate-400' },
]

const total = segments.reduce((sum, s) => sum + s.count, 0)

export default function UserSegmentation() {
  return (
    <SectionCard title="User Segments" description="Breakdown of users by segment">
      <div className="space-y-4">
        {segments.map((segment) => {
          const percentage = Math.round((segment.count / total) * 100)
          return (
            <div key={segment.name} className="group relative">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{segment.name}</span>
                <span className="text-slate-500">
                  {segment.count.toLocaleString()} · {percentage}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden progress-bar-hover cursor-pointer">
                <div className={`h-full ${segment.color} rounded-full transition-all duration-200 group-hover:brightness-110`} style={{ width: `${percentage}%` }} />
              </div>
              <div className="absolute left-0 -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10">
                {segment.count.toLocaleString()} users ({percentage}%)
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
