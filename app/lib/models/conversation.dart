class Conversation {
  final String id;
  final List<String> participantIds;
  final String? lastMessage;
  final DateTime? lastMessageAt;
  final int unreadCount;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isMuted;
  final DateTime? mutedUntil;
  final bool isPinned;
  final bool isArchived;
  final bool isPaused;
  final String? pausedBy;
  final DateTime? pausedAt;

  Conversation({
    required this.id,
    required this.participantIds,
    this.lastMessage,
    this.lastMessageAt,
    this.unreadCount = 0,
    required this.createdAt,
    required this.updatedAt,
    this.isMuted = false,
    this.mutedUntil,
    this.isPinned = false,
    this.isArchived = false,
    this.isPaused = false,
    this.pausedBy,
    this.pausedAt,
  });

  Conversation copyWith({
    String? id,
    List<String>? participantIds,
    String? lastMessage,
    DateTime? lastMessageAt,
    int? unreadCount,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isMuted,
    DateTime? mutedUntil,
    bool? isPinned,
    bool? isArchived,
    bool? isPaused,
    String? pausedBy,
    DateTime? pausedAt,
  }) {
    return Conversation(
      id: id ?? this.id,
      participantIds: participantIds ?? this.participantIds,
      lastMessage: lastMessage ?? this.lastMessage,
      lastMessageAt: lastMessageAt ?? this.lastMessageAt,
      unreadCount: unreadCount ?? this.unreadCount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isMuted: isMuted ?? this.isMuted,
      mutedUntil: mutedUntil ?? this.mutedUntil,
      isPinned: isPinned ?? this.isPinned,
      isArchived: isArchived ?? this.isArchived,
      isPaused: isPaused ?? this.isPaused,
      pausedBy: pausedBy ?? this.pausedBy,
      pausedAt: pausedAt ?? this.pausedAt,
    );
  }

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['id'] as String,
      participantIds: List<String>.from(json['participant_ids'] as List<dynamic>),
      lastMessage: json['last_message'] as String?,
      lastMessageAt: json['last_message_at'] != null ? DateTime.parse(json['last_message_at'] as String) : null,
      unreadCount: json['unread_count'] as int? ?? 0,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      isMuted: json['is_muted'] as bool? ?? false,
      mutedUntil: json['muted_until'] != null ? DateTime.parse(json['muted_until'] as String) : null,
      isPinned: json['is_pinned'] as bool? ?? false,
      isArchived: json['is_archived'] as bool? ?? false,
      isPaused: json['is_paused'] as bool? ?? false,
      pausedBy: json['paused_by'] as String?,
      pausedAt: json['paused_at'] != null ? DateTime.parse(json['paused_at'] as String) : null,
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
      'is_muted': isMuted,
      'muted_until': mutedUntil?.toIso8601String(),
      'is_pinned': isPinned,
      'is_archived': isArchived,
      'is_paused': isPaused,
      'paused_by': pausedBy,
      'paused_at': pausedAt?.toIso8601String(),
    };
  }
}
