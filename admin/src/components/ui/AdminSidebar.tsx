'use client'

import { type LucideIcon } from 'lucide-react'

interface AdminSidebarProps {
  items: {
    name: string
    href: string
    icon: LucideIcon
  }[]
  activeItem?: string
}

export function AdminSidebar({ items, activeItem }: AdminSidebarProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const isActive = activeItem === item.href || activeItem?.startsWith(item.href + '/')
        return (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            )}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </a>
        )
      })}
    </nav>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
