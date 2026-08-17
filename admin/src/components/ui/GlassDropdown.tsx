'use client'

import { type ReactNode, useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GlassDropdownProps {
  trigger: ReactNode
  items: {
    label: string
    icon?: ReactNode
    onClick?: () => void
    danger?: boolean
    disabled?: boolean
  }[]
  align?: 'left' | 'right'
  className?: string
}

export function GlassDropdown({ trigger, items, align = 'right', className }: GlassDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div ref={ref} className={cn('ds-dropdown', className)}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div className={cn('ds-dropdown-menu', align === 'left' && 'right-0 left-auto')}>
          {items.map((item, index) => (
            <button
              key={index}
              disabled={item.disabled}
              onClick={() => {
                item.onClick?.()
                setOpen(false)
              }}
              className={cn(
                'ds-dropdown-item',
                item.danger && 'ds-dropdown-item-danger'
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
