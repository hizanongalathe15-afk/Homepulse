'use client'

import { useEffect } from 'react'
import { Headphones, MessageCircle, Clock, Star, type LucideIcon } from 'lucide-react'
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

const stats = [
  {
    id: 'support-open-tickets',
    label: 'Open Tickets',
    initialValue: 142,
    decimals: 0,
    min: 100,
    max: 200,
    volatility: 8,
    isLive: false,
    trend: 'down' as const,
    trendValue: '12%',
    icon: Headphones,
    sub: 'awaiting response',
  },
  {
    id: 'support-avg-response',
    label: 'Avg Response Time',
    initialValue: 2.4,
    decimals: 1,
    suffix: 'h',
    min: 1.5,
    max: 4,
    volatility: 0.2,
    isLive: false,
    trend: 'up' as const,
    trendValue: '0.3h',
    icon: Clock,
    sub: 'last 7 days',
  },
  {
    id: 'support-live-chat',
    label: 'Live Chat Sessions',
    initialValue: 38,
    decimals: 0,
    min: 20,
    max: 60,
    volatility: 4,
    isLive: true,
    trend: 'up' as const,
    trendValue: '8',
    icon: MessageCircle,
    sub: 'active now',
  },
  {
    id: 'support-csat',
    label: 'CSAT Score',
    initialValue: 4.6,
    decimals: 1,
    min: 4,
    max: 5,
    volatility: 0.1,
    isLive: false,
    trend: 'up' as const,
    trendValue: '0.2',
    icon: Star,
    sub: 'out of 5.0',
  },
]

export default function SupportAnalytics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <MetricCard key={stat.id} {...stat} />
      ))}
    </div>
  )
}
