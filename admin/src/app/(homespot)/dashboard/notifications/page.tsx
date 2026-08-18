'use client'

import { motion } from 'framer-motion'
import { Bell, Calendar, MessageSquare, Shield, CreditCard, Home } from 'lucide-react'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

const notifications = [
  { id: 1, icon: Calendar, title: 'Viewing confirmed', desc: 'Your viewing at Modern 2BR Apartment is confirmed for Aug 15', time: '2 hours ago', unread: true },
  { id: 2, icon: MessageSquare, title: 'New message from John', desc: 'John Mwangi replied to your inquiry about Westlands apartment', time: '5 hours ago', unread: true },
  { id: 3, icon: CreditCard, title: 'Payment received', desc: 'KES 85,000 escrow deposit has been secured', time: '1 day ago', unread: false },
  { id: 4, icon: Shield, title: 'Property verified', desc: 'Luxury Villa with Pool has been verified by our team', time: '2 days ago', unread: false },
  { id: 5, icon: Home, title: 'New listing match', desc: 'A new 2BR apartment in Kilimani matches your saved search', time: '3 days ago', unread: false },
]

export default function NotificationsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
        <p className="text-slate-500 mt-1">Stay updated on your home search</p>
      </div>
      <AntigravityScroll>
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <AntigravityItem key={n.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <motion.div whileHover={{ x: 4 }} className={`glass rounded-2xl p-4 flex items-start gap-4 card-hover ${n.unread ? 'border-l-4 border-l-homespot-purple' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.unread ? 'bg-gradient-homespot text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <n.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-sm ${n.unread ? 'text-foreground' : 'text-slate-600'}`}>{n.title}</h3>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                </div>
                {n.unread && <span className="w-2 h-2 rounded-full bg-homespot-purple shrink-0 mt-2" />}
              </motion.div>
            </AntigravityItem>
          ))}
        </div>
      </AntigravityScroll>
    </div>
  )
}
