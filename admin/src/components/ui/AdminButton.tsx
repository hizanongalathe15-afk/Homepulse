'use client'

import { forwardRef } from 'react'

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]'

    const variants = {
      default: 'bg-command-cyan text-command-bg hover:bg-command-cyan/90 shadow-[var(--glow-cyan)]',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
      destructive: 'bg-command-crimson text-white hover:bg-command-crimson/90 shadow-[var(--glow-crimson)]',
      outline: 'border border-border bg-transparent hover:bg-white/5 text-foreground',
      ghost: 'hover:bg-white/5 text-foreground',
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
