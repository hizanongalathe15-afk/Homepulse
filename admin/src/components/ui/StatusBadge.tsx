'use client'

import { type VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-white/10 text-slate-300 border border-white/10',
        success: 'bg-command-emerald/20 text-command-emerald border border-command-emerald/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        destructive: 'bg-command-crimson/20 text-command-crimson border border-command-crimson/30',
        info: 'bg-command-cyan/20 text-command-cyan border border-command-cyan/30',
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
