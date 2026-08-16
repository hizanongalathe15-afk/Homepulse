'use client'

import { z } from 'zod'

export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; errors?: Record<string, string> } {
  try {
    schema.parse(data)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Validation failed' } }
  }
}
