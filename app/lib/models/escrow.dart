class Escrow {
  final String id;
  final String propertyId;
  final String tenantId;
  final String landlordId;
  final double amount;
  final String currency;
  final String status;
  final DateTime createdAt;
  final DateTime? releasedAt;

  Escrow({
    required this.id,
    required this.propertyId,
    required this.tenantId,
    required this.landlordId,
    required this.amount,
    this.currency = 'KES',
    this.status = 'pending',
    required this.createdAt,
    this.releasedAt,
  });

  Escrow copyWith({
    String? id,
    String? propertyId,
    String? tenantId,
    String? landlordId,
    double? amount,
    String? currency,
    String? status,
    DateTime? createdAt,
    DateTime? releasedAt,
  }) {
    return Escrow(
      id: id ?? this.id,
      propertyId: propertyId ?? this.propertyId,
      tenantId: tenantId ?? this.tenantId,
      landlordId: landlordId ?? this.landlordId,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      releasedAt: releasedAt ?? this.releasedAt,
    );
  }
}

class EscrowTransaction {
  final String id;
  final String userId;
  final String type;
  final double amount;
  final String status;
  final DateTime createdAt;
  final String? referenceId;
  final String? description;

  EscrowTransaction({
    required this.id,
    required this.userId,
    required this.type,
    required this.amount,
    this.status = 'pending',
    required this.createdAt,
    this.referenceId,
    this.description,
  });

  EscrowTransaction copyWith({
    String? id,
    String? userId,
    String? type,
    double? amount,
    String? status,
    DateTime? createdAt,
    String? referenceId,
    String? description,
  }) {
    return EscrowTransaction(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      amount: amount ?? this.amount,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      referenceId: referenceId ?? this.referenceId,
      description: description ?? this.description,
    );
  }

  factory EscrowTransaction.fromJson(Map<String, dynamic> json) {
    return EscrowTransaction(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      type: json['type'] as String,
      amount: (json['amount'] as num).toDouble(),
      status: json['status'] as String? ?? 'pending',
      createdAt: DateTime.parse(json['created_at'] as String),
      referenceId: json['reference_id'] as String?,
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'type': type,
      'amount': amount,
      'status': status,
      'created_at': createdAt.toIso8601String(),
      'reference_id': referenceId,
      'description': description,
    };
  }
}
