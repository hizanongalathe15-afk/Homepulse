'use client'

import { createContext, useContext } from 'react'

export interface AdminNotificationContextValue {
  notifications: Array<{
    id: string
    title: string
    message: string
    read: boolean
    createdAt: Date
  }>
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const AdminNotificationContext = createContext<AdminNotificationContextValue | undefined>(undefined)

export function useAdminNotifications() {
  const context = useContext(AdminNotificationContext)
  if (context === undefined) {
    throw new Error('useAdminNotifications must be used within an AdminNotificationProvider')
  }
  return context
}
