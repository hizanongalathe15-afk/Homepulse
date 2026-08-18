'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin, Home as HomeIcon, BedDouble, DollarSign, Search, ChevronDown,
  ShieldCheck, Shield, Headphones, Users as UsersIcon,
  Star, ArrowRight, Award, CheckCircle2, Plus, Sparkles,
} from 'lucide-react'
import PublicLayout from '@/components/homespot/PublicLayout'
import PropertyCard from '@/components/homespot/PropertyCard'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'
import { PROPERTIES } from '@/lib/homespot.data'

const trustBadges = [
  { icon: ShieldCheck, title: 'Verified Properties', desc: 'Every listing vetted by our team', gradient: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
  { icon: Shield, title: 'Escrow Protection', desc: 'Your deposit is safe & secured', gradient: 'from-violet-500 to-purple-500', glow: 'shadow-violet-500/20' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here when you need us', gradient: 'from-sky-500 to-blue-500', glow: 'shadow-sky-500/20' },
  { icon: UsersIcon, title: 'Safe Neighborhoods', desc: 'Curated communities & safety scores', gradient: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
]

const locations = ['All Locations', 'Westlands, Nairobi', 'Kilimani, Nairobi', 'Kileleshwa, Nairobi', 'Karen, Nairobi']
const propertyTypes = ['All Types', 'Apartment', 'Studio', 'House', 'Villa', 'Bedsitter']
const priceRanges = ['Any Price', 'KES 0 - 30K', 'KES 30K - 60K', 'KES 60K - 100K', 'KES 100K+']
const bedroomOptions = ['Any Beds', 'Studio', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms']

export default function LandingPage() {
  const [location, setLocation] = useState(locations[0])
  const [propertyType, setPropertyType] = useState(propertyTypes[0])
  const [priceRange, setPriceRange] = useState(priceRanges[0])
  const [bedrooms, setBedrooms] = useState(bedroomOptions[0])

  return (
    <PublicLayout>
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24">
        <div className="absolute top-0 left-0 right-0 h-[600px] sm:h-[700px] overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-homespot-purple/20 rounded-full blur-3xl float" />
          <div className="absolute top-40 -right-16 w-80 h-80 sm:w-[420px] sm:h-[420px] bg-homespot-indigo/15 rounded-full blur-3xl float-delay" />
        </div>
        <div className="absolute inset-0 bg-grid-fade opacity-40 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-6 border border-white/40"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm font-semibold text-foreground/80">
                Kenya&apos;s #1 Trusted Property Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
            >
              Find your perfect
              <br className="hidden sm:block" />
              <span className="text-gradient"> home in Kenya</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Discover verified homes, connect with trusted landlords, and move with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="absolute -inset-1 bg-gradient-homespot rounded-3xl blur-xl opacity-25" />
              <div className="relative glass-strong rounded-3xl p-4 sm:p-6 shadow-homespot-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Location', icon: MapPin, value: location, options: locations, set: setLocation },
                    { label: 'Property Type', icon: HomeIcon, value: propertyType, options: propertyTypes, set: setPropertyType },
                    { label: 'Price Range', icon: DollarSign, value: priceRange, options: priceRanges, set: setPriceRange },
                    { label: 'Bedrooms', icon: BedDouble, value: bedrooms, options: bedroomOptions, set: setBedrooms },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                        <field.icon className="w-3.5 h-3.5 text-homespot-purple" />
                        {field.label}
                      </label>
                      <div className="relative">
                        <select
                          value={field.value}
                          onChange={(e) => field.set(e.target.value)}
                          className="w-full hs-input appearance-none pr-10 font-medium cursor-pointer"
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-white/20">
                  <Link href="/properties" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-gradient px-6 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-homespot-lg"
                    >
                      <Search className="w-4 h-4" />
                      Search Properties
                    </motion.button>
                  </Link>
                  <Link href="/explore">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-gradient-soft px-6 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      Explore Map
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12">
              <AntigravityScroll stagger>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {trustBadges.map((badge, i) => (
                    <AntigravityItem key={badge.title} delay={((i % 3) + 1) as 1 | 2 | 3} float parallaxSpeed={0.04 + i * 0.01}>
                      <motion.div whileHover={{ y: -4, scale: 1.02 }} className="glass rounded-2xl p-4 sm:p-5 h-full card-hover card-hover-border">
                        <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${badge.gradient} shadow-lg ${badge.glow} mb-3`}>
                          <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground mb-1">{badge.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{badge.desc}</p>
                      </motion.div>
                    </AntigravityItem>
                  ))}
                </div>
              </AntigravityScroll>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AntigravityScroll>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <AntigravityItem>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs font-bold uppercase tracking-wider text-homespot-purple mb-4 border border-homespot-purple/20">
                  <Award className="w-3.5 h-3.5" />
                  Featured Listings
                </span>
              </AntigravityItem>
              <AntigravityItem delay={2}>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                  Handpicked <span className="text-gradient">homes for you</span>
                </h2>
              </AntigravityItem>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
              {PROPERTIES.slice(0, 4).map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
            <AntigravityItem delay={2}>
              <div className="mt-12 text-center">
                <Link href="/properties">
                  <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient-soft px-7 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2 border border-homespot-purple/30">
                    View All Properties
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </AntigravityItem>
          </AntigravityScroll>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="glass-strong rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'How it Works', desc: 'Four simple steps to your new home', href: '/how-it-works', icon: CheckCircle2 },
              { title: 'About HomeSpot', desc: 'Why 50K+ Kenyans trust us', href: '/about', icon: Star },
              { title: 'Contact Us', desc: 'We are here to help 24/7', href: '/contact', icon: Headphones },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6 h-full card-hover card-hover-border group">
                  <item.icon className="w-8 h-8 text-homespot-purple mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gradient transition-all">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                  <span className="text-sm font-semibold text-homespot-purple inline-flex items-center gap-1">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-homespot" />
            <div className="relative p-8 sm:p-12 text-center text-white">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Own a property? List it today.</h2>
              <p className="text-white/80 max-w-xl mx-auto mb-6">Reach thousands of qualified tenants across Kenya with escrow-protected payments.</p>
              <Link href="/list-property">
                <motion.button whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-sm font-bold bg-white text-homespot-purple shadow-2xl">
                  <Plus className="w-4 h-4" />
                  List Your Property
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
