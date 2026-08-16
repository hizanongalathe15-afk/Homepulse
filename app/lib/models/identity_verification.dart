class IdentityVerification {
  final String id;
  final String userId;
  final String type;
  final String documentUrl;
  final String status;
  final String? rejectionReason;
  final DateTime? verifiedAt;
  final DateTime createdAt;

  const IdentityVerification({
    required this.id,
    required this.userId,
    required this.type,
    required this.documentUrl,
    required this.status,
    this.rejectionReason,
    this.verifiedAt,
    required this.createdAt,
  });

  factory IdentityVerification.fromJson(Map<String, dynamic> json) {
    return IdentityVerification(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      type: json['type'] as String,
      documentUrl: json['document_url'] as String,
      status: json['status'] as String,
      rejectionReason: json['rejection_reason'] as String?,
      verifiedAt: json['verified_at'] != null ? DateTime.parse(json['verified_at'] as String) : null,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'type': type,
      'document_url': documentUrl,
      'status': status,
      'rejection_reason': rejectionReason,
      'verified_at': verifiedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }
}
