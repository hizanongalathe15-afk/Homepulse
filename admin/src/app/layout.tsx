import type { Metadata } from 'next'
import { AdminLayout } from '@/components/layouts/AdminLayout'
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
            <AdminLayout>{children}</AdminLayout>
          </AdminThemeProvider>
        </AdminAuthProvider>
      </body>
    </html>
  )
}
