export class ChatModel {
  id: string;
  conversationId: string;
  senderId: string;
  sender: { id: string; firstName: string; lastName: string; profileImage?: string };
  receiverId: string;
  receiver: { id: string; firstName: string; lastName: string; profileImage?: string };
  content: string;
  type: string;
  mediaUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export class CreateChatData {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type?: string;
  mediaUrl?: string;
}

export class Conversation {
  id: string;
  participants: string[];
  lastMessage?: ChatModel;
  unreadCount: number;
}
