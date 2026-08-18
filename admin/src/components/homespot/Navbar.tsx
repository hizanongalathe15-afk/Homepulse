'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Menu, X, Search, ShieldCheck, User, LogIn, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Home', href: '/landing' },
  { name: 'Properties', href: '/properties' },
  { name: 'Explore', href: '/explore' },
  { name: 'Services', href: '/services' },
  { name: 'How it Works', href: '/how-it-works' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', isScrolled ? 'py-3' : 'py-5')}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className={cn('relative rounded-2xl transition-all duration-500 px-4 sm:px-6', isScrolled ? 'glass-strong shadow-homespot-lg' : 'glass shadow-glass')}>
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/landing" className="flex items-center gap-2.5 group">
              <motion.div whileHover={{ scale: 1.08, rotate: -5 }} className="relative w-10 h-10 rounded-xl bg-gradient-homespot flex items-center justify-center shadow-homespot overflow-hidden">
                <Home className="w-5 h-5 text-white relative z-10" />
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight">
                  <span className="text-gradient">Home</span>
                  <span className="text-foreground">Spot</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wide hidden sm:block">FIND YOUR PERFECT HOME</span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link, i) => (
                <motion.div key={link.name} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Link
                    href={link.href}
                    className={cn(
                      'relative px-3 py-2 text-sm font-semibold rounded-lg transition-colors group',
                      pathname === link.href
                        ? 'text-homespot-purple bg-homespot-purple/10'
                        : 'text-foreground/75 hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5'
                    )}
                  >
                    {link.name}
                    <span className={cn('absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-homespot rounded-full transition-all duration-300', pathname === link.href ? 'w-6' : 'w-0 group-hover:w-4')} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/properties">
                <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-white/50 transition-all">
                  <Search className="w-4 h-4" />
                  <span className="hidden lg:inline">Search</span>
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-white/50 transition-all">
                  <Compass className="w-4 h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-white/50 transition-all">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign In</span>
                </motion.button>
              </Link>
              <Link href="/list-property">
                <motion.button whileHover={{ scale: 1.03 }} className="btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>List Property</span>
                </motion.button>
              </Link>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/50 transition-colors">
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="container mx-auto px-4 sm:px-6 mt-2 xl:hidden">
            <div className="glass-strong rounded-2xl p-4 shadow-homespot-lg">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <Link href={link.href} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all', pathname === link.href ? 'text-homespot-purple bg-homespot-purple/10' : 'text-foreground/80 hover:bg-white/50')}>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="divider-gradient my-3" />
              <div className="flex flex-col gap-2">
                <Link href="/dashboard"><button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold glass-subtle border border-white/40">Dashboard</button></Link>
                <Link href="/login"><button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold glass-subtle border border-white/40"><LogIn className="w-4 h-4" /> Sign In</button></Link>
                <Link href="/list-property"><button className="w-full btn-gradient flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm"><User className="w-4 h-4" /> List Property</button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
