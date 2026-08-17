'use client'

import Link from 'next/link'
import { ArrowRight, Smartphone, Monitor, Tablet, MapPin, Shield, Clock, CreditCard, MessageCircle, QrCode, Home, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 font-sans">
      <header className="absolute top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              HomePulse
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Testimonials</Link>
            <Link href="#download" className="text-slate-600 hover:text-slate-900 transition-colors">Download</Link>
            <Link href="/login" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
              Login
            </Link>
          </nav>
          <button className="md:hidden p-2 text-slate-600 hover:text-slate-900">
            <span className="sr-only">Menu</span>
            <div className="w-5 h-5 flex flex-col gap-1">
              <span className="w-full h-0.5 bg-slate-600"></span>
              <span className="w-full h-0.5 bg-slate-600"></span>
              <span className="w-full h-0.5 bg-slate-600"></span>
            </div>
          </button>
        </div>
      </header>

      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect Home
              <span className="block bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                Fast, Verified, Real
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover properties curated for you. From verified listings to real-time chat with landlords,
              HomePulse makes finding your next home effortless.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/register">
                <button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-[1.02] flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/login">
                <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2">
                  Watch Demo
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <span>⭐ 4.9/5 from 12K+ users</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>🏠 5K+ verified properties</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>🚀 Available on web, iOS & Android</span>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="relative max-w-5xl mx-auto">
              <div className="relative bg-slate-900 rounded-[2rem] shadow-2xl shadow-black/40 overflow-hidden border border-slate-800">
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-slate-500">homepulse.app/feed</span>
                </div>
                <div className="aspect-video bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                  <div className="text-center text-slate-400">
                    <Smartphone className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p>Property feed preview</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    J
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    M
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    T
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-slate-600 max-w2xl mx-auto">A complete platform for tenants, landlords, and agents</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Maps</h3>
              <p className="text-slate-600">Find properties on an interactive map with real-time availability updates and location-based search.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Listings</h3>
              <p className="text-slate-600">Every property is verified by our team. Landlord profiles, safety scores, and authentic photos.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">In-App Chat</h3>
              <p className="text-slate-600">Chat directly with landlords. Real-time messaging with read receipts and typing indicators.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-slate-600">Pay rent via M-Pesa, Stripe, or bank transfer. Escrow protection built in.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <QrCode className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">QR Code Access</h3>
              <p className="text-slate-600">Scan QR codes for property details, virtual tours, and contactless entry.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Feed</h3>
              <p className="text-slate-600">AI-powered property recommendations based on your preferences and behavior.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="download" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Available on all platforms</h2>
            <p className="text-slate-600">Download the app or use the web version</p>
          </div>

          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <Smartphone className="w-20 h-20 mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">iOS App</p>
              <p className="font-semibold">Coming Soon</p>
            </div>
            <div className="text-center">
              <Smartphone className="w-20 h-20 mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">Android App</p>
              <p className="font-semibold">Available on Play Store</p>
            </div>
            <div className="text-center">
              <Monitor className="w-20 h-20 mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">Web Browser</p>
              <p className="font-semibold">app.homepulse.co</p>
            </div>
            <div className="text-center">
              <Tablet className="w-20 h-20 mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">Desktop App</p>
              <p className="font-semibold">Windows, macOS, Linux</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">HomePulse</span>
            </div>
            <p className="text-sm text-slate-500">© 2025 HomePulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
