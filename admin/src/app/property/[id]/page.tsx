'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wifi,
  Dumbbell,
  Car,
  Shield,
  Zap,
  Waves,
  Elevator,
  Droplets,
  BedDouble,
  Bath,
  Maximize2,
  Home,
  Sofa,
  Star,
  MapPin,
  CheckCircle2,
  MessageSquare,
  Calendar,
  ChevronDown,
  ShieldCheck,
  Building2,
  HeartPulse,
  GraduationCap,
  Landmark,
  ArrowRight,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
} from 'lucide-react'
import { PROPERTIES, formatKES } from '@/lib/homespot.data.ts'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassBadge } from '@/components/ui/GlassBadge'
import { cn } from '@/lib/utils'

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-5 h-5" />,
  Gym: <Dumbbell className="w-5 h-5" />,
  Parking: <Car className="w-5 h-5" />,
  '24/7 Security': <Shield className="w-5 h-5" />,
  'Backup Generator': <Zap className="w-5 h-5" />,
  'Swimming Pool': <Waves className="w-5 h-5" />,
  Elevator: <Elevator className="w-5 h-5" />,
  Borehole: <Droplets className="w-5 h-5" />,
  Furnished: <Sofa className="w-5 h-5" />,
}

const DISPLAY_AMENITIES = [
  'WiFi',
  'Gym',
  'Parking',
  '24/7 Security',
  'Backup Generator',
  'Swimming Pool',
  'Elevator',
  'Borehole',
]

const NEARBY_PLACES = [
  { icon: <Building2 className="w-5 h-5" />, name: 'Westgate Mall', distance: '400m' },
  { icon: <HeartPulse className="w-5 h-5" />, name: 'Aga Khan Hospital', distance: '800m' },
  { icon: <GraduationCap className="w-5 h-5" />, name: 'Peponi School', distance: '1.2km' },
  { icon: <Landmark className="w-5 h-5" />, name: 'Nairobi CBD', distance: '5km' },
]

const DURATION_OPTIONS = ['1 Month', '3 Months', '6 Months', '12 Months']

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>()
  const property = PROPERTIES.find((p) => p.id === params.id) ?? PROPERTIES[0]

  const [selectedImage, setSelectedImage] = useState(0)
  const [moveInDate, setMoveInDate] = useState('')
  const [duration, setDuration] = useState('12 Months')
  const [isLiked, setIsLiked] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showDurationDropdown, setShowDurationDropdown] = useState(false)

  const months = parseInt(duration) || 12
  const rent = property.price
  const serviceFee = Math.round(rent * 0.05)
  const escrowFee = Math.round(rent * 0.015)
  const total = rent + serviceFee + escrowFee

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <div className="min-h-screen bg-mesh pb-20">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Action Bar */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5" />
            Back to listings
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                'w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300',
                'glass hover:scale-105',
                isLiked ? 'text-rose-500' : 'text-slate-500'
              )}
            >
              <Heart className={cn('w-5 h-5 transition-all', isLiked ? 'fill-current' : '')} />
            </button>
            <button className="w-11 h-11 rounded-2xl flex items-center justify-center glass text-slate-500 hover:text-indigo-600 hover:scale-105 transition-all duration-300">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column — Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Gallery */}
            <motion.section variants={itemVariants}>
              <GlassCard padding="none" className="overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={property.images[selectedImage]}
                      alt={property.title}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === 0 ? property.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all duration-300"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev === property.images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all duration-300"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <GlassBadge variant="success" dot>
                      {property.status}
                    </GlassBadge>
                    {property.verified && (
                      <span className="badge-verified">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {property.images.slice(0, 5).map((img, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300',
                        selectedImage === idx
                          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white shadow-lg shadow-indigo-500/25'
                          : 'opacity-60 hover:opacity-100'
                      )}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </GlassCard>
            </motion.section>

            {/* Title & Price */}
            <motion.section variants={itemVariants}>
              <GlassCard className="card-hover card-hover-border">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        <span className="text-gradient">{property.title}</span>
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">{property.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-800">{property.rating}</span>
                        <span className="text-slate-500">({property.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="text-4xl md:text-5xl font-extrabold">
                      <span className="text-gradient">{formatKES(rent)}</span>
                    </div>
                    <div className="text-slate-500 font-medium mt-1">per {property.period}</div>
                  </div>
                </div>

                {/* Stat Badges */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { icon: <BedDouble className="w-5 h-5" />, label: `${property.bedrooms} Beds` },
                    { icon: <Bath className="w-5 h-5" />, label: `${property.bathrooms} Baths` },
                    { icon: <Maximize2 className="w-5 h-5" />, label: `${property.area} sqm` },
                    { icon: <Home className="w-5 h-5" />, label: property.type },
                    { icon: <Sofa className="w-5 h-5" />, label: 'Furnished' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.04, y: -3 }}
                      className="glass-subtle rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 text-indigo-600 flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.section>

            {/* About */}
            <motion.section variants={itemVariants}>
              <GlassCard className="card-hover">
                <h2 className="text-2xl font-bold mb-4">
                  <span className="text-gradient">About this property</span>
                </h2>
                <div className="divider-gradient mb-6" />
                <p className="text-slate-600 leading-relaxed text-lg">
                  {property.description}
                </p>
                <p className="text-slate-500 leading-relaxed mt-4">
                  This stunning residence offers an unparalleled living experience with premium
                  finishes throughout. Located in one of Nairobi&apos;s most sought-after
                  neighborhoods, you&apos;ll enjoy easy access to shopping, dining, entertainment,
                  and major transport links. The property features carefully curated spaces
                  designed for modern urban living, with natural light flooding every room.
                </p>
              </GlassCard>
            </motion.section>

            {/* Amenities */}
            <motion.section variants={itemVariants}>
              <GlassCard className="card-hover">
                <h2 className="text-2xl font-bold mb-4">
                  <span className="text-gradient">Amenities</span>
                </h2>
                <div className="divider-gradient mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {DISPLAY_AMENITIES.map((amenity, idx) => (
                    <motion.div
                      key={amenity}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.4 }}
                      whileHover={{ scale: 1.06, y: -4 }}
                      className="glass-subtle rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-xl hover:shadow-indigo-500/15 transition-all duration-400 group cursor-default"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/35 transition-all duration-400 group-hover:rotate-6">
                        {AMENITY_ICONS[amenity]}
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.section>

            {/* Landlord Profile */}
            <motion.section variants={itemVariants}>
              <GlassCard className="card-hover card-hover-border">
                <h2 className="text-2xl font-bold mb-4">
                  <span className="text-gradient">Meet your landlord</span>
                </h2>
                <div className="divider-gradient mb-6" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -2 }}
                    className="relative flex-shrink-0"
                  >
                    <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl shadow-indigo-500/15">
                      <img
                        src={property.landlord.avatar}
                        alt={property.landlord.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {property.landlord.verified && (
                      <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 ring-4 ring-white">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-800">
                        {property.landlord.name}
                      </h3>
                      {property.landlord.verified && (
                        <GlassBadge variant="success">Verified Host</GlassBadge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-semibold">{property.landlord.rating}</span>
                        <span>rating</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold">{property.landlord.properties}</span>
                        <span>properties</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>{property.landlord.responseTime}</span>
                      </div>
                    </div>
                  </div>

                  <GlassButton
                    variant="primary"
                    size="lg"
                    leftIcon={<MessageSquare className="w-5 h-5" />}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="btn-gradient !border-transparent w-full sm:w-auto"
                  >
                    Message Landlord
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.section>

            {/* Nearby Places */}
            <motion.section variants={itemVariants}>
              <GlassCard className="card-hover">
                <h2 className="text-2xl font-bold mb-4">
                  <span className="text-gradient">Nearby places</span>
                </h2>
                <div className="divider-gradient mb-6" />
                <div className="grid sm:grid-cols-2 gap-4">
                  {NEARBY_PLACES.map((place, idx) => (
                    <motion.div
                      key={place.name}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.5 }}
                      whileHover={{ scale: 1.02, x: idx % 2 === 0 ? 4 : -4 }}
                      className="glass-subtle rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-400 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 text-indigo-600 flex items-center justify-center group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-400 flex-shrink-0">
                        {place.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 truncate">{place.name}</div>
                        <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          {place.distance} away
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.section>
          </div>

          {/* Right Column — Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={itemVariants}
              className="lg:sticky lg:top-8"
            >
              <GlassCard padding="none" className="overflow-hidden card-hover-border">
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold mb-2">
                    <span className="text-gradient">Book a Viewing</span>
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Schedule a visit and see this home in person
                  </p>

                  {/* Move-in Date */}
                  <div className="mb-5">
                    <label className="ds-label font-semibold">Move-in Date</label>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowCalendar(!showCalendar)
                          setShowDurationDropdown(false)
                        }}
                        className="ds-input w-full flex items-center justify-between !text-left text-slate-700 hover:border-indigo-400 transition-colors"
                      >
                        <span className={cn('flex items-center gap-2.5', !moveInDate && 'text-slate-400')}>
                          <Calendar className="w-4.5 h-4.5 text-indigo-500" />
                          {moveInDate || 'Select a date'}
                        </span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-slate-400 transition-transform duration-300',
                            showCalendar && 'rotate-180'
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.25 }}
                            className="absolute z-30 top-full mt-2 left-0 right-0 glass-strong rounded-2xl p-4 shadow-2xl shadow-indigo-500/10 border border-indigo-100"
                          >
                            <input
                              type="date"
                              value={moveInDate}
                              onChange={(e) => {
                                setMoveInDate(e.target.value)
                                setShowCalendar(false)
                              }}
                              className="ds-input w-full"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="mb-6">
                    <label className="ds-label font-semibold">Lease Duration</label>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowDurationDropdown(!showDurationDropdown)
                          setShowCalendar(false)
                        }}
                        className="ds-input w-full flex items-center justify-between !text-left text-slate-700 hover:border-indigo-400 transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Clock className="w-4.5 h-4.5 text-indigo-500" />
                          {duration}
                        </span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-slate-400 transition-transform duration-300',
                            showDurationDropdown && 'rotate-180'
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {showDurationDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.25 }}
                            className="absolute z-30 top-full mt-2 left-0 right-0 glass-strong rounded-2xl p-2 shadow-2xl shadow-indigo-500/10 border border-indigo-100"
                          >
                            {DURATION_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => {
                                  setDuration(opt)
                                  setShowDurationDropdown(false)
                                }}
                                className={cn(
                                  'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                                  duration === opt
                                    ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="glass-subtle rounded-2xl p-5 mb-6 space-y-4">
                    <div className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Payment Summary
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Rent ({months} month{months > 1 ? 's' : ''})</span>
                      <span className="font-semibold text-slate-800">{formatKES(rent)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Service fee</span>
                      <span className="font-semibold text-slate-800">{formatKES(serviceFee)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Escrow fee</span>
                      <span className="font-semibold text-slate-800">{formatKES(escrowFee)}</span>
                    </div>

                    <div className="divider-gradient" />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg font-bold text-slate-800">Total</span>
                      <span className="text-2xl font-extrabold text-gradient">
                        {formatKES(total)}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-gradient h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2.5 mb-4"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Viewing Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  {/* Secure Payments */}
                  <div className="glass-subtle rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Secure Payments</div>
                      <div className="text-xs text-slate-500">
                        Protected by HomePulse Escrow
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      256-bit SSL
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      No hidden fees
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
