'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'ds-badge',
  {
    variants: {
      variant: {
        default: 'ds-badge-default',
        primary: 'ds-badge-primary',
        success: 'ds-badge-success',
        warning: 'ds-badge-warning',
        error: 'ds-badge-error',
        info: 'ds-badge-info',
        accent: 'ds-badge-accent',
      },
      dot: {
        true: 'ds-badge-dot',
      },
    },
    defaultVariants: {
      variant: 'default',
      dot: false,
    },
  }
)

interface GlassBadgeProps
  extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  className?: string
}

export function GlassBadge({ variant, dot, children, className }: GlassBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, dot }), className)}>
      {children}
    </span>
  )
}
