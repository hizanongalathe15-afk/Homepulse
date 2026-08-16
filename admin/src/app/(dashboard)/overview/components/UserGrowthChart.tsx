'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SectionCard } from '@/components/features/SectionCard'

const data = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 1800 },
  { month: 'Mar', users: 1500 },
  { month: 'Apr', users: 2200 },
  { month: 'May', users: 2800 },
  { month: 'Jun', users: 2400 },
  { month: 'Jul', users: 3100 },
  { month: 'Aug', users: 2900 },
  { month: 'Sep', users: 3400 },
  { month: 'Oct', users: 3600 },
  { month: 'Nov', users: 3200 },
  { month: 'Dec', users: 3800 },
]

export default function UserGrowthChart() {
  return (
    <SectionCard title="User Growth" description="New user signups per month">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`${value.toLocaleString()} users`, 'New Users']}
            />
            <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}
