'use client'

import { FunnelChart, Funnel, LabelList, ResponsiveContainer, Tooltip } from 'recharts'

interface FunnelChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
}

export function AdminFunnelChart({ data, height = 300 }: FunnelChartProps) {
  const colors = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe']

  return (
    <ResponsiveContainer width="100%" height={height}>
      <FunnelChart>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList position="center" fill="white" className="text-xs font-medium" />
          {data.map((entry, index) => (
            <Funnel key={entry.name} dataKey="value" fill={colors[index % colors.length]} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  )
}
