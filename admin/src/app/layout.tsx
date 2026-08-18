import type { Metadata } from 'next'
import { AdminAuthProvider } from '@/contexts/AdminAuthProvider'
import { AdminThemeProvider } from '@/contexts/AdminThemeProvider'
import { CookieConsentProvider } from '@/contexts/CookieConsentContext'
import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner'
import { CursorGlow } from '@/components/features/CursorGlow'
import './globals.css'
import '@/styles/admin.css'
import '@/styles/charts.css'
import '@/styles/system.css'

export const metadata: Metadata = {
  title: 'HomePulse - Find Your Perfect Home in Kenya',
  description: 'Discover verified properties, connect with trusted landlords, and experience secure renting like never before.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-mesh">
        <CursorGlow />
        <CookieConsentProvider>
          <AdminAuthProvider>
            <AdminThemeProvider>
              {children}
              <CookieConsentBanner />
            </AdminThemeProvider>
          </AdminAuthProvider>
        </CookieConsentProvider>
      </body>
    </html>
  )
}
