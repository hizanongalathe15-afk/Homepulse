'use client'

import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  LayoutDashboard,
  Home,
  Megaphone,
  BarChart3,
  QrCode,
  Users,
  Wallet,
  Shield,
  Users2,
  MessageSquare,
  FileText,
  FileBarChart,
  Settings,
  ChevronDown,
  DollarSign,
  TrendingUp,
  MapPin,
  Bed,
  Bath,
  CheckCircle2,
  Sparkles,
  Plus,
  ScanLine,
  CreditCard,
  UserPlus,
  Bell,
  Search,
  MoreHorizontal,
} from 'lucide-react'
import { ADMIN_STATS, PROPERTIES, formatKES } from '@/lib/homespot.data'
import { cn } from '@/lib/utils'

const revenueData = [
  { month: 'Jan', revenue: 1850000 },
  { month: 'Feb', revenue: 2100000 },
  { month: 'Mar', revenue: 2420000 },
  { month: 'Apr', revenue: 2280000 },
  { month: 'May', revenue: 2650000 },
  { month: 'Jun', revenue: 2890000 },
  { month: 'Jul', revenue: 2750000 },
  { month: 'Aug', revenue: 3240000 },
]

const propertyViewsData = [
  { month: 'Jan', views: 52000 },
  { month: 'Feb', views: 58000 },
  { month: 'Mar', views: 65000 },
  { month: 'Apr', views: 62000 },
  { month: 'May', views: 71000 },
  { month: 'Jun', views: 76000 },
  { month: 'Jul', views: 74000 },
  { month: 'Aug', views: 78623 },
]

const campaigns = [
  { name: 'Summer Deals', performance: 34.5, budget: 'KES 450K', status: 'Active' },
  { name: 'Refer & Earn', performance: 30.2, budget: 'KES 280K', status: 'Active' },
  { name: 'First Month Free', performance: 24.8, budget: 'KES 620K', status: 'Active' },
  { name: 'Landlord Bonus', performance: 18.6, budget: 'KES 340K', status: 'Active' },
]

const liveActivity = [
  { id: 1, icon: Plus, title: 'New property added', desc: 'Luxury 3BR Apartment, Kilimani', time: '2 min ago', color: 'from-indigo-500 to-purple-500' },
  { id: 2, icon: ScanLine, title: 'QR code scanned', desc: 'Modern 2BR Apartment, Westlands', time: '5 min ago', color: 'from-blue-500 to-cyan-500' },
  { id: 3, icon: CreditCard, title: 'Escrow payment received', desc: 'KES 170,000 from Tenant #2841', time: '12 min ago', color: 'from-emerald-500 to-teal-500' },
  { id: 4, icon: UserPlus, title: 'New user registered', desc: 'Jane Wanjiru - Renter account', time: '24 min ago', color: 'from-violet-500 to-fuchsia-500' },
  { id: 5, icon: CheckCircle2, title: 'Property verified', desc: 'Studio Apartment, Kileleshwa', time: '38 min ago', color: 'from-green-500 to-emerald-500' },
  { id: 6, icon: MessageSquare, title: 'New message received', desc: 'Inquiry about Executive 4BR House', time: '1 hr ago', color: 'from-amber-500 to-orange-500' },
  { id: 7, icon: Megaphone, title: 'Campaign report generated', desc: 'Summer Deals - Weekly summary', time: '2 hr ago', color: 'from-rose-500 to-pink-500' },
]

const sidebarNav = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard, badge: null },
  { name: 'Properties', href: '/properties', icon: Home, badge: null },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone, badge: null },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: null },
  { name: 'QR Analytics', href: '/qr-management', icon: QrCode, badge: null },
  { name: 'Users', href: '/users', icon: Users, badge: null },
  { name: 'Escrow', href: '/escrow-management', icon: Wallet, badge: null },
  { name: 'Safety', href: '/safety', icon: Shield, badge: null },
  { name: 'Community', href: '/users', icon: Users2, badge: null },
  { name: 'Messages', href: '/support', icon: MessageSquare, badge: 4 },
  { name: 'Content', href: '/content-management', icon: FileText, badge: null },
  { name: 'Reports', href: '/reports', icon: FileBarChart, badge: null },
  { name: 'Settings', href: '/settings', icon: Settings, badge: null },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
}

function Sidebar() {
  return (
    <aside className="w-64 h-screen flex flex-col bg-white/70 backdrop-blur-2xl border-r border-white/60 shadow-glass flex-shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-homespot">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              HomePulse
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1 scrollbar-thin">
        {sidebarNav.map((item, idx) => {
          const Icon = item.icon
          const isActive = item.name === 'Overview'
          return (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03, type: 'spring', stiffness: 100 }}
              className={cn(
                'group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-gradient-to-b from-indigo-500 to-purple-500"
                />
              )}
              <div
                className={cn(
                  'p-2 rounded-lg transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-100/50 text-slate-500 group-hover:bg-slate-200/60 group-hover:text-slate-700'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold shadow-md shadow-rose-200">
                  {item.badge}
                </span>
              )}
            </motion.a>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-200/60">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100/60 shadow-sm">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-md">
              <img
                src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional+african+man+portrait+headshot+smiling+business+attire+clean+background+warm+lighting&image_size=square"
                alt="Daniel Mwangi"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center">
              <Shield className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Daniel Mwangi</p>
            <p className="text-[11px] bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold uppercase tracking-wider">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function TopBar() {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-slate-200/50 bg-white/40 backdrop-blur-xl sticky top-0 z-30">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Daniel</span>!
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">Here&apos;s what&apos;s happening with HomePulse today</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search properties, users, reports..."
            className="pl-11 pr-4 py-2.5 w-72 rounded-xl bg-white/70 border border-slate-200/70 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-300 transition-all shadow-sm"
          />
        </div>

        <div className="relative px-4 py-2.5 rounded-xl bg-white/70 border border-slate-200/70 shadow-sm cursor-pointer hover:border-indigo-200 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-semibold text-slate-700">Last 30 days</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        <button className="relative p-2.5 rounded-xl bg-white/70 border border-slate-200/70 shadow-sm hover:border-indigo-200 transition-all">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-white animate-pulse-soft" />
        </button>
      </div>
    </header>
  )
}

function StatCard({
  label,
  value,
  change,
  Icon,
  gradient,
  delay,
}: {
  label: string
  value: string
  change: string
  Icon: typeof DollarSign
  gradient: string
  delay: number
}) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className="group relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-soft hover:shadow-homespot hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className={cn('absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500', gradient)} />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          </div>
          <div className={cn('p-3.5 rounded-2xl shadow-lg', gradient)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
            <TrendingUp className="w-3 h-3" />
            +{change}%
          </span>
          <span className="text-xs text-slate-400 font-medium">vs last month</span>
        </div>
      </div>
    </motion.div>
  )
}

function RecentPropertyCard({ property, index }: { property: typeof PROPERTIES[0]; index: number }) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.08 }}
      className="group relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-soft hover:shadow-card-hover overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {property.verified && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-white shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-700">Verified</span>
          </div>
        )}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-200">
          {property.type}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-lg drop-shadow-lg">{property.title}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <MapPin className="w-4 h-4 text-indigo-400" />
          <span>{property.location}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-indigo-400" />{property.bedrooms || 0} Beds</span>
            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-indigo-400" />{property.bathrooms} Bath</span>
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {formatKES(property.price)}<span className="text-xs font-medium text-slate-400">/mo</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function OverviewPage() {
  return (
    <div className="theme-clean-glass-light min-h-screen bg-gradient-sky flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8 scrollbar-thin">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8 max-w-[1600px]"
            >
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                  label="Total Revenue"
                  value="KES 3.24M"
                  change={ADMIN_STATS.revenueChange.toString()}
                  Icon={DollarSign}
                  gradient="bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500"
                  delay={0.05}
                />
                <StatCard
                  label="Verified Properties"
                  value={ADMIN_STATS.verifiedProperties.toLocaleString()}
                  change={ADMIN_STATS.propertiesChange.toString()}
                  Icon={CheckCircle2}
                  gradient="bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500"
                  delay={0.1}
                />
                <StatCard
                  label="Active Users"
                  value={ADMIN_STATS.activeUsers.toLocaleString()}
                  change={ADMIN_STATS.usersChange.toString()}
                  Icon={Users}
                  gradient="bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500"
                  delay={0.15}
                />
                <StatCard
                  label="QR Scans"
                  value={ADMIN_STATS.qrScans.toLocaleString()}
                  change={ADMIN_STATS.qrChange.toString()}
                  Icon={QrCode}
                  gradient="bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-500"
                  delay={0.2}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
                      <p className="text-sm text-slate-500 mt-0.5">Monthly revenue performance</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold text-indigo-600">KES 20.18M YTD</span>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dy={12} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `KES ${v / 1000000}M`} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 16,
                            border: '1px solid rgba(255,255,255,0.8)',
                            boxShadow: '0 12px 32px rgba(99,102,241,0.15)',
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(12px)',
                          }}
                          labelStyle={{ fontWeight: 700, color: '#475569', marginBottom: 4 }}
                          formatter={(value: number) => [formatKES(value), 'Revenue']}
                          cursor={{ stroke: '#c7d2fe', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="url(#revenueStroke)"
                          strokeWidth={3.5}
                          fillOpacity={1}
                          fill="url(#revenueArea)"
                          activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3, fill: '#6366f1' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Property Views</h3>
                      <p className="text-sm text-slate-500 mt-0.5">Monthly listing impressions</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600">+{ADMIN_STATS.viewsChange}%</span>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={propertyViewsData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                          <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dy={12} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 16,
                            border: '1px solid rgba(255,255,255,0.8)',
                            boxShadow: '0 12px 32px rgba(139,92,246,0.15)',
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(12px)',
                          }}
                          labelStyle={{ fontWeight: 700, color: '#475569', marginBottom: 4 }}
                          formatter={(value: number) => [value.toLocaleString() + ' views', 'Views']}
                          cursor={{ fill: 'rgba(139,92,246,0.06)' }}
                        />
                        <Bar dataKey="views" radius={[10, 10, 4, 4]} fill="url(#barGrad)" activeBar={{ fill: 'url(#barGradActive)' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Recent Properties</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Latest verified listings on HomePulse</p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 border border-slate-200 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all shadow-sm">
                    View All <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {PROPERTIES.slice(0, 3).map((p, i) => (
                    <RecentPropertyCard key={p.id} property={p} index={i} />
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Top Performing Campaigns</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Active marketing campaigns & ROI</p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all">
                    <Megaphone className="w-4 h-4" /> Manage Campaigns
                  </button>
                </div>
                <div className="space-y-4">
                  {campaigns.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 100 }}
                      className="group flex items-center gap-5 p-4 rounded-2xl border border-slate-200/60 bg-gradient-to-r from-white/50 to-slate-50/50 hover:border-indigo-200 hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100/60 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Megaphone className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
                            <TrendingUp className="w-3 h-3" /> +{c.performance}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-6">
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${c.performance * 2.5}%` }}
                                transition={{ delay: 0.6 + i * 0.1, duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"
                              />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Budget: {c.budget}</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-xl hover:bg-slate-100/70 transition-colors text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </main>

          <aside className="w-96 h-full border-l border-slate-200/50 bg-white/40 backdrop-blur-xl flex-shrink-0 flex flex-col">
            <div className="p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Live Activity</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time HomePulse events</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-br from-emerald-400 to-teal-500" />
                  </span>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {liveActivity.map((a, idx) => {
                const Icon = a.icon
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.07, type: 'spring', stiffness: 100 }}
                    className="group flex gap-3.5 p-4 rounded-2xl bg-white/70 border border-slate-200/50 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all duration-300"
                  >
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br', a.color, 'flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform')}>
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{a.desc}</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-2 uppercase tracking-wide">{a.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <div className="p-5 border-t border-slate-200/50">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white relative overflow-hidden shadow-homespot">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-14 -left-10 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <p className="text-sm font-bold">PulseAI Insights</p>
                  </div>
                  <p className="text-xs text-white/85 leading-relaxed">
                    Revenue is trending {ADMIN_STATS.revenueChange}% above average. Consider scaling the Summer Deals campaign for maximum ROI.
                  </p>
                  <button className="mt-4 w-full py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-bold hover:bg-white/30 transition-all">
                    View Recommendations
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
