class AnalyticsEvent {
  final String id;
  final String userId;
  final String eventName;
  final Map<String, dynamic> properties;
  final DateTime timestamp;

  AnalyticsEvent({
    required this.id,
    required this.userId,
    required this.eventName,
    required this.properties,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'event_name': eventName,
      'properties': properties,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory AnalyticsEvent.fromJson(Map<String, dynamic> json) {
    return AnalyticsEvent(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      eventName: json['event_name'] as String,
      properties: json['properties'] as Map<String, dynamic>,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );
  }
}

class AnalyticsSnapshot {
  final String id;
  final int views;
  final int inquiries;
  final int saves;
  final int shares;
  final int tours;
  final DateTime date;

  AnalyticsSnapshot({
    required this.id,
    this.views = 0,
    this.inquiries = 0,
    this.saves = 0,
    this.shares = 0,
    this.tours = 0,
    required this.date,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'views': views,
      'inquiries': inquiries,
      'saves': saves,
      'shares': shares,
      'tours': tours,
      'date': date.toIso8601String(),
    };
  }

  factory AnalyticsSnapshot.fromJson(Map<String, dynamic> json) {
    return AnalyticsSnapshot(
      id: json['id'] as String,
      views: json['views'] as int? ?? 0,
      inquiries: json['inquiries'] as int? ?? 0,
      saves: json['saves'] as int? ?? 0,
      shares: json['shares'] as int? ?? 0,
      tours: json['tours'] as int? ?? 0,
      date: DateTime.parse(json['date'] as String),
    );
  }
}
