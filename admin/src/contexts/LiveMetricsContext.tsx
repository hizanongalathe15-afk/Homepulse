'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

export interface LiveMetricConfig {
  initialValue: number
  prefix?: string
  suffix?: string
  decimals?: number
  min: number
  max: number
  volatility: number
  isLive: boolean
}

export interface LiveMetricState extends LiveMetricConfig {
  value: number
  flickering: boolean
}

interface LiveMetricsContextValue {
  getMetric: (id: string) => LiveMetricState | undefined
  registerMetric: (id: string, config: LiveMetricConfig) => void
  unregisterMetric: (id: string) => void
}

const LiveMetricsContext = createContext<LiveMetricsContextValue | null>(null)

export function LiveMetricsProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<Record<string, LiveMetricState>>({})
  const metricsRef = useRef(metrics)
  metricsRef.current = metrics

  const registerMetric = useCallback((id: string, config: LiveMetricConfig) => {
    setMetrics(prev => {
      if (prev[id]) return prev
      return {
        ...prev,
        [id]: {
          ...config,
          value: config.initialValue,
          flickering: false,
        }
      }
    })
  }, [])

  const unregisterMetric = useCallback((id: string) => {
    setMetrics(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const getMetric = useCallback((id: string) => {
    return metricsRef.current[id]
  }, [])

  useEffect(() => {
    const tick = () => {
      const current = metricsRef.current
      const keys = Object.keys(current)
      if (keys.length === 0) return

      const count = Math.floor(Math.random() * 3) + 1
      const shuffled = keys.sort(() => Math.random() - 0.5).slice(0, count)
      const flickeringKeys: string[] = []

      setMetrics(prev => {
        const next = { ...prev }
        shuffled.forEach(key => {
          const metric = next[key]
          if (!metric) return
          const change = (Math.random() - 0.3) * metric.volatility
          let newValue = metric.value + change
          newValue = Math.max(metric.min, Math.min(metric.max, newValue))
          const decimals = metric.decimals ?? 0
          newValue = Math.round(newValue * Math.pow(10, decimals)) / Math.pow(10, decimals)
          next[key] = { ...metric, value: newValue, flickering: true }
          flickeringKeys.push(key)
        })
        return next
      })

      flickeringKeys.forEach(key => {
        setTimeout(() => {
          setMetrics(prev => {
            if (!prev[key]) return prev
            return { ...prev, [key]: { ...prev[key], flickering: false } }
          })
        }, 500)
      })
    }

    const interval = setInterval(tick, 2000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <LiveMetricsContext.Provider value={{ getMetric, registerMetric, unregisterMetric }}>
      {children}
    </LiveMetricsContext.Provider>
  )
}

export function useLiveMetric(id: string) {
  const context = useContext(LiveMetricsContext)
  if (!context) {
    throw new Error('useLiveMetric must be used within LiveMetricsProvider')
  }
  return context.getMetric(id)
}

export function useRegisterLiveMetric(id: string, config: LiveMetricConfig) {
  const { registerMetric, unregisterMetric } = useContext(LiveMetricsContext)!

  useEffect(() => {
    registerMetric(id, config)
    return () => unregisterMetric(id)
  }, [id, config.initialValue, config.min, config.max, config.volatility, config.isLive, config.decimals, config.prefix, config.suffix, registerMetric, unregisterMetric])
}
