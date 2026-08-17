'use client'

import { useEffect, useState } from 'react'
import { subscriptionService } from '@/services/adminSubscription.service'
import { cn } from '@/lib/utils'
import { CreditCard, TrendingUp, DollarSign, Users } from 'lucide-react'

type PlanData = {
  name: string
  price: number
  billingCycle: string
  subscribers: number
}

type RevenueData = {
  date: string
  revenue: number
  transactions: number
}

export default function SubscriptionAnalytics() {
  const [plans, setPlans] = useState<PlanData[]>([])
  const [revenue, setRevenue] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, revenueData] = await Promise.all([
          subscriptionService.getPopularPlans(),
          subscriptionService.getRevenueStats(30),
        ])
        setPlans(plansData)
        setRevenue(revenueData)
      } catch (error) {
        console.error('Failed to fetch subscription analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="glass-card p-6 space-y-4">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  const totalRevenue = revenue.reduce((sum, r) => sum + Number(r.revenue || 0), 0)
  const totalSubscribers = plans.reduce((sum, p) => sum + (p.subscribers || 0), 0)

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-cyan-500" />
        <h3 className="font-semibold text-slate-900">Subscription & Revenue</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">KSh {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Total Revenue (30d)</p>
        </div>
        <div className="bg-slate-50/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
          <p className="text-xs text-slate-500">Active Plans</p>
        </div>
        <div className="bg-slate-50/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{totalSubscribers}</p>
          <p className="text-xs text-slate-500">Total Subscribers</p>
        </div>
        <div className="bg-slate-50/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{revenue.length}</p>
          <p className="text-xs text-slate-500">Transactions</p>
        </div>
      </div>

      <div className="space-y-3">
        {plans
          .sort((a, b) => (b.subscribers || 0) - (a.subscribers || 0))
          .map((plan, idx) => (
            <div
              key={plan.name}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                    idx === 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : idx === 1
                        ? 'bg-slate-200 text-slate-600'
                        : idx === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-500'
                  )}
                >
                  #{idx + 1}
                </span>
                <div>
                  <span className="font-medium text-slate-800">{plan.name}</span>
                  <p className="text-xs text-slate-500">
                    {plan.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} plan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-900">
                  {plan.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 justify-end">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {plan.subscribers || 0} subs
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
