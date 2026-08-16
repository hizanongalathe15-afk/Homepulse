'use client'

import { forwardRef } from 'react'

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-slate-200 bg-transparent hover:bg-slate-100',
      ghost: 'hover:bg-slate-100',
    }

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3 text-sm',
      lg: 'h-11 px-8 text-lg',
      icon: 'h-10 w-10',
    }

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)

AdminButton.displayName = 'AdminButton'

export { AdminButton }
