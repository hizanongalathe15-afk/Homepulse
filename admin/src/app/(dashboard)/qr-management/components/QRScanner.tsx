'use client'

import { useState } from 'react'
import { Scan } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

interface ScanResult {
  code: string
  target: string
  type: string
  scannedAt: string
}

export default function QRScanner() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)

  const scan = async (value: string) => {
    if (value.trim() === '') return
    setCode(value)
    setLoading(true)
    try {
      const response = await fetch('/api/qr/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: value.toUpperCase() }),
      })
      const data = await response.json()
      if (data.success) {
        setResult({
          code: value.toUpperCase(),
          target: data.data?.property?.title || data.data?.property?.address || 'Unknown Property',
          type: 'property',
          scannedAt: new Date().toLocaleString(),
        })
      } else {
        setResult({
          code: value.toUpperCase(),
          target: data.error || 'Invalid QR code',
          type: 'error',
          scannedAt: new Date().toLocaleString(),
        })
      }
    } catch {
      setResult({
        code: value.toUpperCase(),
        target: 'Scan failed',
        type: 'error',
        scannedAt: new Date().toLocaleString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard title="Scanner" description="Scan a QR code to preview its target">
      <div className="space-y-4">
        <AdminInput
          placeholder="Enter or scan a QR code..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && scan(code)}
        />
        <div className="flex gap-2">
            <AdminButton variant="outline" size="sm" onClick={() => scan(code)} loading={loading}>
              Scan
            </AdminButton>
        </div>

        {result ? (
          <div className="rounded-lg border border-slate-100 overflow-hidden">
            <div className="bg-primary/10 px-4 py-3 flex items-center gap-2">
              <Scan size={16} className="text-primary" />
              <span className="font-mono text-sm font-semibold text-primary">{result.code}</span>
            </div>
            <div className="px-4 py-3 space-y-2 text-sm">
              <p className="text-slate-700"><span className="text-slate-400">Target:</span> {result.target}</p>
              <p className="text-slate-700"><span className="text-slate-400">Type:</span> {result.type}</p>
              <p className="text-slate-700"><span className="text-slate-400">Scanned:</span> {result.scannedAt}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">No scan yet — enter a code above and press Scan</p>
        )}
      </div>
    </SectionCard>
  )
}