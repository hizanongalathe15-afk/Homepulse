'use client'

import { InteractiveHeatmap } from '@/components/charts/InteractiveHeatmap'

const cities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const rawData = [
  { x: 'Jan', y: 'Nairobi', value: 92 },
  { x: 'Feb', y: 'Nairobi', value: 90 },
  { x: 'Mar', y: 'Nairobi', value: 94 },
  { x: 'Apr', y: 'Nairobi', value: 88 },
  { x: 'May', y: 'Nairobi', value: 91 },
  { x: 'Jun', y: 'Nairobi', value: 93 },
  { x: 'Jan', y: 'Mombasa', value: 71 },
  { x: 'Feb', y: 'Mombasa', value: 74 },
  { x: 'Mar', y: 'Mombasa', value: 78 },
  { x: 'Apr', y: 'Mombasa', value: 76 },
  { x: 'May', y: 'Mombasa', value: 81 },
  { x: 'Jun', y: 'Mombasa', value: 84 },
  { x: 'Jan', y: 'Kisumu', value: 68 },
  { x: 'Feb', y: 'Kisumu', value: 71 },
  { x: 'Mar', y: 'Kisumu', value: 75 },
  { x: 'Apr', y: 'Kisumu', value: 78 },
  { x: 'May', y: 'Kisumu', value: 80 },
  { x: 'Jun', y: 'Kisumu', value: 83 },
  { x: 'Jan', y: 'Nakuru', value: 65 },
  { x: 'Feb', y: 'Nakuru', value: 70 },
  { x: 'Mar', y: 'Nakuru', value: 73 },
  { x: 'Apr', y: 'Nakuru', value: 77 },
  { x: 'May', y: 'Nakuru', value: 79 },
  { x: 'Jun', y: 'Nakuru', value: 82 },
]

export default function CityHeatmap() {
  return (
    <div className="admin-heatmap-panel rounded-xl border border-slate-200/60 bg-white/40 backdrop-blur-sm p-5">
      <InteractiveHeatmap
        data={rawData}
        xKey="x"
        yKey="y"
        valueKey="value"
        height={320}
        title="City Heatmap"
        description="Occupancy intensity by city over time"
        accentColor="#0ea5e9"
        cellSize={32}
      />
    </div>
  )
}
