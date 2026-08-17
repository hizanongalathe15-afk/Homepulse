'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'flat' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
}: GlassCardProps) {
  const baseClass = cn(
    'ds-card',
    paddingMap[padding],
    hover && 'cursor-pointer',
    className
  )

  return (
    <div className={baseClass} onClick={onClick}>
      {children}
    </div>
  )
}
