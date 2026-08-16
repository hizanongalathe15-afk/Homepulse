'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminInput } from '@/components/ui/AdminInput'
import { AdminButton } from '@/components/ui/AdminButton'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface Faq {
  id: number
  question: string
  answer: string
  published: boolean
}

const initial: Faq[] = [
  { id: 1, question: 'How do I pay rent with M-Pesa?', answer: 'Use your landlord\'s paybill or the in-app STK push option under Payments.', published: true },
  { id: 2, question: 'What documents do I need to verify?', answer: 'A national ID, proof of address and optionally a police clearance certificate.', published: true },
  { id: 3, question: 'Who holds the security deposit?', answer: 'Deposits are held in escrow and released per the lease agreement.', published: false },
]

export default function FAQManager() {
  const [faqs, setFaqs] = useState(initial)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const add = () => {
    if (question.trim() === '' || answer.trim() === '') return
    setFaqs((prev) => [...prev, { id: prev.length + 1, question: question.trim(), answer: answer.trim(), published: true }])
    setQuestion('')
    setAnswer('')
  }

  const toggle = (id: number) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, published: !f.published } : f)))
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="text-lg font-semibold text-slate-900">FAQ Items</h3>
      </div>
      <div className="admin-card-body space-y-4">
        <div className="space-y-2 rounded-lg border border-slate-100 p-3">
          <AdminInput placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <AdminInput placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <AdminButton size="sm" onClick={add}>
            <Plus size={14} className="mr-1.5" /> Add FAQ
          </AdminButton>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-md border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{faq.question}</p>
                  <p className="text-xs text-slate-500 mt-1">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${faq.published ? 'bg-primary' : 'bg-slate-300'}`}
                    aria-label="Toggle publish"
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${faq.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFaqs((prev) => prev.filter((f) => f.id !== faq.id))}
                    className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500"
                    aria-label="Delete FAQ"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}