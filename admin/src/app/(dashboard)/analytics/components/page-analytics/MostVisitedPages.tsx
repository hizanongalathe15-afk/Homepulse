'use client'

import { useEffect, useState } from 'react'
import { adminAnalyticsService } from '@/services/adminAnalytics.service'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { TrendingUp, Globe, BarChart3 } from 'lucide-react'

type VisitData = {
  page: string
  visits: number
}

type TrendData = {
  date: string
  visits: number
}

function MostVisitedChart() {
  const [data, setData] = useState<VisitData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pages' | 'trends'>('pages')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await adminAnalyticsService.getMostVisitedPages(15)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch visit data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayData = data.slice(0, 10).map((d) => ({
    page: d.page.length > 20 ? d.page.substring(0, 20) + '...' : d.page,
    visits: d.visits,
  }))

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-full bg-slate-200 rounded h-[200px]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold text-slate-900">Most Visited Pages</h3>
        </div>
        <div className="flex gap-1 bg-slate-100/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('pages')}
            className={cn(
              'px-3 py-1 text-xs rounded-md transition-all',
              activeTab === 'pages'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-600 hover:bg-slate-200/50'
            )}
          >
            Pages
          </button>
        </div>
      </div>

      {displayData.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No page visit data yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.slice(0, 15).map((item, idx) => (
            <div
              key={item.page}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <span className="text-xs text-slate-400 w-5 text-right">
                #{idx + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <code className="text-xs text-slate-700 bg-slate-100/50 px-2 py-1 rounded">
                    {item.page}
                  </code>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all group-hover:bg-cyan-400"
                        style={{
                          width: `${Math.min((item.visits / Math.max(...data.map((d) => d.visits))) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-700 w-12 text-right">
                      {item.visits}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MostVisitedChart
