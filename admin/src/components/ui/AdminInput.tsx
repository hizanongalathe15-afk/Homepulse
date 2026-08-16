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
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <input
          className={`admin-input ${error ? 'border-red-500 focus-visible:ring-red-500' : ''} ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

AdminInput.displayName = 'AdminInput'

export { AdminInput }
