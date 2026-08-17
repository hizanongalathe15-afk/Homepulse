'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AntigravityScrollProps {
  children: ReactNode
  className?: string
  stagger?: boolean
  parallax?: boolean
  floatIntensity?: number
}

export function AntigravityScroll({
  children,
  className,
  stagger = true,
  parallax = true,
  floatIntensity = 1,
}: AntigravityScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll('.antigravity-item')
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
      }
    )

    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!parallax) return

    const container = containerRef.current
    if (!container) return

    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const items = container.querySelectorAll<HTMLElement>('.antigravity-float.parallax')
          items.forEach((item) => {
            const rect = item.getBoundingClientRect()
            const speed = parseFloat(getComputedStyle(item).getPropertyValue('--parallax-speed')) || 0.05
            const viewportHeight = window.innerHeight
            const itemCenter = rect.top + rect.height / 2
            const distanceFromCenter = (itemCenter - viewportHeight / 2) / viewportHeight
            const floatOffset = Math.sin(Date.now() / 2000 + itemCenter) * 2 * floatIntensity
            const parallaxOffset = distanceFromCenter * speed * 20 * floatIntensity
            item.style.transform = `translateY(${floatOffset + parallaxOffset}px) translateZ(0)`
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [parallax, floatIntensity])

  return (
    <div
      ref={containerRef}
      className={cn('antigravity-scroll', stagger && 'antigravity-stagger', className)}
      data-parallax={parallax}
    >
      {children}
    </div>
  )
}

interface AntigravityItemProps {
  children: ReactNode
  className?: string
  delay?: 1 | 2 | 3
  float?: boolean
  parallaxSpeed?: number
}

export function AntigravityItem({
  children,
  className,
  delay,
  float = true,
  parallaxSpeed,
}: AntigravityItemProps) {
  const delayClass = delay ? `delay-${delay}` : ''
  const floatClass = float ? 'antigravity-float' : ''
  const parallaxClass = parallaxSpeed !== undefined ? 'parallax' : ''

  return (
    <div
      className={cn('antigravity-item', delayClass, floatClass, parallaxClass, className)}
      style={parallaxSpeed !== undefined ? { '--parallax-speed': parallaxSpeed } as React.CSSProperties : undefined}
    >
      {children}
    </div>
  )
}
