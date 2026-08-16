'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

interface RadarChartProps {
  data: Array<Record<string, unknown>>
  dataKey: string
  angleKey: string
  height?: number
  color?: string
}

export function AdminRadarChart({ data, dataKey, angleKey, height = 300, color = '#0ea5e9' }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={angleKey} className="text-xs" />
        <PolarRadiusAxis className="text-xs" />
        <Radar name={dataKey} dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.5} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
