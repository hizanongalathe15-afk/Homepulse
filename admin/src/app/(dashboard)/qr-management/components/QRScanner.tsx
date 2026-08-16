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

const sampleCodes = ['HP-NBO-0012', 'HP-MSA-0088', 'HP-CMP-0042']

export default function QRScanner() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)

  const scan = (value: string) => {
    if (value.trim() === '') return
    setCode(value)
    setResult({
      code: value.toUpperCase(),
      target: 'Sunset Apartments, Westlands',
      type: 'property',
      scannedAt: new Date().toLocaleString(),
    })
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
        <div className="flex gap-2 flex-wrap">
          {sampleCodes.map((c) => (
            <AdminButton key={c} variant="outline" size="sm" onClick={() => scan(c)}>
              {c}
            </AdminButton>
          ))}
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
          <p className="text-sm text-slate-400 text-center py-6">No scan yet — enter or pick a code above</p>
        )}
      </div>
    </SectionCard>
  )
}