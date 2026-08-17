import { AdminLayout } from '@/components/layouts/AdminLayout'
import { LiveMetricsProvider } from '@/contexts/LiveMetricsContext'

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LiveMetricsProvider>
      <AdminLayout>{children}</AdminLayout>
    </LiveMetricsProvider>
  )
}
