'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassTooltipProps {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function GlassTooltip({ content, children, side = 'top', delay = 0 }: GlassTooltipProps) {
  return (
    <span
      className="ds-tooltip-wrapper"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
      <span className="ds-tooltip" style={{ top: side === 'bottom' ? 'auto' : undefined, bottom: side === 'bottom' ? 'calc(100% + 6px)' : undefined }}>
        {content}
      </span>
    </span>
  )
}
