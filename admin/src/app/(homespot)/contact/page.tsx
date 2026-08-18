'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Headphones } from 'lucide-react'
import PublicLayout from '@/components/homespot/PublicLayout'
import PageHero from '@/components/homespot/PageHero'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@homespot.co.ke', href: 'mailto:support@homespot.co.ke' },
  { icon: Phone, label: 'Phone', value: '+254 700 000 000', href: 'tel:+254700000000' },
  { icon: MapPin, label: 'Office', value: 'Westlands, Nairobi, Kenya', href: '#' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 8AM–8PM EAT', href: '#' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <PublicLayout>
      <PageHero
        badge="Get in Touch"
        badgeIcon={<Headphones className="w-3.5 h-3.5" />}
        title={<>We&apos;d love to <span className="text-gradient">hear from you</span></>}
        subtitle="Have a question about renting, listing, or our escrow service? Our team responds within 2 hours."
      />

      <section className="relative pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <AntigravityScroll>
                <div className="space-y-4">
                  {contactInfo.map((item, i) => (
                    <AntigravityItem key={item.label} delay={((i % 3) + 1) as 1 | 2 | 3} float>
                      <motion.a
                        href={item.href}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 glass rounded-2xl p-5 card-hover card-hover-border"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-homespot flex items-center justify-center shadow-homespot">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-foreground">{item.value}</p>
                        </div>
                      </motion.a>
                    </AntigravityItem>
                  ))}
                </div>
              </AntigravityScroll>
            </div>

            <div className="lg:col-span-7">
              <AntigravityScroll>
                <AntigravityItem delay={2}>
                  <motion.form
                    onSubmit={handleSubmit}
                    className="glass-strong rounded-3xl p-6 sm:p-8 shadow-homespot-lg"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="w-6 h-6 text-homespot-purple" />
                      <h2 className="text-xl font-bold">Send us a message</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full hs-input"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full hs-input"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Subject</label>
                      <input
                        required
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full hs-input"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full hs-input resize-none"
                        placeholder="Tell us more..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-gradient w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2"
                    >
                      {sent ? 'Message Sent!' : 'Send Message'}
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </motion.form>
                </AntigravityItem>
              </AntigravityScroll>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
