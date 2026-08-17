'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedCounter } from '@/components/features/AnimatedCounter'
import { LivePulseIndicator } from '@/components/features/LivePulseIndicator'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  animated?: boolean
  live?: boolean
  flickering?: boolean
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  trendValue,
  animated = false,
  live = false,
  flickering = false,
  prefix,
  suffix,
  decimals = 0,
  className = '',
}: StatCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-command-emerald'
      : trend === 'down'
        ? 'text-command-crimson'
        : 'text-muted-foreground'

  const displayValue =
    typeof value === 'number'
      ? animated
        ? (
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          )
        : value.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
      : value

  return (
    <div
      className={cn(
        'glass-card bg-radial-glow p-6 border-glow stat-card-hover stat-card-glow transition-all duration-500',
        flickering && 'metric-flicker',
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {live && <LivePulseIndicator />}
          </div>
          {Icon && <Icon size={18} className="text-command-cyan" />}
        </div>
        <p className="text-2xl font-bold text-foreground mt-1 text-glow-cyan">{displayValue}</p>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
               <span className={cn(
                 'text-xs font-medium transition-colors duration-500 flex items-center gap-1',
                 flickering ? 'text-command-emerald' : trendColor
               )}>
              {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />} {trendValue}
            </span>
          )}
          {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        </div>
      </div>
    </div>
  )
}
