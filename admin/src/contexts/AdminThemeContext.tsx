'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CommandTheme = 'cyber-dark' | 'clean-glass-light' | 'high-contrast-tactical'

export interface CommandThemeContextValue {
  theme: CommandTheme
  setTheme: (theme: CommandTheme) => void
}

export const CommandThemeContext = createContext<CommandThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = 'homepulse-admin-theme'

export function CommandThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<CommandTheme>('cyber-dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'cyber-dark' || stored === 'clean-glass-light' || stored === 'high-contrast-tactical') {
        setTheme(stored)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = window.document.documentElement
    root.classList.remove('theme-cyber-dark', 'theme-clean-glass-light', 'theme-high-contrast-tactical')
    root.classList.add(`theme-${theme}`)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {}
  }, [theme, mounted])

  return (
    <CommandThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </CommandThemeContext.Provider>
  )
}

export function useCommandTheme() {
  const context = useContext(CommandThemeContext)
  if (context === undefined) {
    throw new Error('useCommandTheme must be used within a CommandThemeProvider')
  }
  return context
}
