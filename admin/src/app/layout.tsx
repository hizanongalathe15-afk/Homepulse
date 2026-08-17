import type { Metadata } from 'next'
import { AdminAuthProvider } from '@/contexts/AdminAuthProvider'
import { AdminThemeProvider } from '@/contexts/AdminThemeProvider'
import { CookieConsentProvider } from '@/contexts/CookieConsentContext'
import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner'
import './globals.css'
import '@/styles/admin.css'
import '@/styles/charts.css'
import '@/styles/system.css'

export const metadata: Metadata = {
  title: 'HomePulse Admin',
  description: 'HomePulse Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
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
