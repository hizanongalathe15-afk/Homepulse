'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Building2, MessageSquare, Calendar, CreditCard,
  Shield, Heart, Search, User, Bell, Settings, LogOut, ChevronRight,
  Compass,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Overview', icon: Home, href: '/dashboard' },
  { name: 'Properties', icon: Building2, href: '/properties' },
  { name: 'Messages', icon: MessageSquare, href: '/messages', badge: 4 },
  { name: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
  { name: 'Payments', icon: CreditCard, href: '/dashboard/payments' },
  { name: 'Escrow', icon: Shield, href: '/checkout' },
  { name: 'Favorites', icon: Heart, href: '/dashboard/favorites' },
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

const bottomNavItems = [
  { name: 'Home', icon: Home, href: '/dashboard' },
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'Messages', icon: MessageSquare, href: '/messages', badge: 4 },
  { name: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
  { name: 'Profile', icon: User, href: '/dashboard/settings' },
]

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-mesh">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex flex-col w-72 glass-sidebar h-screen sticky top-0 z-40">
          <div className="p-6 pb-4">
            <Link href="/landing" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
                <Home size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">HomeSpot</h1>
                <p className="text-xs text-slate-500">Find your perfect home</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                    active ? 'btn-gradient text-white shadow-lg shadow-indigo-500/25' : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  )}
                >
                  <Icon size={19} className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className={cn('min-w-[22px] h-[22px] inline-flex items-center justify-center text-[11px] font-bold rounded-full px-1.5', active ? 'bg-white/25 text-white' : 'bg-gradient-to-br from-rose-500 to-pink-500 text-white')}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
            <div className="mt-4 pt-4 border-t border-white/60">
              <Link href="/landing" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all">
                <LogOut size={19} />
                <span>Logout</span>
              </Link>
            </div>
          </nav>

          <div className="p-4 border-t border-white/60">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">DM</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">Daniel Mwangi</p>
                  <p className="text-xs text-slate-500 truncate">daniel.mwangi@email.com</p>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-24 lg:pb-8">
          <div className="lg:hidden sticky top-0 z-30 glass-header px-4 py-3 flex items-center justify-between">
            <Link href="/landing" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center"><Home size={18} className="text-white" /></div>
              <span className="font-bold text-gradient">HomeSpot</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/notifications" className="relative p-2 rounded-xl glass"><Bell size={19} /><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" /></Link>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">DM</div>
            </div>
          </div>
          {children}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2">
        <div className="glass-strong rounded-2xl shadow-2xl py-2 px-2">
          <div className="grid grid-cols-5 gap-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.name} href={item.href} className={cn('relative flex flex-col items-center gap-1 py-2 rounded-xl transition-all', active ? 'text-indigo-600' : 'text-slate-400')}>
                  {active && <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-indigo-500/10 to-indigo-500/5" />}
                  <div className="relative">
                    <Icon size={21} className={cn('relative z-10', active && 'scale-110')} />
                    {item.badge && <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] text-[10px] font-bold text-white rounded-full bg-gradient-to-br from-rose-500 to-pink-500 px-1">{item.badge}</span>}
                  </div>
                  <span className={cn('text-[10px] font-semibold relative z-10', active && 'text-indigo-600')}>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
