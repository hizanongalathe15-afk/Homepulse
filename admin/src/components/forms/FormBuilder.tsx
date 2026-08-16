'use client'

import { useState } from 'react'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

interface FormBuilderProps {
  fields: FormField[]
  onSubmit: (data: Record<string, unknown>) => void
  submitLabel?: string
  initialData?: Record<string, unknown>
}

export function FormBuilder({ fields, onSubmit, submitLabel = 'Submit', initialData = {} }: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
      if (field.validation && field.validation.min !== undefined && typeof formData[field.name] === 'number') {
        if ((formData[field.name] as number) < field.validation.min) {
          newErrors[field.name] = field.validation.message || `${field.label} must be at least ${field.validation.min}`
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              className="admin-input min-h-[100px]"
              placeholder={field.placeholder}
              value={(formData[field.name] as string) || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ) : field.type === 'select' && field.options ? (
            <select
              className="admin-input"
              value={(formData[field.name] as string) || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              <option value="">Select an option</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={(formData[field.name] as boolean) || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
            />
          ) : (
            <input
              type={field.type}
              className="admin-input"
              placeholder={field.placeholder}
              value={(formData[field.name] as string) || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}

          {errors[field.name] && <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>}
        </div>
      ))}

      <button type="submit" className="admin-btn-primary">
        {submitLabel}
      </button>
    </form>
  )
}
