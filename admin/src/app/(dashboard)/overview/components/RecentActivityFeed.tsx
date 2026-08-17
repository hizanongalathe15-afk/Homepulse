'use client'

import { useEffect, useState } from 'react'
import { Bell, UserPlus, FileText, CreditCard, Settings, Shield, type LucideIcon } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'
import { adminDashboardService } from '@/services/adminDashboard.service'

const iconMap: Record<string, LucideIcon> = {
  property: FileText,
  payment: CreditCard,
  user: UserPlus,
  dispute: Shield,
  system: Settings,
  notification: Bell,
}

export default function RecentActivityFeed() {
  const [activities, setActivities] = useState<Array<{ id: string; type: string; message: string; timestamp: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await adminDashboardService.getStats()
        setActivities(data.recentActivity || [])
      } catch (err) {
        setError('Failed to load activity')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [])

  if (loading) {
    return (
      <SectionCard title="Recent Activity" description="Latest events across the platform">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </SectionCard>
    )
  }

  if (error) {
    return (
      <SectionCard title="Recent Activity" description="Latest events across the platform">
        <div className="text-center text-red-500 py-4">{error}</div>
      </SectionCard>
    )
  }

  return (
    <SectionCard title="Recent Activity" description="Latest events across the platform">
      <div className="divide-y divide-slate-100">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type.toLowerCase()] || Bell
          return (
            <div key={activity.id} className="flex items-start gap-3 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">{activity.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4">
        <AdminButton variant="outline" size="sm" className="w-full">
          View all activity
        </AdminButton>
      </div>
    </SectionCard>
  )
}
