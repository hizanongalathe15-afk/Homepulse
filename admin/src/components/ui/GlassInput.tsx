'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className = '', label, hint, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="ds-label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'ds-input',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'ds-input-error',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="ds-error">{error}</p>}
        {hint && !error && <p className="ds-hint">{hint}</p>}
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'

export { GlassInput }
