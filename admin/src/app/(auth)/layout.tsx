import type { Metadata } from 'next'
import { AuthLayout } from '@/components/layouts/AuthLayout'

export const metadata: Metadata = {
  title: 'HomePulse Admin - Authentication',
  description: 'HomePulse Admin Authentication',
}

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}
