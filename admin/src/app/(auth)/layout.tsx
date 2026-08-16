import type { Metadata } from 'next'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import './../globals.css'

export const metadata: Metadata = {
  title: 'HomePulse Admin - Authentication',
  description: 'HomePulse Admin Authentication',
}

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  )
}
