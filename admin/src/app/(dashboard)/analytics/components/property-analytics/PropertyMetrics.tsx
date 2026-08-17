'use client'

import { useEffect } from 'react'
import { Home, Clock, Building2, DollarSign, type LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { useRegisterLiveMetric, useLiveMetric } from '@/contexts/LiveMetricsContext'

interface MetricCardProps {
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

function MetricCard(props: MetricCardProps) {
  useRegisterLiveMetric(props.id, {
    initialValue: props.initialValue,
    prefix: props.prefix,
    suffix: props.suffix,
    decimals: props.decimals,
    min: props.min,
    max: props.max,
    volatility: props.volatility,
    isLive: props.isLive,
  })
  const metric = useLiveMetric(props.id)

  if (!metric) {
    const display = props.prefix
      ? `${props.prefix}${props.initialValue.toLocaleString()}${props.suffix ?? ''}`
      : props.initialValue.toLocaleString()
    return (
      <StatCard
        label={props.label}
        value={display}
        trend={props.trend}
        trendValue={props.trendValue}
        icon={props.icon}
        sub={props.sub}
        live={props.isLive}
      />
    )
  }

  return (
    <StatCard
      label={props.label}
      value={metric.value}
      prefix={props.prefix}
      suffix={props.suffix}
      decimals={props.decimals}
      trend={props.trend}
      trendValue={props.trendValue}
      icon={props.icon}
      sub={props.sub}
      animated
      live={metric.isLive}
      flickering={metric.flickering}
    />
  )
}

const metrics = [
  {
    id: 'analytics-total-properties',
    label: 'Total Properties',
    initialValue: 18904,
    decimals: 0,
    min: 17000,
    max: 21000,
    volatility: 60,
    isLive: true,
    trend: 'up' as const,
    trendValue: '3.2%',
    icon: Home,
    sub: 'all listings',
  },
  {
    id: 'analytics-pending-approval',
    label: 'Pending Approval',
    initialValue: 342,
    decimals: 0,
    min: 250,
    max: 450,
    volatility: 12,
    isLive: true,
    trend: 'down' as const,
    trendValue: '9.1%',
    icon: Clock,
    sub: 'awaiting review',
  },
  {
    id: 'analytics-occupancy',
    label: 'Occupancy Rate',
    initialValue: 86.4,
    decimals: 1,
    suffix: '%',
    min: 80,
    max: 92,
    volatility: 0.4,
    isLive: false,
    trend: 'up' as const,
    trendValue: '1.8%',
    icon: Building2,
    sub: 'active units',
  },
  {
    id: 'analytics-avg-rent',
    label: 'Avg. Monthly Rent',
    initialValue: 1240,
    prefix: '$',
    decimals: 0,
    min: 1100,
    max: 1400,
    volatility: 15,
    isLive: false,
    trend: 'up' as const,
    trendValue: '2.4%',
    icon: DollarSign,
    sub: 'market average',
  },
]

export default function PropertyMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.id} {...m} />
      ))}
    </div>
  )
}
