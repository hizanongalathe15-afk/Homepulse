'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { soundEngine } from '@/utils/admin.sound'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  breadcrumbs: { label: string }[]
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/overview', icon: require('lucide-react').LayoutDashboard, breadcrumbs: [{ label: 'Dashboard' }, { label: 'Overview' }] },
  { name: 'Analytics', href: '/analytics', icon: require('lucide-react').FileBarChart, breadcrumbs: [{ label: 'Analytics Suite' }, { label: 'Overview' }] },
  { name: 'Users', href: '/users', icon: require('lucide-react').Users, breadcrumbs: [{ label: 'Users' }, { label: 'Team Management' }] },
  { name: 'Properties', href: '/properties', icon: require('lucide-react').Home, breadcrumbs: [{ label: 'Properties' }, { label: 'Listings Module' }] },
  { name: 'Verifications', href: '/verifications', icon: require('lucide-react').ShieldCheck, breadcrumbs: [{ label: 'Verifications' }, { label: 'Identity Engine' }] },
  { name: 'Disputes', href: '/disputes', icon: require('lucide-react').AlertTriangle, breadcrumbs: [{ label: 'Disputes' }, { label: 'Resolution Center' }] },
  { name: 'QR Management', href: '/qr-management', icon: require('lucide-react').QrCode, breadcrumbs: [{ label: 'QR Management' }, { label: 'Code Deployment' }] },
  { name: 'Banner Management', href: '/banner-management', icon: require('lucide-react').Image, breadcrumbs: [{ label: 'Banner Management' }, { label: 'Visual Assets' }] },
  { name: 'Escrow Management', href: '/escrow-management', icon: require('lucide-react').Wallet, breadcrumbs: [{ label: 'Escrow Management' }, { label: 'Transaction Suite' }] },
  { name: 'Payments', href: '/payments', icon: require('lucide-react').Wallet, breadcrumbs: [{ label: 'Payments' }, { label: 'Transaction Suite' }] },
  { name: 'Campaigns', href: '/campaigns', icon: require('lucide-react').Megaphone, breadcrumbs: [{ label: 'Campaigns' }, { label: 'Marketing Hub' }] },
  { name: 'Content Management', href: '/content-management', icon: require('lucide-react').FileText, breadcrumbs: [{ label: 'Content Management' }, { label: 'CMS' }] },
  { name: 'Reports', href: '/reports', icon: require('lucide-react').FileBarChart, breadcrumbs: [{ label: 'Reports' }, { label: 'Analytics Suite' }] },
  { name: 'Notifications', href: '/notifications', icon: require('lucide-react').Bell, breadcrumbs: [{ label: 'Notifications' }, { label: 'Alert Center' }] },
  { name: 'Audit Logs', href: '/audit-logs', icon: require('lucide-react').ClipboardList, breadcrumbs: [{ label: 'Audit Logs' }, { label: 'System Monitor' }] },
  { name: 'Safety', href: '/safety', icon: require('lucide-react').Shield, breadcrumbs: [{ label: 'Safety' }, { label: 'Protection Module' }] },
  { name: 'Fraud Detection', href: '/fraud-detection', icon: require('lucide-react').Shield, breadcrumbs: [{ label: 'Fraud Detection' }, { label: 'Security Grid' }] },
  { name: 'Feedback', href: '/feedback', icon: require('lucide-react').MessageSquare, breadcrumbs: [{ label: 'Feedback' }, { label: 'User Voice' }] },
  { name: 'Support', href: '/support', icon: require('lucide-react').HelpCircle, breadcrumbs: [{ label: 'Support' }, { label: 'Help Desk' }] },
  { name: 'Settings', href: '/settings', icon: require('lucide-react').Settings, breadcrumbs: [{ label: 'Settings' }, { label: 'Configuration' }] },
]

type SidebarMode = 'rotary' | 'dock'

export function SpatialSidebar({
  onBreadcrumbChange,
}: {
  onBreadcrumbChange?: (breadcrumbs: { label: string }[]) => void
}) {
  const [mode, setMode] = useState<SidebarMode>('rotary')
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const currentNav = navigation.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  )

  useEffect(() => {
    if (currentNav && onBreadcrumbChange) {
      onBreadcrumbChange(currentNav.breadcrumbs)
    }
    const idx = navigation.findIndex(
      (item) => pathname === item.href || pathname.startsWith(item.href + '/')
    )
    if (idx >= 0) setActiveIndex(idx)
  }, [pathname, currentNav, onBreadcrumbChange])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    setRotation((prev) => prev + e.deltaY * 0.15)
  }, [])

  useEffect(() => {
    const el = wheelRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'rotary' ? 'dock' : 'rotary'))
    soundEngine.play('switch')
  }, [])

  const sidebarWidth = collapsed ? 'w-16' : mode === 'rotary' ? 'w-72' : 'w-20'
  const angleStep = 360 / navigation.length
  const radius = mode === 'rotary' && !collapsed ? 140 : 0

  return (
    <aside
      className={cn(
        'h-screen flex flex-col border-r border-white/10 transition-all duration-500 relative z-50',
        mode === 'rotary' ? 'bg-slate-900' : 'bg-slate-900/80 backdrop-blur-xl',
        sidebarWidth
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        {!collapsed && (
          <Link href="/overview" className="text-lg font-bold text-glow-cyan tracking-tight">
            HomePulse
          </Link>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMode}
            className={cn(
              'p-1.5 rounded-md transition-all duration-300',
              mode === 'rotary' ? 'text-cyan-400 bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
            title={mode === 'rotary' ? 'Switch to Dock mode' : 'Switch to Rotary mode'}
          >
            {mode === 'rotary' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 3v18" />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              setCollapsed(!collapsed)
              soundEngine.play('switch')
            }}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            {collapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {mode === 'rotary' && !collapsed ? (
          <div className="spatial-rotary-wheel h-full" ref={wheelRef}>
            <div
              className="spatial-wheel-inner"
              style={{
                transform: `rotateX(10deg) rotateY(${rotation}deg)`,
                transition: hoveredIndex !== null ? 'transform 0.1s ease-out' : 'transform 0.05s linear',
              }}
            >
              {navigation.map((item, idx) => {
                const angle = idx * angleStep
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const isHovered = hoveredIndex === idx
                const x = Math.sin((angle * Math.PI) / 180) * radius
                const z = Math.cos((angle * Math.PI) / 180) * radius
                const y = -Math.cos((angle * Math.PI) / 180) * 30
                const opacity = 0.4 + (z / radius) * 0.6
                const scale = 0.85 + (z / radius) * 0.15

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => soundEngine.play('click')}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      'spatial-wheel-item',
                      isActive && 'spatial-wheel-item-active',
                      isHovered && !isActive && 'spatial-wheel-item-hover'
                    )}
                    style={{
                      transform: `translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotateY(${-angle}deg) scale(${isHovered ? 1.08 : scale})`,
                      opacity: isHovered ? 1 : opacity,
                      zIndex: Math.round(z + radius),
                    }}
                  >
                    <item.icon size={20} />
                    <span className="text-xs font-medium whitespace-nowrap">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : mode === 'dock' && !collapsed ? (
          <div className="spatial-dock flex flex-col items-center h-full py-4">
            <div className="spatial-dock-bar flex flex-col items-center gap-1 p-1.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              {navigation.map((item, idx) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => soundEngine.play('click')}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={cn(
                      'spatial-dock-item',
                      isActive && 'spatial-dock-item-active',
                      hoveredIndex === idx && !isActive && 'spatial-dock-item-hover'
                    )}
                    title={item.name}
                  >
                    <item.icon size={20} />
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center h-full py-4">
            <div className="flex flex-col items-center gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/10">
              {navigation.map((item, idx) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => soundEngine.play('click')}
                    className={cn(
                      'p-2 rounded-lg transition-all duration-200',
                      isActive ? 'text-cyan-400 bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                    title={item.name}
                  >
                    <item.icon size={20} />
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 shrink-0">
        {!collapsed && mode === 'dock' ? (
          <Link
            href="/login"
            onClick={() => soundEngine.play('click')}
            className="spatial-dock-item spatial-dock-item-hover flex items-center justify-center"
            title="Logout"
          >
            {require('lucide-react').LogOut({ size: 20 })}
          </Link>
        ) : collapsed ? (
          <Link
            href="/login"
            onClick={() => soundEngine.play('click')}
            className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            title="Logout"
          >
            {require('lucide-react').LogOut({ size: 20 })}
          </Link>
        ) : (
          <Link
            href="/login"
            onClick={() => soundEngine.play('click')}
            className="spatial-wheel-item flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            {require('lucide-react').LogOut({ size: 20 })}
            <span>Logout</span>
          </Link>
        )}
      </div>
    </aside>
  )
}
