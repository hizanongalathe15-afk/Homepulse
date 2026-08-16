'use client'

import { useEffect } from 'react'
import { Users, UserPlus, Activity, Repeat } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { useRegisterLiveMetric, useLiveMetric } from '@/contexts/LiveMetricsContext'

const metrics = [
  {
    id: 'analytics-total-users',
    label: 'Total Users',
    initialValue: 48291,
    decimals: 0,
    min: 42000,
    max: 55000,
    volatility: 150,
    isLive: true,
    trend: 'up' as const,
    trendValue: '12.4%',
    icon: Users,
    sub: 'vs last month',
  },
  {
    id: 'analytics-active-users',
    label: 'Active Users',
    initialValue: 32844,
    decimals: 0,
    min: 28000,
    max: 38000,
    volatility: 120,
    isLive: true,
    trend: 'up' as const,
    trendValue: '8.1%',
    icon: Activity,
    sub: '30-day active',
  },
  {
    id: 'analytics-new-users',
    label: 'New This Month',
    initialValue: 3127,
    decimals: 0,
    min: 2500,
    max: 4000,
    volatility: 80,
    isLive: false,
    trend: 'up' as const,
    trendValue: '5.6%',
    icon: UserPlus,
    sub: 'sign-ups',
  },
  {
    id: 'analytics-retention',
    label: 'Retention Rate',
    initialValue: 71.2,
    decimals: 1,
    suffix: '%',
    min: 65,
    max: 80,
    volatility: 0.5,
    isLive: false,
    trend: 'neutral' as const,
    trendValue: '0.3%',
    icon: Repeat,
    sub: '90-day cohort',
  },
]

function MetricCard(props: (typeof metrics)[number]) {
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

export default function UserMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.id} {...m} />
      ))}
    </div>
  )
}
