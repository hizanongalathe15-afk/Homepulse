'use client'

import { type LucideIcon } from 'lucide-react'
import { AdminButton } from './AdminButton'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && <Icon size={48} className="text-slate-300 mb-4" />}
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-4 max-w-sm">{description}</p>}
      {action && (
        <AdminButton onClick={action.onClick}>
          {action.label}
        </AdminButton>
      )}
    </div>
  )
}
