'use client'

import { cn } from '@/lib/utils'

interface GlassSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

export function GlassSwitch({ checked, onCheckedChange, disabled, label, className }: GlassSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn('ds-switch', disabled && 'opacity-50 cursor-not-allowed', className)}
    >
      <span className="ds-switch-thumb" />
    </button>
  )
}
