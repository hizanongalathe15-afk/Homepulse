export interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'in_progress' | 'resolved' | 'escalated'
  priority: 'low' | 'medium' | 'high' | 'critical'
  userId: string
  userName: string
  assignee: string
  category: 'payments' | 'technical' | 'legal' | 'listings' | 'other'
  createdAt: Date
  updatedAt: Date
  messages: number
}

export interface SupportMessage {
  id: string
  ticketId: string
  senderId: string
  senderName: string
  senderRole: 'customer' | 'agent' | 'system'
  content: string
  timestamp: Date
}
