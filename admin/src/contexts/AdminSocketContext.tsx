'use client'

import { createContext, useContext } from 'react'

export interface AdminSocketContextValue {
  isConnected: boolean
  lastMessage: MessageEvent | null
  sendMessage: (data: unknown) => void
}

export const AdminSocketContext = createContext<AdminSocketContextValue | undefined>(undefined)

export function useAdminSocket() {
  const context = useContext(AdminSocketContext)
  if (context === undefined) {
    throw new Error('useAdminSocket must be used within an AdminSocketProvider')
  }
  return context
}
