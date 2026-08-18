'use client'

import Navbar from '@/components/homespot/Navbar'
import Footer from '@/components/homespot/Footer'

export default function PublicLayout({
  children,
  showFooter = true,
}: {
  children: React.ReactNode
  showFooter?: boolean
}) {
  return (
    <div className="relative min-h-screen bg-mesh overflow-hidden">
      <Navbar />
      {children}
      {showFooter && <Footer />}
    </div>
  )
}
