'use client'

import { useEffect, useState } from 'react'
import { DollarSign, Users, Home, AlertTriangle, type LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { adminDashboardService, type DashboardStats } from '@/services/adminDashboard.service'

interface StatCardWrapperProps {
  id: string
  label: string
  initialValue: number
  prefix?: string
  suffix?: string
  decimals: number
  min: number
  max: number
  volatility: number
  isLive: boolean
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  icon: LucideIcon
  sub: string
}

function StatCardWrapper(props: StatCardWrapperProps) {
  const {
    id,
    label,
    initialValue,
    prefix,
    suffix,
    decimals,
    min,
    max,
    volatility,
    isLive,
    trend,
    trendValue,
    icon,
    sub,
  } = props

  return (
    <StatCard
      label={label}
      value={initialValue}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      trend={trend}
      trendValue={trendValue}
      icon={icon}
      sub={sub}
      live={isLive}
    />
  )
}

export default function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminDashboardService.getStats()
        setStats(data)
      } catch (err) {
        setError('Failed to load dashboard stats')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-6 border-glow animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-2" />
            <div className="h-8 bg-muted rounded w-32" />
          </div>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full text-center text-red-500">{error || 'No data available'}</div>
      </div>
    )
  }

  const statCards = [
    {
      id: 'overview-revenue',
      label: 'Total Revenue (MTD)',
      initialValue: stats.totalRevenue,
      prefix: 'KSh ',
      decimals: 0,
      min: 0,
      max: stats.totalRevenue * 1.5,
      volatility: stats.totalRevenue * 0.05,
      isLive: false,
      trend: 'up' as const,
      trendValue: '12.5%',
      icon: DollarSign,
      sub: 'vs last month',
    },
    {
      id: 'overview-users',
      label: 'Total Users',
      initialValue: stats.totalUsers,
      decimals: 0,
      min: 0,
      max: stats.totalUsers * 1.2,
      volatility: stats.totalUsers * 0.02,
      isLive: true,
      trend: 'up' as const,
      trendValue: '8.2%',
      icon: Users,
      sub: 'active this month',
    },
    {
      id: 'overview-properties',
      label: 'Total Properties',
      initialValue: stats.totalProperties,
      decimals: 0,
      min: 0,
      max: stats.totalProperties * 1.2,
      volatility: stats.totalProperties * 0.01,
      isLive: false,
      trend: 'up' as const,
      trendValue: '3.1%',
      icon: Home,
      sub: 'listed',
    },
    {
      id: 'overview-disputes',
      label: 'Pending Approvals',
      initialValue: stats.pendingApprovals,
      decimals: 0,
      min: 0,
      max: Math.max(stats.pendingApprovals * 2, 50),
      volatility: 2,
      isLive: true,
      trend: stats.pendingApprovals > 0 ? 'down' as const : 'neutral' as const,
      trendValue: stats.pendingApprovals.toString(),
      icon: AlertTriangle,
      sub: 'requires attention',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <StatCardWrapper key={stat.id} {...stat} />
      ))}
    </div>
  )
}
