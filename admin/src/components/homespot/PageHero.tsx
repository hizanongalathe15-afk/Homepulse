'use client'

import { motion } from 'framer-motion'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

interface PageHeroProps {
  badge?: string
  badgeIcon?: React.ReactNode
  title: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHero({ badge, badgeIcon, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16">
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-homespot-purple/20 rounded-full blur-3xl float" />
        <div className="absolute top-40 -right-16 w-80 h-80 bg-homespot-indigo/15 rounded-full blur-3xl float-delay" />
      </div>
      <div className="absolute inset-0 bg-grid-fade opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AntigravityScroll>
          <div className="max-w-3xl mx-auto text-center">
            {badge && (
              <AntigravityItem>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs font-bold uppercase tracking-wider text-homespot-purple mb-4 border border-homespot-purple/20">
                  {badgeIcon}
                  {badge}
                </span>
              </AntigravityItem>
            )}
            <AntigravityItem delay={2}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-4"
              >
                {title}
              </motion.h1>
            </AntigravityItem>
            {subtitle && (
              <AntigravityItem delay={3}>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </AntigravityItem>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
        </AntigravityScroll>
      </div>
    </section>
  )
}
