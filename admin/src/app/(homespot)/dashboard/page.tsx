'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingUp, MapPin, ChevronRight, Gift, Share2, Sparkles, Clock,
  Calendar, CreditCard, Building2, CheckCircle2, AlertCircle, XCircle,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { cn } from '@/lib/utils'

const stats = [
  { label: 'Total Bookings', value: '24', trend: '+12.5%', trendDirection: 'up' as const, icon: Calendar, gradient: 'from-indigo-500 to-purple-500' },
  { label: 'Active Bookings', value: '5', trend: '+8.2%', trendDirection: 'up' as const, icon: Sparkles, gradient: 'from-sky-500 to-cyan-500' },
  { label: 'Total Payments', value: 'KES 240K', trend: '+16.6%', trendDirection: 'up' as const, icon: CreditCard, gradient: 'from-emerald-500 to-teal-500' },
  { label: 'Saved Properties', value: '18', trend: '+4.2%', trendDirection: 'up' as const, icon: Building2, gradient: 'from-rose-500 to-pink-500' },
]

const recentBookings = [
  { id: 1, name: 'Modern 2BR Apartment', location: 'Kilimani, Nairobi', status: 'Confirmed', date: 'Aug 15, 2026', amount: 'KES 45,000' },
  { id: 2, name: 'Luxury Villa with Pool', location: 'Runda, Nairobi', status: 'Pending', date: 'Aug 14, 2026', amount: 'KES 180,000' },
  { id: 3, name: 'Cozy Studio Apt', location: 'Westlands, Nairobi', status: 'Confirmed', date: 'Aug 12, 2026', amount: 'KES 22,000' },
  { id: 4, name: 'Executive 4BR House', location: 'Karen, Nairobi', status: 'Cancelled', date: 'Aug 10, 2026', amount: 'KES 95,000' },
]

const monthlySpending = [
  { month: 'Jan', amount: 35000 }, { month: 'Feb', amount: 42000 }, { month: 'Mar', amount: 38000 },
  { month: 'Apr', amount: 55000 }, { month: 'May', amount: 48000 }, { month: 'Jun', amount: 62000 },
  { month: 'Jul', amount: 58000 }, { month: 'Aug', amount: 72000 },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  }
  const icons: Record<string, typeof CheckCircle2> = { Confirmed: CheckCircle2, Pending: AlertCircle, Cancelled: XCircle }
  const Icon = icons[status] || AlertCircle
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', styles[status])}>
      <Icon size={12} />{status}
    </span>
  )
}

export default function DashboardOverviewPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-gradient">Daniel</span>
            <Sparkles size={24} className="inline-block ml-2 text-amber-400 animate-bounce-soft" />
          </h2>
          <p className="mt-1.5 text-slate-500 text-sm sm:text-base">Here&apos;s what&apos;s happening with your home search today</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/listings"><button className="glass px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/80 transition-all">Browse Properties</button></Link>
          <Link href="/explore"><button className="btn-gradient px-4 py-2.5 rounded-xl text-sm font-semibold text-white">Explore Map</button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {stats.map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} className="glass rounded-2xl p-5 card-hover-border relative overflow-hidden group">
            <div className={cn('absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl group-hover:opacity-25', stat.gradient)} />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={cn('p-2.5 rounded-xl bg-gradient-to-br text-white shadow-lg', stat.gradient)}><stat.icon size={20} /></div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  <TrendingUp size={12} />{stat.trend}
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 glass rounded-2xl p-5 sm:p-6 card-hover">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2"><Calendar size={20} className="text-indigo-500" /> Recent Bookings</h3>
              <p className="text-sm text-slate-500 mt-0.5">Your latest property viewing and rental bookings</p>
            </div>
            <Link href="/dashboard/bookings" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <ChevronRight size={15} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <motion.div key={booking.id} whileHover={{ y: -2 }} className="glass-subtle rounded-xl p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-full sm:w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold truncate">{booking.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500"><MapPin size={13} />{booking.location}</div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-slate-500"><Clock size={13} />{booking.date}</span>
                      <span className="font-bold text-gradient">{booking.amount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5 sm:p-6 card-hover">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><CreditCard size={20} className="text-emerald-500" /> Monthly Spending</h3>
            <div className="h-56 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySpending}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${v / 1000}K`} width={40} />
                  <Tooltip formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Spent']} />
                  <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <Link href="/dashboard/payments" className="text-sm font-semibold text-indigo-600 mt-3 inline-flex items-center gap-1">
              View payment history <ChevronRight size={14} />
            </Link>
          </div>

          <div className="relative rounded-2xl overflow-hidden p-5 sm:p-6 card-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700" />
            <div className="relative z-10">
              <Gift size={24} className="text-white mb-3" />
              <h3 className="text-xl font-bold text-white mb-1.5">Refer a friend & earn <span className="text-amber-200">KES 2,000</span></h3>
              <p className="text-sm text-white/80 mb-4">Invite friends to HomeSpot and get rewarded.</p>
              <button className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg inline-flex items-center gap-2">
                <Share2 size={16} /> Invite Friends
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
