'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CreditCard, Shield, ArrowRight, Download } from 'lucide-react'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

const payments = [
  { id: 1, property: 'Modern 2BR Apartment', date: 'Aug 15, 2026', amount: 85000, method: 'M-Pesa', status: 'Completed' },
  { id: 2, property: 'Escrow Deposit', date: 'Aug 10, 2026', amount: 30000, method: 'M-Pesa', status: 'In Escrow' },
  { id: 3, property: 'Service Fee', date: 'Aug 10, 2026', amount: 3500, method: 'M-Pesa', status: 'Completed' },
  { id: 4, property: 'Studio Apartment', date: 'Jul 28, 2026', amount: 45000, method: 'Bank', status: 'Completed' },
]

export default function PaymentsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Payment History</h1>
        <p className="text-slate-500 mt-1">Track all your rental payments and escrow transactions</p>
      </div>

      <AntigravityScroll>
        <AntigravityItem>
          <div className="glass-strong rounded-3xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Total Spent (2026)</p>
              <p className="text-3xl font-extrabold text-gradient">KES 163,500</p>
            </div>
            <Link href="/checkout">
              <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                Make Payment <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </AntigravityItem>

        <div className="space-y-3">
          {payments.map((p, i) => (
            <AntigravityItem key={p.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <motion.div whileHover={{ x: 4 }} className="glass rounded-2xl p-5 flex items-center gap-4 card-hover">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.status === 'In Escrow' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {p.status === 'In Escrow' ? <Shield size={22} /> : <CreditCard size={22} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{p.property}</h3>
                  <p className="text-xs text-slate-500">{p.date} · {p.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gradient">KES {p.amount.toLocaleString()}</p>
                  <span className={`text-xs font-semibold ${p.status === 'In Escrow' ? 'text-amber-600' : 'text-emerald-600'}`}>{p.status}</span>
                </div>
                <button className="p-2 rounded-xl glass-subtle text-slate-500 hover:text-homespot-purple transition-colors">
                  <Download size={16} />
                </button>
              </motion.div>
            </AntigravityItem>
          ))}
        </div>
      </AntigravityScroll>
    </div>
  )
}
