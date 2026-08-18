'use client'

import { useState, useEffect } from 'react'
import { Palette, RefreshCw, Save, Eye, Mix, ZoomIn, ZoomOut } from 'lucide-react'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'
import { themeService } from '@/services/theme.service'
import type { SystemTheme } from '../../../shared/types/theme.types'

const colorKeys = [
  'primary',
  'primaryLight',
  'primaryDark',
  'secondary',
  'secondaryLight',
  'secondaryDark',
  'tertiary',
  'tertiaryLight',
  'tertiaryDark',
  'background',
  'surface',
  'surfaceVariant',
  'error',
  'onPrimary',
  'onSecondary',
  'onBackground',
  'onSurface',
  'onError',
  'textPrimary',
  'textSecondary',
  'textTertiary',
  'divider',
  'success',
  'warning',
  'info',
] as const

const colorLabels: Record<string, string> = {
  primary: 'Primary',
  primaryLight: 'Primary Light',
  primaryDark: 'Primary Dark',
  secondary: 'Secondary',
  secondaryLight: 'Secondary Light',
  secondaryDark: 'Secondary Dark',
  tertiary: 'Tertiary',
  tertiaryLight: 'Tertiary Light',
  tertiaryDark: 'Tertiary Dark',
  background: 'Background',
  surface: 'Surface',
  surfaceVariant: 'Surface Variant',
  error: 'Error',
  onPrimary: 'On Primary',
  onSecondary: 'On Secondary',
  onBackground: 'On Background',
  onSurface: 'On Surface',
  onError: 'On Error',
  textPrimary: 'Text Primary',
  textSecondary: 'Text Secondary',
  textTertiary: 'Text Tertiary',
  divider: 'Divider',
  success: 'Success',
  warning: 'Warning',
  info: 'Info',
}

const colorGroups: Record<string, string[]> = {
  Primary: ['primary', 'primaryLight', 'primaryDark'],
  Secondary: ['secondary', 'secondaryLight', 'secondaryDark'],
  Tertiary: ['tertiary', 'tertiaryLight', 'tertiaryDark'],
  'Surface': ['background', 'surface', 'surfaceVariant'],
  Semantic: ['error', 'onPrimary', 'onSecondary', 'onBackground', 'onSurface', 'onError'],
  Text: ['textPrimary', 'textSecondary', 'textTertiary'],
  'Status': ['divider', 'success', 'warning', 'info'],
}

export default function ThemeSettings() {
  const [theme, setTheme] = useState<SystemTheme | null>(null)
  const [workingColors, setWorkingColors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mixerA, setMixerA] = useState('#1A5276')
  const [mixerB, setMixerB] = useState('#2E86C1')
  const [mixerTarget, setMixerTarget] = useState<string>('primary')
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    loadTheme()
  }, [])

  async function loadTheme() {
    try {
      const data = await themeService.getTheme()
      setTheme(data)
      setWorkingColors(data.colors || themeService.getDefaultColors())
    } catch (err) {
      setWorkingColors(themeService.getDefaultColors())
    } finally {
      setIsLoading(false)
    }
  }

  function updateColor(key: string, value: string) {
    setWorkingColors((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  async function saveTheme() {
    setIsSaving(true)
    try {
      const updated = await themeService.updateTheme({
        name: theme?.name || 'Custom',
        colors: workingColors,
      })
      setTheme(updated)
      setHasChanges(false)
    } catch (err) {
      console.error('Failed to save theme:', err)
    } finally {
      setIsSaving(false)
    }
  }

  async function resetTheme() {
    if (!confirm('Reset all theme colors to defaults?')) return
    setIsSaving(true)
    try {
      const reset = await themeService.resetTheme()
      setTheme(reset)
      setWorkingColors(reset.colors)
      setHasChanges(false)
    } catch (err) {
      console.error('Failed to reset theme:', err)
    } finally {
      setIsSaving(false)
    }
  }

  function applyMix() {
    const hexA = hexToRgb(mixerA)
    const hexB = hexToRgb(mixerB)
    if (!hexA || !hexB) return
    const r = Math.round((hexA.r + hexB.r) / 2)
    const g = Math.round((hexA.g + hexB.g) / 2)
    const b = Math.round((hexA.b + hexB.b) / 2)
    const mixed = rgbToHex(r, g, b)
    updateColor(mixerTarget, mixed)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="System Theme"
        description="Customize the global color scheme that applies to all users and devices in real-time."
        icon={Palette}
      >
        <div className="flex gap-3 mb-4">
          <AdminButton
            type="button"
            variant="primary"
            disabled={!hasChanges || isSaving}
            icon={Save}
            onClick={saveTheme}
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </AdminButton>
          <AdminButton
            type="button"
            variant="secondary"
            icon={RefreshCw}
            onClick={resetTheme}
          >
            Reset
          </AdminButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(colorGroups).map(([groupName, keys]) => (
              <div key={groupName} className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700">{groupName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {keys.map((key) => (
                    <ColorPickerField
                      key={key}
                      label={colorLabels[key] || key}
                      value={workingColors[key] || '#FFFFFF'}
                      onChange={(val) => updateColor(key, val)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Mix className="w-4 h-4" />
                Color Mixer
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Blend two colors and apply the result to a theme slot.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600">Color A</label>
                  <input
                    type="color"
                    value={mixerA}
                    onChange={(e) => setMixerA(e.target.value)}
                    className="w-full h-8 p-0 border rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600">Color B</label>
                  <input
                    type="color"
                    value={mixerB}
                    onChange={(e) => setMixerB(e.target.value)}
                    className="w-full h-8 p-0 border rounded cursor-pointer"
                  />
                </div>
                <select
                  value={mixerTarget}
                  onChange={(e) => setMixerTarget(e.target.value)}
                  className="w-full text-sm border rounded px-2 py-1"
                >
                  {colorKeys.map((k) => (
                    <option key={k} value={k}>
                      {colorLabels[k] || k}
                    </option>
                  ))}
                </select>
                <button
                  onClick={applyMix}
                  className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium transition-colors"
                >
                  Apply 50/50 Mix
                </button>
              </div>
            </div>

            <LivePreview colors={workingColors} />
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (val: string) => void
}) {
  const [showPopover, setShowPopover] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)
    const hex = val.startsWith('#') ? val : `#${val}`
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex.toUpperCase())
    }
  }

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <div className="flex gap-2">
        <button
          onClick={() => setShowPopover(!showPopover)}
          className="relative w-10 h-8 rounded border cursor-pointer overflow-hidden flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setShowPopover(true)}
          className="flex-1 text-xs font-mono border rounded px-2 py-1"
          placeholder="#000000"
        />
      </div>
      {showPopover && (
        <div
          className="fixed z-50 bg-white border rounded shadow-lg"
          style={{
            top: 0,
            left: 0,
          }}
        >
          <input
            type="color"
            value={value.startsWith('#') ? value : `#${value}`}
            onChange={(e) => {
              onChange(e.target.value.toUpperCase())
              setInputValue(e.target.value.toUpperCase())
              setShowPopover(false)
            }}
            className="w-48 h-48 p-0 border-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}

function LivePreview({ colors }: { colors: Record<string, string> }) {
  const previewStyle: React.CSSProperties = {
    backgroundColor: colors['background'] || '#FAFAFA',
    '--preview-primary': colors['primary'] || '#1A5276',
    '--preview-secondary': colors['secondary'] || '#2E86C1',
    '--preview-accent': colors['tertiary'] || '#F39C12',
    '--preview-surface': colors['surface'] || '#FFFFFF',
    '--preview-error': colors['error'] || '#E53935',
    '--preview-text': colors['textPrimary'] || '#1A1A1A',
  } as React.CSSProperties

  return (
    <div className="p-4 bg-slate-50 rounded-lg border">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Live Preview
      </h3>
      <div
        className="border rounded-lg overflow-hidden"
        style={previewStyle}
      >
        <div
          className="h-10 px-3 flex items-center justify-between text-white"
          style={{ backgroundColor: `var(--preview-primary)` }}
        >
          <span className="font-semibold text-sm">Homepulse</span>
          <div className="flex gap-2">
            <button className="text-xs">🏠</button>
            <button className="text-xs">💬</button>
            <button className="text-xs">👤</button>
          </div>
        </div>
        <div className="p-3" style={{ color: `var(--preview-text)` }}>
          <div
            className="inline-block px-3 py-1 rounded text-white text-xs font-medium mb-2"
            style={{ backgroundColor: `var(--preview-primary)` }}
          >
            NEW
          </div>
          <p className="text-sm mb-3">Modern apartment in the city center.</p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-white text-xs rounded font-medium"
              style={{ backgroundColor: `var(--preview-primary)` }}
            >
              Primary Action
            </button>
            <button
              className="px-3 py-1 text-xs rounded font-medium border"
              style={{
                borderColor: `var(--preview-primary)`,
                color: `var(--preview-primary)`,
              }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '')
  if (cleaned.length === 6) {
    return {
      r: parseInt(cleaned.slice(0, 2), 16),
      g: parseInt(cleaned.slice(2, 4), 16),
      b: parseInt(cleaned.slice(4, 6), 16),
    }
  }
  return null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}
