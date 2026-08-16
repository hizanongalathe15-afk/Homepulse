class SosAlert {
  final String id;
  final String userId;
  final String message;
  final double? latitude;
  final double? longitude;
  final String status;
  final DateTime? resolvedAt;
  final DateTime createdAt;

  const SosAlert({
    required this.id,
    required this.userId,
    required this.message,
    this.latitude,
    this.longitude,
    required this.status,
    this.resolvedAt,
    required this.createdAt,
  });

  factory SosAlert.fromJson(Map<String, dynamic> json) {
    return SosAlert(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      message: json['message'] as String,
      latitude: json['latitude'] != null ? (json['latitude'] as num).toDouble() : null,
      longitude: json['longitude'] != null ? (json['longitude'] as num).toDouble() : null,
      status: json['status'] as String,
      resolvedAt: json['resolved_at'] != null ? DateTime.parse(json['resolved_at'] as String) : null,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'message': message,
      'latitude': latitude,
      'longitude': longitude,
      'status': status,
      'resolved_at': resolvedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }
}
