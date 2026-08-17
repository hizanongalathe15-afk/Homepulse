import type { Metadata } from 'next'
import { AdminAuthProvider } from '@/contexts/AdminAuthProvider'
import { AdminThemeProvider } from '@/contexts/AdminThemeProvider'
import './globals.css'
import '@/styles/admin.css'
import '@/styles/charts.css'

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
        <AdminAuthProvider>
          <AdminThemeProvider>
            {children}
          </AdminThemeProvider>
        </AdminAuthProvider>
      </body>
    </html>
  )
}
