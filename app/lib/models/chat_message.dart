class ChatMessage {
  final String id;
  final String chatId;
  final String senderId;
  final String text;
  final String? attachmentUrl;
  final DateTime createdAt;
  final bool isRead;

  ChatMessage({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.text,
    this.attachmentUrl,
    required this.createdAt,
    this.isRead = false,
  });

  ChatMessage copyWith({
    String? id,
    String? chatId,
    String? senderId,
    String? text,
    String? attachmentUrl,
    DateTime? createdAt,
    bool? isRead,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      chatId: chatId ?? this.chatId,
      senderId: senderId ?? this.senderId,
      text: text ?? this.text,
      attachmentUrl: attachmentUrl ?? this.attachmentUrl,
      createdAt: createdAt ?? this.createdAt,
      isRead: isRead ?? this.isRead,
    );
  }
}
