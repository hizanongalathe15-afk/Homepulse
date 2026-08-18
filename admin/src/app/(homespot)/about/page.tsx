'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, Award, Star, Clock, Shield, Users, Building2, ArrowRight } from 'lucide-react'
import PublicLayout from '@/components/homespot/PublicLayout'
import PageHero from '@/components/homespot/PageHero'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

const stats = [
  { value: '50K+', label: 'Happy Users', icon: TrendingUp, accent: 'text-homespot-purple' },
  { value: '12K+', label: 'Verified Properties', icon: Award, accent: 'text-emerald-600' },
  { value: '96%', label: 'Positive Reviews', icon: Star, accent: 'text-amber-500' },
  { value: '24/7', label: 'Customer Support', icon: Clock, accent: 'text-sky-600' },
]

const values = [
  { icon: Shield, title: 'Trust & Safety', desc: 'Every property is verified. Escrow protects your deposits.' },
  { icon: Users, title: 'Community First', desc: 'Building safe neighborhoods through ratings and reviews.' },
  { icon: Building2, title: 'Local Expertise', desc: 'Built for Kenya — M-Pesa payments, local support, Nairobi focus.' },
]

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Our Story"
        badgeIcon={<Building2 className="w-3.5 h-3.5" />}
        title={<>Why Kenyans <span className="text-gradient">choose HomeSpot</span></>}
        subtitle="We're building the most trusted way to find, rent, and manage property in Kenya."
      />

      <section className="relative pb-24">
        <div className="container mx-auto px-4 sm:px-6 space-y-16">
          <AntigravityScroll>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <AntigravityItem key={stat.label} delay={((i % 3) + 1) as 1 | 2 | 3} float>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass rounded-3xl p-6 sm:p-8 text-center card-hover">
                    <stat.icon className={`w-7 h-7 mx-auto mb-4 ${stat.accent}`} />
                    <div className="text-4xl font-black text-gradient leading-none mb-2">{stat.value}</div>
                    <p className="text-sm font-semibold text-foreground/80">{stat.label}</p>
                  </motion.div>
                </AntigravityItem>
              ))}
            </div>
          </AntigravityScroll>

          <AntigravityScroll>
            <AntigravityItem>
              <div className="glass-strong rounded-3xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto text-center">
                  HomeSpot was founded to solve Kenya&apos;s rental challenges — fake listings, unsafe deposits,
                  and unreliable landlords. We combine verified properties, escrow protection, and real-time
                  messaging to make renting transparent, safe, and simple for everyone.
                </p>
              </div>
            </AntigravityItem>
          </AntigravityScroll>

          <AntigravityScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <AntigravityItem key={v.title} delay={((i % 3) + 1) as 1 | 2 | 3} float>
                  <motion.div whileHover={{ y: -4 }} className="glass rounded-3xl p-6 h-full card-hover card-hover-border">
                    <v.icon className="w-10 h-10 text-homespot-purple mb-4" />
                    <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </motion.div>
                </AntigravityItem>
              ))}
            </div>
          </AntigravityScroll>

          <AntigravityScroll>
            <AntigravityItem delay={2}>
              <div className="text-center">
                <Link href="/contact">
                  <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient px-7 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2">
                    Get in Touch <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </AntigravityItem>
          </AntigravityScroll>
        </div>
      </section>
    </PublicLayout>
  )
}
