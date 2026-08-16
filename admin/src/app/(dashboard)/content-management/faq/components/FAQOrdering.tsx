'use client'

import { useState } from 'react'
import { GripVertical } from 'lucide-react'

const initialOrder = [
  { id: 1, question: 'How do I pay rent with M-Pesa?' },
  { id: 2, question: 'How does the escrow system work?' },
  { id: 3, question: 'What documents do I need to verify?' },
  { id: 4, question: 'How do I report a dispute?' },
]

export default function FAQOrdering() {
  const [items] = useState(initialOrder)

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="text-lg font-semibold text-slate-900">Ordering</h3>
        <p className="text-sm text-slate-500">Drag to reorder displayed FAQs</p>
      </div>
      <div className="admin-card-body space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3 rounded-md border border-slate-100 px-3 py-2.5 cursor-grab bg-white">
            <GripVertical size={16} className="text-slate-300" />
            <span className="text-xs font-semibold text-slate-400 w-6">{index + 1}</span>
            <span className="text-sm font-medium text-slate-800">{item.question}</span>
          </div>
        ))}
        <p className="text-xs text-slate-400 pt-2">Changes are saved automatically when reordered.</p>
      </div>
    </div>
  )
}