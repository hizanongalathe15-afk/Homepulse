'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Mail } from 'lucide-react'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </div>

      <AntigravityScroll>
        <AntigravityItem>
          <div className="glass rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">DM</div>
              <div>
                <h2 className="text-xl font-bold">Daniel Mwangi</h2>
                <p className="text-sm text-slate-500">daniel.mwangi@email.com</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Full Name</label>
                <input className="w-full hs-input" defaultValue="Daniel Mwangi" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Phone</label>
                <input className="w-full hs-input" defaultValue="+254 712 345 678" />
              </div>
            </div>
          </div>
        </AntigravityItem>

        <AntigravityItem delay={2}>
          <div className="glass rounded-3xl p-6 mb-6">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Bell size={18} className="text-homespot-purple" /> Notifications</h3>
            {[
              { key: 'email' as const, label: 'Email notifications', icon: Mail },
              { key: 'push' as const, label: 'Push notifications', icon: Bell },
              { key: 'sms' as const, label: 'SMS alerts', icon: Shield },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/40 last:border-0">
                <span className="text-sm font-medium flex items-center gap-2"><item.icon size={16} className="text-slate-400" />{item.label}</span>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  className={`w-11 h-6 rounded-full transition-all ${notifications[item.key] ? 'bg-gradient-homespot' : 'bg-slate-200'}`}
                >
                  <motion.div
                    animate={{ x: notifications[item.key] ? 20 : 2 }}
                    className="w-5 h-5 rounded-full bg-white shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </AntigravityItem>

        <AntigravityItem delay={3}>
          <motion.button whileHover={{ scale: 1.02 }} className="btn-gradient w-full py-3.5 rounded-2xl text-sm font-semibold">
            Save Changes
          </motion.button>
        </AntigravityItem>
      </AntigravityScroll>
    </div>
  )
}
