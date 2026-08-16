'use client'

import { cn } from '@/lib/utils'

interface LivePulseIndicatorProps {
  color?: 'green' | 'red' | 'blue' | 'yellow'
  className?: string
}

const colorClasses = {
  green: 'bg-emerald-500 shadow-emerald-500/60',
  red: 'bg-red-500 shadow-red-500/60',
  blue: 'bg-sky-500 shadow-sky-500/60',
  yellow: 'bg-amber-500 shadow-amber-500/60',
}

export function LivePulseIndicator({ color = 'green', className }: LivePulseIndicatorProps) {
  return (
    <span className={cn('relative inline-flex h-2.5 w-2.5', className)}>
      <span
        className={cn(
          'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
          colorClasses[color]
        )}
      />
      <span
        className={cn(
          'relative inline-flex rounded-full h-2.5 w-2.5',
          colorClasses[color]
        )}
      />
    </span>
  )
}
