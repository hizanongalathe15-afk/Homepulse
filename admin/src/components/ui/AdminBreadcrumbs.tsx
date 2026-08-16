'use client'

import { type LucideIcon } from 'lucide-react'

interface AdminBreadcrumbsProps {
  items: {
    label: string
    href?: string
    icon?: LucideIcon
  }[]
}

export function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-slate-300">/</span>}
          {item.icon && <item.icon size={14} />}
          {item.href ? (
            <a href={item.href} className="hover:text-slate-700 transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
