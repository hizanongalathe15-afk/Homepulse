'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Upload, Building2, MapPin, BedDouble, DollarSign, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'
import PublicLayout from '@/components/homespot/PublicLayout'
import PageHero from '@/components/homespot/PageHero'
import { AntigravityScroll, AntigravityItem } from '@/components/features/AntigravityScroll'

const benefits = [
  'Free to list your first property',
  'Verified badge increases trust',
  'Reach 50K+ active tenants',
  'Escrow-protected rent collection',
  'In-app messaging with tenants',
  'Analytics dashboard included',
]

export default function ListPropertyPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: '',
    location: '',
    type: 'Apartment',
    bedrooms: '2',
    price: '',
    description: '',
  })

  return (
    <PublicLayout>
      <PageHero
        badge="For Landlords"
        badgeIcon={<Building2 className="w-3.5 h-3.5" />}
        title={<>List your property in <span className="text-gradient">minutes</span></>}
        subtitle="Join thousands of landlords earning rental income through Kenya's most trusted platform."
      />

      <section className="relative pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <AntigravityScroll>
                <AntigravityItem>
                  <div className="glass-strong rounded-3xl p-6 sm:p-8 sticky top-28">
                    <h3 className="text-xl font-bold mb-4">Why list on HomeSpot?</h3>
                    <ul className="space-y-3">
                      {benefits.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span className="text-foreground/80">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="divider-gradient my-6" />
                    <div className="flex items-center gap-3 p-4 rounded-2xl glass-subtle">
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                      <div>
                        <p className="font-bold text-sm">Verified Landlord Badge</p>
                        <p className="text-xs text-muted-foreground">Build trust with tenants instantly</p>
                      </div>
                    </div>
                  </div>
                </AntigravityItem>
              </AntigravityScroll>
            </div>

            <div className="lg:col-span-7">
              <AntigravityScroll>
                <AntigravityItem delay={2}>
                  <form
                    onSubmit={(e) => { e.preventDefault(); if (step < 3) setStep(step + 1) }}
                    className="glass-strong rounded-3xl p-6 sm:p-8 shadow-homespot-lg"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-gradient-homespot' : 'bg-white/40'}`} />
                      ))}
                    </div>

                    {step === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold mb-2">Basic Details</h3>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Property Title</label>
                          <input required className="w-full hs-input" placeholder="e.g. Modern 2BR in Westlands" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</label>
                          <input required className="w-full hs-input" placeholder="Westlands, Nairobi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Type</label>
                            <select className="w-full hs-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                              {['Apartment', 'Studio', 'House', 'Villa', 'Bedsitter'].map((t) => <option key={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block flex items-center gap-1"><BedDouble className="w-3 h-3" /> Bedrooms</label>
                            <select className="w-full hs-input" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}>
                              {['Studio', '1', '2', '3', '4+'].map((b) => <option key={b}>{b}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold mb-2">Pricing & Description</h3>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block flex items-center gap-1"><DollarSign className="w-3 h-3" /> Monthly Rent (KES)</label>
                          <input required type="number" className="w-full hs-input" placeholder="85000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Description</label>
                          <textarea required rows={5} className="w-full hs-input resize-none" placeholder="Describe your property..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="border-2 border-dashed border-homespot-purple/30 rounded-2xl p-8 text-center">
                          <Upload className="w-8 h-8 text-homespot-purple mx-auto mb-2" />
                          <p className="text-sm font-semibold">Upload Photos</p>
                          <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse</p>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-extrabold mb-2">Ready to publish!</h3>
                        <p className="text-muted-foreground mb-6">Create an account to submit your listing for verification.</p>
                        <Link href="/register">
                          <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient px-8 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2">
                            Create Account & Publish <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </Link>
                      </div>
                    )}

                    {step < 3 && (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        className="btn-gradient w-full mt-6 py-3.5 rounded-2xl text-sm font-semibold"
                      >
                        Continue
                      </motion.button>
                    )}
                  </form>
                </AntigravityItem>
              </AntigravityScroll>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
