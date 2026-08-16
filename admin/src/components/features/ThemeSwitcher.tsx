'use client'

import { useState, useRef, useEffect } from 'react'
import { useCommandTheme } from '@/contexts/AdminThemeContext'
import { Monitor, Sun, Shield } from 'lucide-react'

const themes = [
  {
    value: 'cyber-dark',
    label: 'Cyber Dark',
    description: 'Deep dark with neon accents',
    icon: Monitor,
  },
  {
    value: 'clean-glass-light',
    label: 'Clean Glass Light',
    description: 'Frosted white with deep blue',
    icon: Sun,
  },
  {
    value: 'high-contrast-tactical',
    label: 'Tactical',
    description: 'High-contrast ops mode',
    icon: Shield,
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useCommandTheme()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeTheme = themes.find((t) => t.value === theme) || themes[0]
  const ActiveIcon = activeTheme.icon

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
      >
        <ActiveIcon size={16} />
        <span className="hidden sm:inline">{activeTheme.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 glass-panel z-50 py-1">
          {themes.map((t) => {
            const Icon = t.icon
            const isActive = theme === t.value
            return (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value as any)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <div>
                  <div className="font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.description}</div>
                </div>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
