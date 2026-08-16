'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/features/ThemeSwitcher'
import { CommandPalette } from '@/components/features/CommandPalette'
import { PulseAI } from '@/components/features/PulseAI'
import { SoundToggle } from '@/components/ui/SoundToggle'
import { CursorGlow } from '@/components/features/CursorGlow'
import { soundEngine } from '@/utils/admin.sound'
import {
  LayoutDashboard,
  Users,
  Home,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Image,
  Wallet,
  Megaphone,
  FileText,
  Bell,
  Settings,
  FileBarChart,
  ClipboardList,
  Shield,
  MessageSquare,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Command,
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: FileBarChart },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Properties', href: '/properties', icon: Home },
  { name: 'Verifications', href: '/verifications', icon: ShieldCheck },
  { name: 'Disputes', href: '/disputes', icon: AlertTriangle },
  { name: 'QR Management', href: '/qr-management', icon: QrCode },
  { name: 'Banner Management', href: '/banner-management', icon: Image },
  { name: 'Escrow Management', href: '/escrow-management', icon: Wallet },
  { name: 'Payments', href: '/payments', icon: Wallet },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Content Management', href: '/content-management', icon: FileText },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
  { name: 'Safety', href: '/safety', icon: Shield },
  { name: 'Fraud Detection', href: '/fraud-detection', icon: Shield },
  { name: 'Feedback', href: '/feedback', icon: MessageSquare },
  { name: 'Support', href: '/support', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-command-bg">
      <CursorGlow />
      <CommandPalette />
      <PulseAI />
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col border-r border-white/10',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/overview" className="text-lg font-bold text-glow-cyan">
            HomePulse
          </Link>
          <button
            onClick={() => {
              setSidebarOpen(false)
              soundEngine.play('switch')
            }}
            className="p-1 rounded-md hover:bg-white/10 transition-colors lg:hidden"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setSidebarOpen(false)
                  soundEngine.play('click')
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/login"
            onClick={() => soundEngine.play('click')}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 glass-panel flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => {
              setSidebarOpen(true)
              soundEngine.play('switch')
            }}
            className="p-2 rounded-md hover:bg-white/5 transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg font-semibold text-foreground capitalize hidden lg:block">
              {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))
                soundEngine.play('switch')
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Command size={12} />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-border text-muted-foreground">⌘K</kbd>
            </button>
            <ThemeSwitcher />
            <SoundToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
