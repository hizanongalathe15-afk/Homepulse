'use client'

import { useEffect } from 'react'
import { Megaphone, MousePointerClick, Target, TrendingUp, type LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { useRegisterLiveMetric, useLiveMetric } from '@/contexts/LiveMetricsContext'

interface CampaignMetric {
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

const metrics: CampaignMetric[] = [
  {
    id: 'analytics-active-campaigns',
    label: 'Active Campaigns',
    initialValue: 18,
    decimals: 0,
    min: 12,
    max: 25,
    volatility: 1.5,
    isLive: true,
    trend: 'up' as const,
    trendValue: '2',
    icon: Megaphone,
    sub: 'running now',
  },
  {
    id: 'analytics-avg-ctr',
    label: 'Avg. CTR',
    initialValue: 3.8,
    decimals: 1,
    suffix: '%',
    min: 3,
    max: 5,
    volatility: 0.15,
    isLive: false,
    trend: 'up' as const,
    trendValue: '0.4%',
    icon: MousePointerClick,
    sub: 'vs last month',
  },
  {
    id: 'analytics-conversion-rate',
    label: 'Conversion Rate',
    initialValue: 12.6,
    decimals: 1,
    suffix: '%',
    min: 10,
    max: 16,
    volatility: 0.3,
    isLive: false,
    trend: 'up' as const,
    trendValue: '1.1%',
    icon: Target,
    sub: 'click to lead',
  },
  {
    id: 'analytics-campaign-roi',
    label: 'Campaign ROI',
    initialValue: 4.2,
    decimals: 1,
    suffix: 'x',
    min: 3.5,
    max: 5.5,
    volatility: 0.2,
    isLive: false,
    trend: 'up' as const,
    trendValue: '0.6x',
    icon: TrendingUp,
    sub: 'return on spend',
  },
]

function MetricCard(props: CampaignMetric) {
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

export default function CampaignMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.id} {...m} />
      ))}
    </div>
  )
}
