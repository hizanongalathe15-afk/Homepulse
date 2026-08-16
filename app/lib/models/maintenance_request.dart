class MaintenanceRequest {
  final String id;
  final String propertyId;
  final String userId;
  final String title;
  final String description;
  final String priority;
  final String status;
  final String? assignedTo;
  final DateTime? resolvedAt;
  final DateTime createdAt;

  const MaintenanceRequest({
    required this.id,
    required this.propertyId,
    required this.userId,
    required this.title,
    required this.description,
    required this.priority,
    required this.status,
    this.assignedTo,
    this.resolvedAt,
    required this.createdAt,
  });

  factory MaintenanceRequest.fromJson(Map<String, dynamic> json) {
    return MaintenanceRequest(
      id: json['id'] as String,
      propertyId: json['property_id'] as String,
      userId: json['user_id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      priority: json['priority'] as String,
      status: json['status'] as String,
      assignedTo: json['assigned_to'] as String?,
      resolvedAt: json['resolved_at'] != null ? DateTime.parse(json['resolved_at'] as String) : null,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'property_id': propertyId,
      'user_id': userId,
      'title': title,
      'description': description,
      'priority': priority,
      'status': status,
      'assigned_to': assignedTo,
      'resolved_at': resolvedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }
}
