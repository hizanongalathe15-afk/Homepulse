'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin, BedDouble, Bath, Maximize2, Star, ShieldCheck,
  Heart, Share2, Building2, Eye,
} from 'lucide-react'
import { AntigravityItem } from '@/components/features/AntigravityScroll'
import { formatKES, type Property } from '@/lib/homespot.data'

export default function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  return (
    <AntigravityItem delay={((index % 4) + 1) as 1 | 2 | 3} float parallaxSpeed={0.03 + index * 0.005}>
      <Link href={`/property/${property.id}`}>
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="group relative glass rounded-3xl overflow-hidden card-hover card-hover-border cursor-pointer"
        >
          <div className="relative img-wrap aspect-[4/3] rounded-t-3xl overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {property.verified && (
                <span className="badge-verified backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
              <span className="badge-tag backdrop-blur-md bg-white/90">{property.type}</span>
            </div>

            <div className="absolute top-3 right-3 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-white shadow-lg transition-colors"
              >
                <Heart className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-homespot-purple hover:bg-white shadow-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <MapPin className="w-3 h-3 text-white/80" />
                <span className="text-xs font-medium text-white/90">{property.location}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-white/90">{property.rating}</span>
                <span className="text-[10px] text-white/60">({property.reviews})</span>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-gradient transition-all">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                <Building2 className="w-3 h-3" />
                <span>Safety Score: {property.safetyScore}/100</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BedDouble className="w-4 h-4 text-homespot-purple" />
                <span className="font-medium text-foreground">{property.bedrooms || 'Studio'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Bath className="w-4 h-4 text-homespot-purple" />
                <span className="font-medium text-foreground">{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Maximize2 className="w-4 h-4 text-homespot-purple" />
                <span className="font-medium text-foreground">{property.area}m²</span>
              </div>
            </div>

            <div className="divider-gradient" />

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs text-muted-foreground">Rent per month</p>
                <p className="text-2xl font-extrabold text-gradient leading-tight">
                  {formatKES(property.price)}
                </p>
              </div>
              <span className="btn-gradient px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                View
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </AntigravityItem>
  )
}
