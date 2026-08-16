'use client'

import { useEffect } from 'react'
import { DollarSign, Users, Home, AlertTriangle } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { useRegisterLiveMetric, useLiveMetric } from '@/contexts/LiveMetricsContext'

const stats = [
  {
    id: 'overview-revenue',
    label: 'Total Revenue (MTD)',
    initialValue: 45678,
    prefix: '$',
    decimals: 0,
    min: 40000,
    max: 60000,
    volatility: 500,
    isLive: false,
    trend: 'up' as const,
    trendValue: '12.5%',
    icon: DollarSign,
    sub: 'vs last month',
  },
  {
    id: 'overview-users',
    label: 'Total Users',
    initialValue: 12345,
    decimals: 0,
    min: 10000,
    max: 15000,
    volatility: 100,
    isLive: true,
    trend: 'up' as const,
    trendValue: '8.2%',
    icon: Users,
    sub: 'active this month',
  },
  {
    id: 'overview-properties',
    label: 'Total Properties',
    initialValue: 8901,
    decimals: 0,
    min: 8000,
    max: 10000,
    volatility: 50,
    isLive: false,
    trend: 'up' as const,
    trendValue: '3.1%',
    icon: Home,
    sub: 'listed',
  },
  {
    id: 'overview-disputes',
    label: 'Active Disputes',
    initialValue: 23,
    decimals: 0,
    min: 15,
    max: 35,
    volatility: 3,
    isLive: true,
    trend: 'down' as const,
    trendValue: '4',
    icon: AlertTriangle,
    sub: 'requires attention',
  },
]

function StatCardWrapper({
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
}: (typeof stats)[number]) {
  useRegisterLiveMetric(id, {
    initialValue,
    prefix,
    suffix,
    decimals,
    min,
    max,
    volatility,
    isLive,
  })
  const metric = useLiveMetric(id)

  if (!metric) {
    return (
      <StatCard
        label={label}
        value={prefix ? `${prefix}${initialValue.toLocaleString()}${suffix ?? ''}` : initialValue.toLocaleString()}
        trend={trend}
        trendValue={trendValue}
        icon={icon}
        sub={sub}
        live={isLive}
      />
    )
  }

  return (
    <StatCard
      label={label}
      value={metric.value}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      trend={trend}
      trendValue={trendValue}
      icon={icon}
      sub={sub}
      animated
      live={isLive}
      flickering={metric.flickering}
    />
  )
}

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCardWrapper key={stat.id} {...stat} />
      ))}
    </div>
  )
}
