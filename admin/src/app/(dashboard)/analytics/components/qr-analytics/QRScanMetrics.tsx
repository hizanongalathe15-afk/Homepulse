'use client'

import { useEffect } from 'react'
import { QrCode, ScanLine, MousePointerClick, Percent, type LucideIcon } from 'lucide-react'
import { StatCard } from '@/components/features/StatCard'
import { useRegisterLiveMetric, useLiveMetric } from '@/contexts/LiveMetricsContext'

const metrics = [
  {
    id: 'analytics-total-qr',
    label: 'Total QR Codes',
    initialValue: 12480,
    decimals: 0,
    min: 11000,
    max: 14000,
    volatility: 80,
    isLive: false,
    trend: 'up' as const,
    trendValue: '5.2%',
    icon: QrCode,
    sub: 'active codes',
  },
  {
    id: 'analytics-total-scans',
    label: 'Total Scans',
    initialValue: 346920,
    decimals: 0,
    min: 300000,
    max: 400000,
    volatility: 500,
    isLive: true,
    trend: 'up' as const,
    trendValue: '18.4%',
    icon: ScanLine,
    sub: 'all time',
  },
  {
    id: 'analytics-scans-7d',
    label: 'Scans (7d)',
    initialValue: 24183,
    decimals: 0,
    min: 20000,
    max: 28000,
    volatility: 300,
    isLive: true,
    trend: 'up' as const,
    trendValue: '9.7%',
    icon: MousePointerClick,
    sub: 'this week',
  },
  {
    id: 'analytics-avg-conversion',
    label: 'Avg. Conversion',
    initialValue: 11.2,
    decimals: 1,
    suffix: '%',
    min: 9,
    max: 14,
    volatility: 0.25,
    isLive: false,
    trend: 'up' as const,
    trendValue: '1.3%',
    icon: Percent,
    sub: 'scan to action',
  },
]

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

export default function QRScanMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.id} {...m} />
      ))}
    </div>
  )
}
