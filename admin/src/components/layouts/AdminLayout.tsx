'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={cn(
          'bg-slate-900 text-white transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen && (
            <Link href="/overview" className="text-lg font-bold">
              HomePulse
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
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
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <h1 className="text-xl font-semibold text-slate-900 capitalize">
            {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Admin User</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
