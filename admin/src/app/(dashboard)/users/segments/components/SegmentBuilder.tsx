'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { AdminButton } from '@/components/ui/AdminButton'
import { AdminInput } from '@/components/ui/AdminInput'
import { SectionCard } from '@/components/features/SectionCard'

interface Condition {
  field: string
  operator: string
  value: string
}

const defaultCondition: Condition = { field: 'role', operator: 'equals', value: 'tenant' }

const emptyCondition: Condition = { field: 'role', operator: 'equals', value: '' }

export default function SegmentBuilder() {
  const [name, setName] = useState('')
  const [conditions, setConditions] = useState<Condition[]>([{ ...defaultCondition }])

  const updateCondition = (index: number, key: keyof Condition, value: string) => {
    setConditions((prev) => prev.map((c, i) => (i === index ? { ...c, [key]: value } : c)))
  }

  const addCondition = () => {
    setConditions((prev) => [...prev, { ...emptyCondition }])
  }

  const removeCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <SectionCard title="Segment Builder" description="Define audience rules for targeting">
      <div className="space-y-4">
        <AdminInput
          label="Segment Name"
          placeholder="e.g. Verified Landlords in Nairobi"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Conditions <span className="text-slate-400">(all conditions must match)</span>
          </p>
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                className="admin-input h-9 w-auto text-sm"
                value={condition.field}
                onChange={(e) => updateCondition(index, 'field', e.target.value)}
              >
                <option value="role">Role</option>
                <option value="status">Status</option>
                <option value="city">City</option>
                <option value="trustScore">Trust Score</option>
                <option value="joinedAt">Joined At</option>
              </select>
              <select
                className="admin-input h-9 w-auto text-sm"
                value={condition.operator}
                onChange={(e) => updateCondition(index, 'operator', e.target.value)}
              >
                <option value="equals">equals</option>
                <option value="not_equals">not equals</option>
                <option value="contains">contains</option>
                <option value="greater_than">greater than</option>
                <option value="less_than">less than</option>
              </select>
              <AdminInput
                className="max-w-[200px] h-9"
                placeholder="Value"
                value={condition.value}
                onChange={(e) => updateCondition(index, 'value', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="p-2 rounded-md hover:bg-red-50 text-red-500"
                aria-label="Remove condition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <AdminButton variant="outline" size="sm" onClick={addCondition}>
            <Plus size={14} className="mr-1.5" /> Add Condition
          </AdminButton>
        </div>

        <div className="flex justify-end pt-2">
          <AdminButton disabled={name.trim() === '' || conditions.some((c) => c.value === '')}>
            Create Segment
          </AdminButton>
        </div>
      </div>
    </SectionCard>
  )
}