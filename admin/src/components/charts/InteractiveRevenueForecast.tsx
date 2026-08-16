'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { SectionCard } from '@/components/features/SectionCard'
import { AdminButton } from '@/components/ui/AdminButton'
import { TrendingUp } from 'lucide-react'

interface ForecastDataPoint {
  month: string
  mpesa: number
  stripe: number
  bankTransfer: number
  baseline: number
}

interface InteractiveRevenueForecastProps {
  title?: string
  description?: string
  baseData?: ForecastDataPoint[]
}

const BASE_FORECAST: ForecastDataPoint[] = [
  { month: 'Sep', mpesa: 142000, stripe: 98000, bankTransfer: 45000, baseline: 285000 },
  { month: 'Oct', mpesa: 156000, stripe: 105000, bankTransfer: 48000, baseline: 309000 },
  { month: 'Nov', mpesa: 168000, stripe: 112000, bankTransfer: 51000, baseline: 331000 },
  { month: 'Dec', mpesa: 185000, stripe: 128000, bankTransfer: 58000, baseline: 371000 },
]

export default function InteractiveRevenueForecast({ title = 'Revenue Forecast', description = 'Interactive projected revenue across payment channels', baseData }: InteractiveRevenueForecastProps) {
  const [userGrowth, setUserGrowth] = useState(0)
  const [conversionBoost, setConversionBoost] = useState(0)
  const [seasonalityFactor, setSeasonalityFactor] = useState(100)

  const projectedData = useMemo(() => {
    const totalFactor = 1 + (userGrowth / 100) + (conversionBoost / 100) + ((seasonalityFactor - 100) / 100)
    return baseData || BASE_FORECAST.map((d) => ({
      month: d.month,
      mpesa: Math.round(d.mpesa * totalFactor),
      stripe: Math.round(d.stripe * totalFactor),
      bankTransfer: Math.round(d.bankTransfer * totalFactor),
      baseline: Math.round(d.baseline * totalFactor),
    }))
  }, [userGrowth, conversionBoost, seasonalityFactor, baseData])

  const totalProjected = projectedData.reduce((acc, d) => acc + d.baseline, 0)
  const baseTotal = (baseData || BASE_FORECAST).reduce((acc, d) => acc + d.baseline, 0)
  const variance = totalProjected - baseTotal

  const resetSliders = () => {
    setUserGrowth(0)
    setConversionBoost(0)
    setSeasonalityFactor(100)
  }

  return (
    <SectionCard title={title} description={description} action={
      <AdminButton variant="outline" size="sm" onClick={resetSliders}>
        Reset
      </AdminButton>
    }>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-slate-900/40 rounded-xl p-4 border border-command-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Projected Revenue</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  ${totalProjected.toLocaleString()}
                </p>
                <p className={cn('text-xs mt-1 font-medium', variance >= 0 ? 'text-command-emerald' : 'text-red-400')}>
                  {variance >= 0 ? '+' : ''}{variance.toLocaleString()} ({variance >= 0 ? '+' : ''}{((variance / baseTotal) * 100).toFixed(1)}%)
                </p>
              </div>
              <TrendingUp size={24} className="text-command-cyan" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={projectedData}>
                <defs>
                  <linearGradient id="mpesaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stripeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="bankGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#e2e8f0',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '11px' }} />
                <Line type="monotone" dataKey="mpesa" stroke="#06B6D4" strokeWidth={2} dot={{ r: 4, fill: '#06B6D4' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} name="M-Pesa" />
                <Line type="monotone" dataKey="stripe" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} name="Stripe" />
                <Line type="monotone" dataKey="bankTransfer" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} name="Bank Transfer" />
                <Line type="monotone" dataKey="baseline" stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="5 5" name="Baseline" opacity={0.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Scenario Adjustments</p>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300">User Growth</label>
                <span className={cn('text-xs font-mono font-medium', userGrowth > 0 ? 'text-command-emerald' : 'text-slate-400')}>
                  {userGrowth > 0 ? '+' : ''}{userGrowth}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={userGrowth}
                onChange={(e) => setUserGrowth(Number(e.target.value))}
                className="command-slider w-full"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>-30%</span>
                <span>+50%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300">Conversion Boost</label>
                <span className={cn('text-xs font-mono font-medium', conversionBoost > 0 ? 'text-command-violet' : 'text-slate-400')}>
                  {conversionBoost > 0 ? '+' : ''}{conversionBoost}%
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                value={conversionBoost}
                onChange={(e) => setConversionBoost(Number(e.target.value))}
                className="command-slider w-full"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>-20%</span>
                <span>+40%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300">Seasonality</label>
                <span className={cn('text-xs font-mono font-medium', seasonalityFactor > 100 ? 'text-command-cyan' : 'text-slate-400')}>
                  {seasonalityFactor}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="130"
                value={seasonalityFactor}
                onChange={(e) => setSeasonalityFactor(Number(e.target.value))}
                className="command-slider w-full"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>70%</span>
                <span>130%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 border border-command-border space-y-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Channel Breakdown</p>
            {projectedData.length > 0 && (() => {
              const totals = projectedData.reduce((acc, d) => ({
                mpesa: acc.mpesa + d.mpesa,
                stripe: acc.stripe + d.stripe,
                bankTransfer: acc.bankTransfer + d.bankTransfer,
              }), { mpesa: 0, stripe: 0, bankTransfer: 0 })
              const grandTotal = totals.mpesa + totals.stripe + totals.bankTransfer
              return (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-command-cyan" />
                      <span className="text-xs text-slate-300">M-Pesa</span>
                    </div>
                    <span className="text-xs font-mono text-slate-200">${totals.mpesa.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-command-violet" />
                      <span className="text-xs text-slate-300">Stripe</span>
                    </div>
                    <span className="text-xs font-mono text-slate-200">${totals.stripe.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-command-emerald" />
                      <span className="text-xs text-slate-300">Bank Transfer</span>
                    </div>
                    <span className="text-xs font-mono text-slate-200">${totals.bankTransfer.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-command-border pt-1.5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Total</span>
                    <span className="text-sm font-bold text-slate-100">${grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
