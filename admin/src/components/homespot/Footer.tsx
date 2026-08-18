'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Shield, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ],
  product: [
    { name: 'Browse Properties', href: '/properties' },
    { name: 'Explore Map', href: '/explore' },
    { name: 'List Property', href: '/list-property' },
    { name: 'Dashboard', href: '/dashboard' },
  ],
  support: [
    { name: 'Help Center', href: '/contact' },
    { name: 'Messages', href: '/messages' },
    { name: 'Checkout', href: '/checkout' },
    { name: 'Safety Guidelines', href: '/services' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px divider-gradient" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
              <Link href="/landing" className="flex items-center gap-2.5 group inline-flex">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-homespot flex items-center justify-center shadow-homespot">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-extrabold"><span className="text-gradient">Home</span><span className="text-foreground">Spot</span></span>
                  <span className="text-[10px] text-muted-foreground font-medium tracking-wide">FIND YOUR PERFECT HOME</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Kenya&apos;s most trusted property platform. Discover verified homes, connect with reliable landlords,
                and move with confidence using our escrow-protected rental process.
              </p>
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-subtle">
                <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Verified & Secure</p>
                  <p className="text-xs text-muted-foreground">All properties vetted by our team</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground"><Mail className="w-4 h-4 text-homespot-purple" /> support@homespot.co.ke</div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground"><Phone className="w-4 h-4 text-homespot-purple" /> +254 700 000 000</div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground"><MapPin className="w-4 h-4 text-homespot-purple" /> Nairobi, Kenya</div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([section, links], si) => (
              <motion.div key={section} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: si * 0.05 }} className="space-y-5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">{section}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="divider-gradient mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <motion.a key={social.label} href={social.href} whileHover={{ y: -3, scale: 1.1 }} className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-muted-foreground hover:text-homespot-purple border border-white/40" aria-label={social.label}>
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500" /> in Nairobi &copy; {new Date().getFullYear()} HomeSpot Kenya.
          </p>
        </div>
      </div>
    </footer>
  )
}
