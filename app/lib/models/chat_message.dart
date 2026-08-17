class ChatMessage {
  final String id;
  final String chatId;
  final String senderId;
  final String text;
  final String? attachmentUrl;
  final DateTime createdAt;
  final bool isRead;
  final bool isEdited;
  final bool isDeleted;
  final bool isForwarded;
  final String? forwardedFromName;
  final String? replyToMessageId;
  final bool isStarred;
  final bool isReported;
  final DateTime? seenAt;
  final DateTime? readAt;

  ChatMessage({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.text,
    this.attachmentUrl,
    required this.createdAt,
    this.isRead = false,
    this.isEdited = false,
    this.isDeleted = false,
    this.isForwarded = false,
    this.forwardedFromName,
    this.replyToMessageId,
    this.isStarred = false,
    this.isReported = false,
    this.seenAt,
    this.readAt,
  });

  ChatMessage copyWith({
    String? id,
    String? chatId,
    String? senderId,
    String? text,
    String? attachmentUrl,
    DateTime? createdAt,
    bool? isRead,
    bool? isEdited,
    bool? isDeleted,
    bool? isForwarded,
    String? forwardedFromName,
    String? replyToMessageId,
    bool? isStarred,
    bool? isReported,
    DateTime? seenAt,
    DateTime? readAt,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      chatId: chatId ?? this.chatId,
      senderId: senderId ?? this.senderId,
      text: text ?? this.text,
      attachmentUrl: attachmentUrl ?? this.attachmentUrl,
      createdAt: createdAt ?? this.createdAt,
      isRead: isRead ?? this.isRead,
      isEdited: isEdited ?? this.isEdited,
      isDeleted: isDeleted ?? this.isDeleted,
      isForwarded: isForwarded ?? this.isForwarded,
      forwardedFromName: forwardedFromName ?? this.forwardedFromName,
      replyToMessageId: replyToMessageId ?? this.replyToMessageId,
      isStarred: isStarred ?? this.isStarred,
      isReported: isReported ?? this.isReported,
      seenAt: seenAt ?? this.seenAt,
      readAt: readAt ?? this.readAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'chat_id': chatId,
      'sender_id': senderId,
      'text': text,
      'attachment_url': attachmentUrl,
      'created_at': createdAt.toIso8601String(),
      'is_read': isRead,
      'is_edited': isEdited,
      'is_deleted': isDeleted,
      'is_forwarded': isForwarded,
      'forwarded_from_name': forwardedFromName,
      'reply_to_message_id': replyToMessageId,
      'is_starred': isStarred,
      'is_reported': isReported,
      'seen_at': seenAt?.toIso8601String(),
      'read_at': readAt?.toIso8601String(),
    };
  }

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] as String,
      chatId: json['chat_id'] as String,
      senderId: json['sender_id'] as String,
      text: json['text'] as String,
      attachmentUrl: json['attachment_url'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      isRead: json['is_read'] as bool? ?? false,
      isEdited: json['is_edited'] as bool? ?? false,
      isDeleted: json['is_deleted'] as bool? ?? false,
      isForwarded: json['is_forwarded'] as bool? ?? false,
      forwardedFromName: json['forwarded_from_name'] as String?,
      replyToMessageId: json['reply_to_message_id'] as String?,
      isStarred: json['is_starred'] as bool? ?? false,
      isReported: json['is_reported'] as bool? ?? false,
      seenAt: json['seen_at'] != null ? DateTime.parse(json['seen_at'] as String) : null,
      readAt: json['read_at'] != null ? DateTime.parse(json['read_at'] as String) : null,
    );
  }
}
