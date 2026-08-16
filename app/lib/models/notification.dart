class Notification {
  final String id;
  final String title;
  final String body;
  final String type;
  final bool isRead;
  final DateTime createdAt;

  Notification({
    required this.id,
    required this.title,
    required this.body,
    this.type = 'general',
    this.isRead = false,
    required this.createdAt,
  });

  Notification copyWith({
    String? id,
    String? title,
    String? body,
    String? type,
    bool? isRead,
    DateTime? createdAt,
  }) {
    return Notification(
      id: id ?? this.id,
      title: title ?? this.title,
      body: body ?? this.body,
      type: type ?? this.type,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
