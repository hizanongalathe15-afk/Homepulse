'use client'

import { useState, useMemo } from 'react'
import { InteractiveHeatmap } from '@/components/charts/InteractiveHeatmap'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const timeSlots = ['00-06', '06-12', '12-18', '18-24']

const rawData: Record<string, Record<string, number>> = {
  Mon: { '00-06': 120, '06-12': 480, '12-18': 720, '18-24': 540 },
  Tue: { '00-06': 98, '06-12': 512, '12-18': 698, '18-24': 566 },
  Wed: { '00-06': 110, '06-12': 468, '12-18': 735, '18-24': 590 },
  Thu: { '00-06': 132, '06-12': 502, '12-18': 752, '18-24': 612 },
  Fri: { '00-06': 145, '06-12': 554, '12-18': 810, '18-24': 734 },
  Sat: { '00-06': 210, '06-12': 690, '12-18': 960, '18-24': 842 },
  Sun: { '00-06': 195, '06-12': 642, '12-18': 880, '18-24': 745 },
}

export default function QRScanHeatmap() {
  const [selectedDays, setSelectedDays] = useState<string[]>(days)
  const [selectedTime, setSelectedTime] = useState<string[]>(timeSlots)

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const toggleTime = (time: string) => {
    setSelectedTime((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]))
  }

  const data = useMemo(() => {
    const result: Array<{ x: string; y: string; value: number }> = []
    selectedDays.forEach((day) => {
      selectedTime.forEach((time) => {
        result.push({ x: day, y: time, value: rawData[day]?.[time] ?? 0 })
      })
    })
    return result
  }, [selectedDays, selectedTime])

  return (
    <SectionCard title="Scan Activity Heatmap" description="Scan volume by day of week and time of day">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Days:</span>
          {days.map((day) => (
            <AdminButton
              key={day}
              size="sm"
              variant={selectedDays.includes(day) ? 'default' : 'outline'}
              onClick={() => toggleDay(day)}
            >
              {day}
            </AdminButton>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Time:</span>
          {timeSlots.map((time) => (
            <AdminButton
              key={time}
              size="sm"
              variant={selectedTime.includes(time) ? 'default' : 'outline'}
              onClick={() => toggleTime(time)}
            >
              {time}
            </AdminButton>
          ))}
        </div>
        <div className="admin-heatmap-panel rounded-xl border border-slate-200/60 bg-white/40 backdrop-blur-sm p-5">
          <InteractiveHeatmap
            data={data}
            xKey="x"
            yKey="y"
            valueKey="value"
            height={300}
            accentColor="#8b5cf6"
            cellSize={36}
          />
        </div>
      </div>
    </SectionCard>
  )
}
