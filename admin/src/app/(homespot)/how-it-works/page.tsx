'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Eye, ShieldCheck, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react'
import PublicLayout from '@/components/homespot/PublicLayout'
import PageHero from '@/components/homespot/PageHero'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

const steps = [
  {
    step: '01',
    title: 'Search & Discover',
    desc: 'Browse thousands of verified listings across Kenya with advanced filters for location, budget, and amenities.',
    icon: Search,
    gradient: 'from-homespot-purple to-homespot-indigo',
  },
  {
    step: '02',
    title: 'View & Connect',
    desc: 'Take virtual tours, view high-res photos, and chat directly with verified landlords in real-time.',
    icon: Eye,
    gradient: 'from-sky-500 to-cyan-500',
  },
  {
    step: '03',
    title: 'Secure Booking',
    desc: 'Book your viewing, pay deposit through our protected escrow system — no cash, no risk.',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    step: '04',
    title: 'Move In & Thrive',
    desc: 'Get your keys, join the community, and enjoy your new home with ongoing support.',
    icon: KeyRound,
    gradient: 'from-amber-500 to-orange-500',
  },
]

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Simple Process"
        badgeIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
        title={<>How <span className="text-gradient">HomeSpot Works</span></>}
        subtitle="Finding and moving into your dream home has never been easier. Four simple steps, zero stress."
      />

      <section className="relative pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AntigravityScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16">
              {steps.map((step, i) => (
                <AntigravityItem key={step.step} delay={((i % 3) + 1) as 1 | 2 | 3} float parallaxSpeed={0.03 + i * 0.008}>
                  <motion.div whileHover={{ y: -6 }} className="relative glass rounded-3xl p-6 sm:p-7 h-full card-hover card-hover-border">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-black text-homespot-purple uppercase tracking-widest">{step.step}</span>
                    <h3 className="text-xl font-bold text-foreground mt-2 mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </motion.div>
                </AntigravityItem>
              ))}
            </div>

            <AntigravityItem delay={2}>
              <div className="glass-strong rounded-3xl p-8 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Ready to get started?</h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Browse verified properties or list your own — it only takes a few minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/listings">
                    <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient px-7 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2">
                      Browse Properties <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                  <Link href="/list-property">
                    <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient-soft px-7 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2 border border-homespot-purple/30">
                      List Your Property
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
