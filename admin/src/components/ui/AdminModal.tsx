'use client'

import { forwardRef } from 'react'

interface AdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
}

const AdminModal = forwardRef<HTMLDivElement, AdminModalProps>(
  ({ open, onOpenChange, title, description, children }, ref) => {
    if (!open) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={ref}
          className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          {(title || description) && (
            <div className="px-6 py-4 border-b border-slate-200">
              {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
              {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }
)

AdminModal.displayName = 'AdminModal'

export { AdminModal }
