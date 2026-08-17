'use client'

import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GlassModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function GlassModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
}: GlassModalProps) {
  if (!open) return null

  return (
    <div className="ds-modal-overlay" onClick={() => onOpenChange(false)}>
      <div
        className={cn('ds-modal-panel', sizeMap[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="ds-modal-header">
            <div>
              {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
              {description && (
                <p className="mt-1 text-sm text-neutral-500">{description}</p>
              )}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="ds-modal-body">{children}</div>
        {footer && <div className="ds-modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
