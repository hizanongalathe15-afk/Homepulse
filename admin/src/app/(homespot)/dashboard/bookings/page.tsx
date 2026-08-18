'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Building2, ArrowRight } from 'lucide-react'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

const bookings = [
  { id: 1, name: 'Modern 2BR Apartment', location: 'Kilimani, Nairobi', status: 'Confirmed', date: 'Aug 15, 2026', time: '11:00 AM', amount: 'KES 45,000' },
  { id: 2, name: 'Luxury Villa with Pool', location: 'Runda, Nairobi', status: 'Pending', date: 'Aug 18, 2026', time: '2:00 PM', amount: 'KES 180,000' },
  { id: 3, name: 'Cozy Studio Apt', location: 'Westlands, Nairobi', status: 'Confirmed', date: 'Aug 12, 2026', time: '10:00 AM', amount: 'KES 22,000' },
  { id: 4, name: 'Executive 4BR House', location: 'Karen, Nairobi', status: 'Cancelled', date: 'Aug 10, 2026', time: '3:00 PM', amount: 'KES 95,000' },
  { id: 5, name: 'Penthouse Suite', location: 'Upper Hill, Nairobi', status: 'Confirmed', date: 'Aug 20, 2026', time: '9:30 AM', amount: 'KES 150,000' },
]

const statusColors: Record<string, string> = {
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-rose-100 text-rose-700',
}

export default function BookingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">My Bookings</h1>
        <p className="text-slate-500 mt-1">Manage your property viewings and rental bookings</p>
      </div>
      <AntigravityScroll>
        <div className="space-y-4">
          {bookings.map((b, i) => (
            <AntigravityItem key={b.id} delay={((i % 3) + 1) as 1 | 2 | 3} float>
              <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-5 card-hover card-hover-border">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white shrink-0">
                    <Building2 size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg">{b.name}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={14} />{b.location}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[b.status]}`}>{b.status}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1.5 text-slate-600"><Calendar size={14} />{b.date}</span>
                      <span className="flex items-center gap-1.5 text-slate-600"><Clock size={14} />{b.time}</span>
                      <span className="font-bold text-gradient">{b.amount}</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <button className="btn-gradient-soft px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1 border border-homespot-purple/30">
                      Pay <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AntigravityItem>
          ))}
        </div>
      </AntigravityScroll>
    </div>
  )
}
