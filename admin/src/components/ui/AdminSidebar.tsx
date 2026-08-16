'use client'

import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative overflow-hidden',
              isActive
                ? 'bg-slate-800/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            )}
          >
            <span
              className={cn(
                'absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 bg-cyan-400 rounded-r transition-all duration-200',
                isActive && 'w-1 h-6'
              )}
            />
            <item.icon size={20} />
            <span>{item.name}</span>
          </a>
        )
      })}
    </nav>
  )
}
