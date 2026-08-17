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
  final double? depositAmount;
  final String? depositStatus;
  final String paymentFrequency;
  final String? terms;
  final String? documentUrl;
  final DateTime? signedAt;
  final DateTime? terminatedAt;
  final DateTime createdAt;

  const Lease({
    required this.id,
    required this.propertyId,
    required this.tenantId,
    required this.landlordId,
    required this.startDate,
    required this.endDate,
    required this.amount,
    this.currency = 'KES',
    this.status = 'active',
    this.depositAmount,
    this.depositStatus,
    this.paymentFrequency = 'monthly',
    this.terms,
    this.documentUrl,
    this.signedAt,
    this.terminatedAt,
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
      currency: json['currency'] as String? ?? 'KES',
      status: json['status'] as String? ?? 'active',
      depositAmount: (json['deposit_amount'] as num?)?.toDouble(),
      depositStatus: json['deposit_status'] as String?,
      paymentFrequency: json['payment_frequency'] as String? ?? 'monthly',
      terms: json['terms'] as String?,
      documentUrl: json['document_url'] as String?,
      signedAt: json['signed_at'] != null ? DateTime.parse(json['signed_at'] as String) : null,
      terminatedAt: json['terminated_at'] != null ? DateTime.parse(json['terminated_at'] as String) : null,
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
      'deposit_amount': depositAmount,
      'deposit_status': depositStatus,
      'payment_frequency': paymentFrequency,
      'terms': terms,
      'document_url': documentUrl,
      'signed_at': signedAt?.toIso8601String(),
      'terminated_at': terminatedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }
}
