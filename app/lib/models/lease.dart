class Lease {
  final String id;
  final String propertyId;
  final String tenantId;
  final String landlordId;
  final DateTime startDate;
  final DateTime endDate;
  final double amount;
  final String currency;
  final String status;
  final String? documentUrl;
  final DateTime createdAt;

  const Lease({
    required this.id,
    required this.propertyId,
    required this.tenantId,
    required this.landlordId,
    required this.startDate,
    required this.endDate,
    required this.amount,
    required this.currency,
    required this.status,
    this.documentUrl,
    required this.createdAt,
  });

  factory Lease.fromJson(Map<String, dynamic> json) {
    return Lease(
      id: json['id'] as String,
      propertyId: json['property_id'] as String,
      tenantId: json['tenant_id'] as String,
      landlordId: json['landlord_id'] as String,
      startDate: DateTime.parse(json['start_date'] as String),
      endDate: DateTime.parse(json['end_date'] as String),
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String? ?? 'USD',
      status: json['status'] as String,
      documentUrl: json['document_url'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'property_id': propertyId,
      'tenant_id': tenantId,
      'landlord_id': landlordId,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate.toIso8601String(),
      'amount': amount,
      'currency': currency,
      'status': status,
      'document_url': documentUrl,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
