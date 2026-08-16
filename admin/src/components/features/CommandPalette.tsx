'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { soundEngine } from '@/utils/admin.sound'
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Users,
  Home,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Image,
  Wallet,
  Megaphone,
  FileBarChart,
  ClipboardList,
  Shield,
  MessageSquare,
  HelpCircle,
  Settings,
  LayoutDashboard,
  Bell,
  Command,
} from 'lucide-react'

interface CommandItem {
  label: string
  href?: string
  icon: React.ReactNode
  category: string
  action?: () => void
}

const commands: CommandItem[] = [
  { label: 'Overview', href: '/overview', icon: <LayoutDashboard size={16} />, category: 'Navigation' },
  { label: 'Analytics', href: '/analytics', icon: <FileBarChart size={16} />, category: 'Navigation' },
  { label: 'Users', href: '/users', icon: <Users size={16} />, category: 'Navigation' },
  { label: 'Properties', href: '/properties', icon: <Home size={16} />, category: 'Navigation' },
  { label: 'Verifications', href: '/verifications', icon: <ShieldCheck size={16} />, category: 'Navigation' },
  { label: 'Disputes', href: '/disputes', icon: <AlertTriangle size={16} />, category: 'Navigation' },
  { label: 'QR Management', href: '/qr-management', icon: <QrCode size={16} />, category: 'Navigation' },
  { label: 'Banner Management', href: '/banner-management', icon: <Image size={16} />, category: 'Navigation' },
  { label: 'Escrow Management', href: '/escrow-management', icon: <Wallet size={16} />, category: 'Navigation' },
  { label: 'Payments', href: '/payments', icon: <Wallet size={16} />, category: 'Navigation' },
  { label: 'Campaigns', href: '/campaigns', icon: <Megaphone size={16} />, category: 'Navigation' },
  { label: 'Content Management', href: '/content-management', icon: <FileText size={16} />, category: 'Navigation' },
  { label: 'Reports', href: '/reports', icon: <FileBarChart size={16} />, category: 'Navigation' },
  { label: 'Notifications', href: '/notifications', icon: <Bell size={16} />, category: 'Navigation' },
  { label: 'Audit Logs', href: '/audit-logs', icon: <ClipboardList size={16} />, category: 'Navigation' },
  { label: 'Safety', href: '/safety', icon: <Shield size={16} />, category: 'Navigation' },
  { label: 'Fraud Detection', href: '/fraud-detection', icon: <Shield size={16} />, category: 'Navigation' },
  { label: 'Feedback', href: '/feedback', icon: <MessageSquare size={16} />, category: 'Navigation' },
  { label: 'Support', href: '/support', icon: <HelpCircle size={16} />, category: 'Navigation' },
  { label: 'Settings', href: '/settings', icon: <Settings size={16} />, category: 'Navigation' },
  { label: 'Toggle Theme', category: 'Actions', action: () => {} },
  { label: 'Export Data', category: 'Actions', action: () => {} },
  { label: 'View Notifications', category: 'Actions', action: () => {} },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => {
          const next = !prev
          if (next) {
            soundEngine.play('switch')
            setTimeout(() => inputRef.current?.focus(), 50)
          }
          return next
        })
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = query
    ? commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()) || cmd.category.toLowerCase().includes(query.toLowerCase()))
    : commands

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = useCallback(
    (cmd: CommandItem) => {
      soundEngine.play('click')
      if (cmd.href) {
        router.push(cmd.href)
      }
      cmd.action?.()
      setOpen(false)
      setQuery('')
    },
    [router]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const flat = Object.values(grouped).flat()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, flat.length - 1))
      soundEngine.play('switch')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
      soundEngine.play('switch')
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[selectedIndex]) handleSelect(flat[selectedIndex])
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden z-10">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search navigation, actions..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <kbd className="px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-2">
              <p className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">{category}</p>
              {items.map((cmd, idx) => {
                const globalIdx = Object.values(grouped).flat().indexOf(cmd)
                const isActive = globalIdx === selectedIndex
                const isCurrent = cmd.href && pathname === cmd.href
                return (
                  <button
                    key={cmd.label}
                    onClick={() => handleSelect(cmd)}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50',
                      isCurrent && 'text-cyan-600'
                    )}
                  >
                    <span className={cn('shrink-0', isCurrent && 'text-cyan-500')}>{cmd.icon}</span>
                    <span className="flex-1 text-left font-medium">{cmd.label}</span>
                    {isCurrent && <ArrowUpRight size={14} className="text-cyan-500" />}
                    {cmd.href && <ArrowRight size={14} className="text-slate-400" />}
                  </button>
                )
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-slate-400">No results found for "{query}"</div>
          )}
        </div>
        <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-500">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-500">↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-500">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  )
}
