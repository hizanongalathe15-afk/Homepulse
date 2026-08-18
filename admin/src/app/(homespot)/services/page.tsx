'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, CreditCard, MessageSquare, QrCode, BarChart3, Users, ArrowRight, Sparkles } from 'lucide-react'
import PublicLayout from '@/components/homespot/PublicLayout'
import PageHero from '@/components/homespot/PageHero'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

const services = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    desc: 'Every property is inspected and verified by our team before going live.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: CreditCard,
    title: 'Escrow Protection',
    desc: 'Deposits held securely until move-in. M-Pesa, card, and bank transfer supported.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: MessageSquare,
    title: 'In-App Messaging',
    desc: 'Chat directly with landlords, schedule viewings, and negotiate terms safely.',
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    icon: QrCode,
    title: 'QR Property Tours',
    desc: 'Scan QR codes at properties for instant details, virtual tours, and booking.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Landlord Analytics',
    desc: 'Track views, inquiries, and conversion rates on your listed properties.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Community Feed',
    desc: 'Share neighborhood insights, reviews, and connect with fellow renters.',
    gradient: 'from-indigo-500 to-purple-500',
  },
]

export default function ServicesPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Our Services"
        badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
        title={<>Everything you need to <span className="text-gradient">rent with confidence</span></>}
        subtitle="From search to move-in, HomeSpot provides end-to-end tools for tenants and landlords across Kenya."
      />

      <section className="relative pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AntigravityScroll stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
              {services.map((service, i) => (
                <AntigravityItem key={service.title} delay={((i % 3) + 1) as 1 | 2 | 3} float parallaxSpeed={0.03 + i * 0.005}>
                  <motion.div whileHover={{ y: -6 }} className="glass rounded-3xl p-6 h-full card-hover card-hover-border">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg mb-4`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  </motion.div>
                </AntigravityItem>
              ))}
            </div>

            <AntigravityItem delay={2}>
              <div className="glass-strong rounded-3xl p-8 sm:p-12 text-center">
                <h2 className="text-2xl font-extrabold mb-4">Need a custom solution?</h2>
                <p className="text-muted-foreground mb-6">Enterprise plans for property managers and real estate agencies.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient px-7 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2">
                      Contact Sales <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                  <Link href="/how-it-works">
                    <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient-soft px-7 py-3.5 rounded-2xl text-sm font-semibold border border-homespot-purple/30">
                      See How It Works
                    </motion.button>
                  </Link>
                </div>
              </div>
            </AntigravityItem>
          </AntigravityScroll>
        </div>
      </section>
    </PublicLayout>
  )
}
