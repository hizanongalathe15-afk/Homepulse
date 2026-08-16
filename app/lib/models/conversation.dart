class Conversation {
  final String id;
  final List<String> participantIds;
  final String? lastMessage;
  final DateTime? lastMessageAt;
  final int unreadCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  Conversation({
    required this.id,
    required this.participantIds,
    this.lastMessage,
    this.lastMessageAt,
    this.unreadCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['id'] as String,
      participantIds: List<String>.from(json['participant_ids'] as List<dynamic>),
      lastMessage: json['last_message'] as String?,
      lastMessageAt: json['last_message_at'] != null ? DateTime.parse(json['last_message_at'] as String) : null,
      unreadCount: json['unread_count'] as int? ?? 0,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'participant_ids': participantIds,
      'last_message': lastMessage,
      'last_message_at': lastMessageAt?.toIso8601String(),
      'unread_count': unreadCount,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
