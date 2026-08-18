'use client'

import PropertyCard from '@/components/homespot/PropertyCard'
import { AntigravityScroll } from '@/components/features/AntigravityScroll'
import { PROPERTIES } from '@/lib/homespot.data'

export default function FavoritesPage() {
  const favorites = PROPERTIES.slice(0, 3)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Saved Properties</h1>
        <p className="text-slate-500 mt-1">{favorites.length} properties saved to your favorites</p>
      </div>
      <AntigravityScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {favorites.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </AntigravityScroll>
    </div>
  )
}
