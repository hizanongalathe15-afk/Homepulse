import PageTransition from '@/components/homespot/PageTransition'

export default function HomespotTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
