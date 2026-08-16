'use client'

import { useState } from 'react'

interface FormWizardProps {
  steps: Array<{
    title: string
    content: React.ReactNode
  }>
  onComplete: (data: Record<string, unknown>) => void
}

export function FormWizard({ steps, onComplete }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const previous = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    onComplete(formData)
  }

  const updateFormData = (stepData: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span
              key={index}
              className={`text-xs ${
                index === currentStep ? 'text-primary font-medium' : 'text-slate-500'
              }`}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={previous}
          disabled={currentStep === 0}
          className="admin-btn-secondary disabled:opacity-50"
        >
          Previous
        </button>
        {currentStep === steps.length - 1 ? (
          <button type="button" onClick={handleComplete} className="admin-btn-primary">
            Complete
          </button>
        ) : (
          <button type="button" onClick={next} className="admin-btn-primary">
            Next
          </button>
        )}
      </div>
    </div>
  )
}
