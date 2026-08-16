'use client'

import { useEffect } from 'react'
import { ShieldAlert, Siren, ClipboardX, TrendingDown } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { useRegisterLiveMetric, useLiveMetric } from '@/contexts/LiveMetricsContext'

const metrics = [
  {
    id: 'analytics-sos-alerts',
    label: 'SOS Alerts (30d)',
    initialValue: 84,
    decimals: 0,
    min: 60,
    max: 110,
    volatility: 5,
    isLive: true,
    trend: 'down' as const,
    trendValue: '12%',
    icon: Siren,
    sub: 'fewer than last month',
  },
  {
    id: 'analytics-reported-incidents',
    label: 'Reported Incidents',
    initialValue: 312,
    decimals: 0,
    min: 250,
    max: 380,
    volatility: 10,
    isLive: true,
    trend: 'down' as const,
    trendValue: '8%',
    icon: ShieldAlert,
    sub: 'all incident types',
  },
  {
    id: 'analytics-open-investigations',
    label: 'Open Investigations',
    initialValue: 23,
    decimals: 0,
    min: 15,
    max: 35,
    volatility: 2,
    isLive: false,
    trend: 'neutral' as const,
    trendValue: '5',
    icon: ClipboardX,
    sub: 'in progress',
  },
  {
    id: 'analytics-serious-incidents',
    label: 'Serious Incidents',
    initialValue: 9,
    decimals: 0,
    min: 5,
    max: 15,
    volatility: 1,
    isLive: false,
    trend: 'down' as const,
    trendValue: '31%',
    icon: TrendingDown,
    sub: 'critical only',
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

export default function IncidentMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.id} {...m} />
      ))}
    </div>
  )
}
