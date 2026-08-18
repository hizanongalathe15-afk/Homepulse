'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ChevronDown, MapPin, Home as HomeIcon, DollarSign, BedDouble, Award, ArrowRight } from 'lucide-react'
import PublicLayout from '@/components/homespot/PublicLayout'
import PageHero from '@/components/homespot/PageHero'
import PropertyCard from '@/components/homespot/PropertyCard'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'
import { PROPERTIES } from '@/lib/homespot.data'

const filters = ['All', 'Apartment', 'Studio', 'House', 'Villa', 'Bedsitter']

export default function PropertiesPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = PROPERTIES.filter((p) => {
    const matchesFilter = activeFilter === 'All' || p.type === activeFilter
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <PublicLayout>
      <PageHero
        badge="Browse Listings"
        badgeIcon={<Award className="w-3.5 h-3.5" />}
        title={<>Find your next <span className="text-gradient">home</span></>}
        subtitle="Explore verified properties across Nairobi and beyond. Filter by type, location, and budget."
      />

      <section className="relative pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <AntigravityScroll>
            <AntigravityItem>
              <div className="glass-strong rounded-3xl p-4 sm:p-6 mb-8 shadow-homespot">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by name or location..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full hs-input pl-11"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          activeFilter === f
                            ? 'btn-gradient text-white shadow-homespot'
                            : 'glass-subtle hover:bg-white/80 border border-white/40'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </AntigravityItem>

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{filtered.length}</span> properties
              </p>
              <Link href="/explore" className="text-sm font-semibold text-homespot-purple inline-flex items-center gap-1 hover:gap-2 transition-all">
                Map view <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>

            {filtered.length === 0 && (
              <AntigravityItem>
                <div className="text-center py-16 glass rounded-3xl">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No properties found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                </div>
              </AntigravityItem>
            )}
          </AntigravityScroll>
        </div>
      </section>
    </PublicLayout>
  )
}
