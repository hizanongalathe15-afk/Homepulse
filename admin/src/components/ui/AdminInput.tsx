'use client'

import { forwardRef } from 'react'

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        <input
          className={`admin-input ${error ? 'border-command-crimson focus-visible:ring-command-crimson' : ''} ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-command-crimson">{error}</p>}
      </div>
    )
  }
)

AdminInput.displayName = 'AdminInput'

export { AdminInput }
