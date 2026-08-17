'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ConsentCategory = {
  id: string
  name: string
  description: string
  required: boolean
}

export type ConsentState = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export type CookieConsentContextValue = ConsentState & {
  hasConsented: boolean
  setConsent: (consent: Partial<ConsentState>) => void
  acceptAll: () => void
  rejectAll: () => void
  showPreferences: () => void
  hideBanner: () => void
  showBanner: boolean
}

const COOKIE_CONSENT_KEY = 'homepulse_cookie_consent'

export const consentCategories: ConsentCategory[] = [
  { id: 'necessary', name: 'Necessary', description: 'Essential for basic site operation', required: true },
  { id: 'analytics', name: 'Analytics', description: 'Help us understand how you use our site', required: false },
  { id: 'marketing', name: 'Marketing', description: 'Personalized ads and promotional content', required: false },
  { id: 'preferences', name: 'Preferences', description: 'Remember your settings and preferences', required: false },
]

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(
  undefined
)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState>(defaultConsent)
  const [hasConsented, setHasConsented] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as ConsentState
      setConsentState({ ...defaultConsent, ...parsed })
      setHasConsented(true)
      setShowBanner(false)
    } else {
      setShowBanner(true)
      setHasConsented(false)
    }
  }, [])

  const saveConsent = (newConsent: ConsentState) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent))
    }
    setConsentState(newConsent)
    setHasConsented(true)
    setShowBanner(false)
  }

  const setConsent = (partial: Partial<ConsentState>) => {
    saveConsent({ ...consent, ...partial })
  }

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    })
  }

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    })
  }

  const showPreferences = () => {
    setShowBanner(false)
  }

  const hideBanner = () => setShowBanner(false)

  const value: CookieConsentContextValue = {
    ...consent,
    hasConsented,
    setConsent,
    acceptAll,
    rejectAll,
    showPreferences,
    hideBanner,
    showBanner,
  }

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }
  return context
}
