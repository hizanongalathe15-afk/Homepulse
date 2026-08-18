'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  CreditCard,
  Building2,
  Phone,
  Shield,
  ChevronRight,
  Loader2,
  Home,
  BedDouble,
  MapPin,
  Clock,
  ArrowRight,
  Smartphone,
  Lock,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type StepStatus = 'done' | 'active' | 'pending'
type PaymentMethod = 'mpesa' | 'card' | 'bank'
type MpesaStep = 'idle' | 'sending' | 'phone-check' | 'pin-enter' | 'verify'

const steps = [
  { id: 1, name: 'Details', icon: Home },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Confirm', icon: Check },
]

const propertyData = {
  name: 'Modern 2BR Apartment',
  location: 'Westlands, Nairobi',
  bedrooms: 2,
  bathrooms: 2,
  image:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20luxury%202%20bedroom%20apartment%20exterior%20with%20balcony%20and%20city%20view%20in%20Nairobi%20Kenya%20warm%20sunset%20lighting&image_size=landscape_16_9',
  rent: 85000,
  duration: 12,
  serviceFee: 35000,
  escrowFee: 30000,
}

const propertyTotal =
  propertyData.rent * propertyData.duration +
  propertyData.serviceFee +
  propertyData.escrowFee

const formatKES = (amount: number) =>
  new Intl.NumberFormat('en-KE').format(amount)

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(2)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('2547')
  const [mpesaStep, setMpesaStep] = useState<MpesaStep>('idle')
  const [isVerifying, setIsVerifying] = useState(false)

  const getStepStatus = (stepId: number): StepStatus => {
    if (stepId < currentStep) return 'done'
    if (stepId === currentStep) return 'active'
    return 'pending'
  }

  const handleSendSTK = () => {
    if (phoneNumber.length < 10) return
    setMpesaStep('sending')
    setTimeout(() => setMpesaStep('phone-check'), 1500)
    setTimeout(() => setMpesaStep('pin-enter'), 3200)
  }

  const handleVerify = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setMpesaStep('idle')
      setCurrentStep(3)
    }, 2000)
  }

  const mpesaStatusSteps = [
    { key: 'sending', label: 'Sending request...', desc: 'Connecting to M-Pesa' },
    { key: 'phone-check', label: 'Check your phone...', desc: 'STK Push received' },
    { key: 'pin-enter', label: 'Enter PIN to complete', desc: 'Waiting for authorization' },
  ]

  return (
    <div className="min-h-screen bg-mesh bg-grid-fade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-2">
            Checkout
          </h1>
          <p className="text-slate-500">Complete your lease payment securely</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-3xl p-6 sm:p-8 mb-8 shadow-glass-lg"
        >
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, idx) => {
              const status = getStepStatus(step.id)
              const StepIcon = step.icon
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center relative z-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-500',
                        status === 'done' && 'step-done',
                        status === 'active' && 'step-active',
                        status === 'pending' && 'step-pending'
                      )}
                    >
                      {status === 'done' ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        'mt-3 text-sm font-semibold transition-colors duration-300',
                        status === 'done' && 'text-emerald-600',
                        status === 'active' && 'text-primary-600',
                        status === 'pending' && 'text-slate-400'
                      )}
                    >
                      {step.name}
                      {status === 'done' && ' Done'}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 mx-4 h-0.5 rounded-full overflow-hidden bg-slate-200">
                      <motion.div
                        initial={{ width: status === 'done' ? '0%' : '0%' }}
                        animate={{ width: status === 'done' ? '100%' : '0%' }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-full bg-gradient-homespot"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass rounded-3xl overflow-hidden shadow-glass card-hover-border">
              <div className="relative h-52 sm:h-56 overflow-hidden">
                <img
                  src={propertyData.image}
                  alt={propertyData.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="badge-verified">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {propertyData.name}
                  </h3>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {propertyData.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-5 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-primary-500" />
                    <span>{propertyData.bedrooms} BR</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-primary-500" />
                    <span>{propertyData.bathrooms} BA</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span>{propertyData.duration} months</span>
                  </div>
                </div>

                <div className="divider-gradient mb-5" />

                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Payment Summary
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Home className="w-4 h-4 text-slate-400" />
                      <span>
                        Rent ({propertyData.duration} mo × KES{' '}
                        {formatKES(propertyData.rent)})
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      KES {formatKES(propertyData.rent * propertyData.duration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>Service fee</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      KES {formatKES(propertyData.serviceFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>Escrow fee</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      KES {formatKES(propertyData.escrowFee)}
                    </span>
                  </div>
                </div>

                <div className="divider-gradient my-5" />

                <div className="flex items-center justify-between bg-gradient-homespot-soft rounded-2xl p-4">
                  <div>
                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-0.5">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      KES {formatKES(propertyTotal)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-homespot flex items-center justify-center shadow-homespot">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 shadow-glass">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">
                Payment Method
              </h4>
              <div className="space-y-3">
                {[
                  {
                    id: 'mpesa' as PaymentMethod,
                    label: 'M-Pesa',
                    sub: 'Send STK Push to your phone',
                    icon: Smartphone,
                    gradient: 'from-emerald-500 to-green-600',
                  },
                  {
                    id: 'card' as PaymentMethod,
                    label: 'Card',
                    sub: 'Credit or Debit card via Stripe',
                    icon: CreditCard,
                    gradient: 'from-blue-500 to-indigo-600',
                  },
                  {
                    id: 'bank' as PaymentMethod,
                    label: 'Bank Transfer',
                    sub: 'Direct wire transfer',
                    icon: Building2,
                    gradient: 'from-amber-500 to-orange-600',
                  },
                ].map((method) => {
                  const Icon = method.icon
                  const isActive = paymentMethod === method.id
                  return (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        'w-full text-left rounded-2xl p-4 border-2 transition-all duration-300 relative overflow-hidden',
                        isActive
                          ? 'border-primary-400 bg-gradient-homespot-soft shadow-[0_0_0_4px_rgba(99,102,241,0.08)]'
                          : 'border-white/60 bg-white/40 hover:border-slate-200 hover:bg-white/60'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0',
                            `bg-gradient-to-br ${method.gradient}`
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900">{method.label}</p>
                            {method.id === 'mpesa' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{method.sub}</p>
                        </div>
                        <div
                          className={cn(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0',
                            isActive
                              ? 'border-primary-500 bg-gradient-homespot'
                              : 'border-slate-300 bg-white'
                          )}
                        >
                          {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activePaymentGlow"
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{
                            boxShadow:
                              'inset 0 0 40px rgba(99,102,241,0.08)',
                          }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            <AnimatePresence mode="wait">
              {paymentMethod === 'mpesa' && (
                <motion.div
                  key="mpesa"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="glass rounded-3xl p-6 sm:p-8 shadow-glass-lg card-hover-border"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Smartphone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 font-display">
                        M-Pesa Payment
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Pay directly via M-Pesa STK Push
                      </p>
                    </div>
                  </div>

                  <div className="glass-strong rounded-2xl p-5 mb-6 border border-white/70">
                    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-primary-500" />
                        M-Pesa Phone Number
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                        +
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 12))
                        }
                        placeholder="2547XXXXXXXXX"
                        className="hs-input w-full pl-10 pr-24 py-3.5"
                        disabled={mpesaStep !== 'idle'}
                      />
                      <button
                        onClick={handleSendSTK}
                        disabled={
                          phoneNumber.length < 10 || mpesaStep !== 'idle'
                        }
                        className={cn(
                          'absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-1.5',
                          phoneNumber.length >= 10 && mpesaStep === 'idle'
                            ? 'btn-gradient text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        )}
                      >
                        {mpesaStep !== 'idle' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending
                          </>
                        ) : (
                          <>
                            Send STK Push
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      Enter the number registered with your M-Pesa account
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Payment Status
                    </h4>
                    <div className="space-y-2.5">
                      {mpesaStatusSteps.map((status, idx) => {
                        const statusIndex = mpesaStatusSteps.findIndex(
                          (s) => s.key === mpesaStep
                        )
                        const isDone =
                          statusIndex >
                          mpesaStatusSteps.findIndex((s) => s.key === status.key)
                        const isActive = status.key === mpesaStep
                        return (
                          <motion.div
                            key={status.key}
                            initial={false}
                            animate={{
                              opacity: isActive || isDone ? 1 : 0.5,
                            }}
                            className={cn(
                              'flex items-start gap-4 rounded-2xl p-4 transition-all duration-500',
                              isActive &&
                                'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100',
                              isDone && 'bg-emerald-50/50'
                            )}
                          >
                            <div className="shrink-0">
                              {isDone ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30"
                                >
                                  <Check className="w-5 h-5 text-white" />
                                </motion.div>
                              ) : isActive ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                  }}
                                  className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/30"
                                >
                                  <RefreshCw className="w-4.5 h-4.5 text-white" />
                                </motion.div>
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <p
                                className={cn(
                                  'font-semibold transition-colors duration-300',
                                  isActive || isDone
                                    ? 'text-slate-900'
                                    : 'text-slate-500'
                                )}
                              >
                                {status.label}
                              </p>
                              <p
                                className={cn(
                                  'text-sm mt-0.5 transition-colors duration-300',
                                  isActive ? 'text-emerald-600' : 'text-slate-400'
                                )}
                              >
                                {status.desc}
                              </p>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  {mpesaStep === 'pin-enter' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="glass-strong rounded-2xl p-6 mb-6 border-2 border-primary-200 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-homespot opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <h5 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                            <Lock className="w-4 h-4 text-primary-500" />
                            Verify Payment
                          </h5>
                          <p className="text-sm text-slate-500">
                            Once you've entered your M-Pesa PIN and confirmed the transaction, click below to verify.
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleVerify}
                          disabled={isVerifying}
                          className="btn-gradient px-6 py-3.5 rounded-2xl text-base font-bold flex items-center justify-center gap-2 shrink-0"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Shield className="w-5 h-5" />
                              Verify Payment
                              <ChevronRight className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {mpesaStep === 'idle' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-sm">
                        <RefreshCw className="w-4 h-4" />
                        Awaiting STK Push initiation
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {paymentMethod === 'card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="glass rounded-3xl p-6 sm:p-8 shadow-glass-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 font-display">
                        Card Payment
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Secure payment via Stripe
                      </p>
                    </div>
                  </div>
                  <div className="glass-strong rounded-2xl p-8 text-center">
                    <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-2">
                      Card payments coming soon
                    </p>
                    <p className="text-sm text-slate-400">
                      Please use M-Pesa or Bank Transfer for now
                    </p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'bank' && (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="glass rounded-3xl p-6 sm:p-8 shadow-glass-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 font-display">
                        Bank Transfer
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Direct wire transfer details
                      </p>
                    </div>
                  </div>
                  <div className="glass-strong rounded-2xl p-8 text-center">
                    <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-2">
                      Bank transfers coming soon
                    </p>
                    <p className="text-sm text-slate-400">
                      Please use M-Pesa for now
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-strong rounded-3xl p-6 sm:p-8 shadow-glass-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-homespot flex items-center justify-center shadow-homespot shrink-0">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Amount to Pay
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                      KES <span className="text-gradient">{formatKES(propertyTotal)}</span>
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gradient px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold flex items-center justify-center gap-2.5 w-full sm:w-auto shadow-homespot-lg"
                >
                  <Lock className="w-5 h-5" />
                  Pay KES {formatKES(propertyTotal)}
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 pt-5 border-t border-slate-200/60"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-semibold text-emerald-700">
                    Your payment is secured by escrow
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    SSL Encrypted
                  </span>
                  <span>•</span>
                  <span>Refundable within 14 days</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
