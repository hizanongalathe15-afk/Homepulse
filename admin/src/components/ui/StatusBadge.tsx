'use client'

import { type VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        destructive: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  label: string
}

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  return <span className={badgeVariants({ variant })}>{label}</span>
}
