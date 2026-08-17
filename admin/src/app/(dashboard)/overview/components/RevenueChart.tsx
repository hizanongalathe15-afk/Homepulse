'use client'

import { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SectionCard } from '@/components/features/SectionCard'
import { adminAnalyticsService } from '@/services/adminAnalytics.service'
import type { RevenueAnalytics } from '@/types/analytics.types'

export default function RevenueChart() {
  const [data, setData] = useState<Array<{ month: string; revenue: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const now = new Date()
        const dateFrom = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString().split('T')[0]
        const dateTo = now.toISOString().split('T')[0]
        const response = await adminAnalyticsService.getRevenueAnalytics(dateFrom, dateTo)
        const analytics = response as RevenueAnalytics
        const forecastData = (analytics.forecast || []).map((item) => ({
          month: item.month,
          revenue: item.actual || item.predicted || 0,
        }))
        setData(forecastData)
      } catch (err) {
        setError('Failed to load revenue data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRevenue()
  }, [])

  if (loading) {
    return (
      <SectionCard title="Revenue Overview" description="Monthly revenue trends for the current year">
        <div className="h-80 w-full flex items-center justify-center">
          <div className="h-64 w-full bg-muted rounded animate-pulse" />
        </div>
      </SectionCard>
    )
  }

  if (error || data.length === 0) {
    return (
      <SectionCard title="Revenue Overview" description="Monthly revenue trends for the current year">
        <div className="h-80 w-full flex items-center justify-center text-slate-500">
          {error || 'No revenue data available'}
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard title="Revenue Overview" description="Monthly revenue trends for the current year">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `KSh ${v / 1000}k`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`KSh ${value.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}
