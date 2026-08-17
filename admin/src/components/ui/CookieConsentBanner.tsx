'use client'

import { Cookie } from 'lucide-react'
import { useCookieConsent } from '@/contexts/CookieConsentContext'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, setConsent, hasConsented } =
    useCookieConsent()
  const [localConsent, setLocalConsent] = useState({
    analytics: true,
    marketing: false,
    preferences: true,
  })

  if (!showBanner || hasConsented) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:w-[420px] z-[100] pointer-events-none">
      <div
        className={cn(
          'pointer-events-auto p-6 space-y-4',
          'glass-card',
          'shadow-2xl shadow-black/30'
        )}
      >
        <div className="flex items-start gap-3">
          <Cookie className="w-6 h-6 text-glow-cyan shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">We value your privacy</h3>
            <p className="text-sm text-slate-600 mt-1">
              HomePulse uses cookies to improve your experience, analyze traffic, and personalize content. You can choose which cookies to accept.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-start justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-slate-800">Analytics</span>
              <p className="text-xs text-slate-500">Track site usage and performance</p>
            </div>
            <input
              type="checkbox"
              checked={localConsent.analytics}
              onChange={(e) =>
                setLocalConsent({ ...localConsent, analytics: e.target.checked })
              }
              className="mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
            />
          </label>
          <label className="flex items-start justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-slate-800">Marketing</span>
              <p className="text-xs text-slate-500">Personalized ads and promotions</p>
            </div>
            <input
              type="checkbox"
              checked={localConsent.marketing}
              onChange={(e) =>
                setLocalConsent({ ...localConsent, marketing: e.target.checked })
              }
              className="mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
            />
          </label>
          <label className="flex items-start justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-slate-800">Preferences</span>
              <p className="text-xs text-slate-500">Remember your settings</p>
            </div>
            <input
              type="checkbox"
              checked={localConsent.preferences}
              onChange={(e) =>
                setLocalConsent({ ...localConsent, preferences: e.target.checked })
              }
              className="mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
            />
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              rejectAll()
              setLocalConsent({ analytics: false, marketing: false, preferences: false })
            }}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => {
              setConsent({
                necessary: true,
                analytics: localConsent.analytics,
                marketing: localConsent.marketing,
                preferences: localConsent.preferences,
              })
            }}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Accept Selection
          </button>
        </div>

        <p className="text-xs text-slate-500">
          By clicking "Accept All", you agree to our{' '}
          <a
            href="/settings?tab=cookies"
            className="text-cyan-600 hover:underline"
          >
            Cookie Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
