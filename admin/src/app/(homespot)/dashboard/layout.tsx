import UserDashboardLayout from '@/components/homespot/UserDashboardLayout'

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>
}
