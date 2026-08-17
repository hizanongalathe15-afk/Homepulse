'use client'

import { Cookie, Download, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCookieConsent, consentCategories } from '@/contexts/CookieConsentContext'

type ConsentRecord = {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
}

export default function CookieSettings() {
  const { setConsent, hasConsented } = useCookieConsent()
  const [consents, setConsents] = useState<ConsentRecord[]>(() => {
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem('homepulse_cookie_consent')
      : null
    const parsed = stored ? JSON.parse(stored) : {}
    return consentCategories.map((cat) => ({
      ...cat,
      enabled: cat.required ? true : parsed[cat.id] ?? false,
    }))
  })

  useEffect(() => {
    const obj: Record<string, boolean> = {}
    for (const c of consents) {
      obj[c.id] = c.enabled
    }
    localStorage.setItem('homepulse_cookie_consent', JSON.stringify(obj))
  }, [consents])

  const toggleConsent = (id: string, enabled: boolean) => {
    if (consentCategories.find((c) => c.id === id)?.required) return
    setConsents(
      consents.map((c) => (c.id === id ? { ...c, enabled } : c))
    )
  }

  const saveAll = () => {
    const obj: Record<string, boolean> = {}
    for (const c of consents) {
      obj[c.id] = c.enabled
    }
    setConsent(obj)
  }

  const exportConsent = () => {
    const data = {
      consents,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'homepulse-cookie-consent.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cookie className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold text-slate-900">Cookie Settings</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportConsent}
            className="flex items-center gap-1 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setConsents(consents)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        Manage your cookie preferences. Necessary cookies are always active and cannot be disabled.
      </p>

      <div className="space-y-3">
        {consents.map((cat) => (
          <div
            key={cat.id}
            className="flex items-start justify-between p-3 rounded-lg bg-slate-50/50"
          >
            <div>
              <span className="font-medium text-slate-800">{cat.name}</span>
              <p className="text-xs text-slate-500">{cat.description}</p>
            </div>
            <label className="relative inline-flex h-5 w-9 items-center rounded-full">
              <input
                type="checkbox"
                className="default-checked:bg-cyan-600 focus:ring-cyan-600"
                checked={cat.enabled}
                disabled={cat.required}
                onChange={(e) => toggleConsent(cat.id, e.target.checked)}
              />
              <span className="sr-only">Toggle {cat.name}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="pt-2 flex gap-2">
        <button
          onClick={saveAll}
          className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Save Preferences
        </button>
        {hasConsented && (
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('homepulse_cookie_consent')
                window.location.reload()
              }
            }}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Reset Consent
          </button>
        )}
      </div>
    </div>
  )
}
