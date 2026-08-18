'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, List, Map, BedDouble, Bath, Maximize2, Star, ShieldCheck, ArrowRight } from 'lucide-react'
import PublicLayout from '@/components/homespot/PublicLayout'
import PageHero from '@/components/homespot/PageHero'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'
import { PROPERTIES, formatKES } from '@/lib/homespot.data'

export default function ExplorePage() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const [selectedId, setSelectedId] = useState<string | null>(PROPERTIES[0]?.id ?? null)

  const selected = PROPERTIES.find((p) => p.id === selectedId)

  return (
    <PublicLayout showFooter={false}>
      <PageHero
        badge="Explore Kenya"
        badgeIcon={<Map className="w-3.5 h-3.5" />}
        title={<>Discover homes on the <span className="text-gradient">map</span></>}
        subtitle="Browse properties by location with live price pins across Nairobi neighborhoods."
      />

      <section className="relative pb-8">
        <div className="container mx-auto px-4 sm:px-6">
          <AntigravityScroll>
            <AntigravityItem>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('map')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                      view === 'map' ? 'btn-gradient text-white' : 'glass-subtle border border-white/40'
                    }`}
                  >
                    <Map className="w-4 h-4" /> Map
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                      view === 'list' ? 'btn-gradient text-white' : 'glass-subtle border border-white/40'
                    }`}
                  >
                    <List className="w-4 h-4" /> List
                  </button>
                </div>
                <Link href="/properties" className="text-sm font-semibold text-homespot-purple inline-flex items-center gap-1">
                  All listings <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </AntigravityItem>

            <AntigravityItem delay={2}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-22rem)] min-h-[500px]">
                <div className={`lg:col-span-7 glass rounded-3xl overflow-hidden relative ${view === 'list' ? 'hidden lg:block' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-sky-100 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900">
                    <div className="absolute inset-0 bg-grid-fade opacity-50" />
                    {PROPERTIES.map((p, i) => (
                      <motion.button
                        key={p.id}
                        onClick={() => setSelectedId(p.id)}
                        whileHover={{ scale: 1.1 }}
                        className={`absolute px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all ${
                          selectedId === p.id
                            ? 'btn-gradient text-white scale-110 z-10'
                            : 'bg-white text-homespot-purple border border-homespot-purple/20'
                        }`}
                        style={{
                          top: `${20 + i * 14}%`,
                          left: `${15 + (i % 3) * 25}%`,
                        }}
                      >
                        {formatKES(p.price)}
                      </motion.button>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 glass-subtle rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-homespot-purple" />
                    Nairobi, Kenya
                  </div>
                </div>

                <div className={`lg:col-span-5 flex flex-col gap-3 overflow-y-auto ${view === 'map' ? '' : 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
                  {PROPERTIES.map((p) => (
                    <motion.button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      whileHover={{ y: -2 }}
                      className={`text-left glass rounded-2xl p-4 card-hover transition-all ${
                        selectedId === p.id ? 'ring-2 ring-homespot-purple shadow-homespot' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm truncate">{p.title}</h3>
                            {p.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {p.location}
                          </p>
                          <p className="text-lg font-extrabold text-gradient mt-1">{formatKES(p.price)}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-0.5"><BedDouble className="w-3 h-3" />{p.bedrooms}</span>
                            <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{p.bathrooms}</span>
                            <span className="flex items-center gap-0.5"><Maximize2 className="w-3 h-3" />{p.area}m²</span>
                            <span className="flex items-center gap-0.5 ml-auto"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{p.rating}</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </AntigravityItem>

            {selected && (
              <AntigravityItem delay={3}>
                <div className="mt-4 flex justify-center">
                  <Link href={`/property/${selected.id}`}>
                    <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient px-8 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2">
                      View {selected.title.split(' ').slice(0, 2).join(' ')} Details
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </AntigravityItem>
            )}
          </AntigravityScroll>
        </div>
      </section>
    </PublicLayout>
  )
}
