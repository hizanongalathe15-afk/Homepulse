class Payment {
  final String id;
  final String userId;
  final String type;
  final double amount;
  final String status;
  final DateTime createdAt;

  Payment({
    required this.id,
    required this.userId,
    required this.type,
    required this.amount,
    this.status = 'pending',
    required this.createdAt,
  });

  Payment copyWith({
    String? id,
    String? userId,
    String? type,
    double? amount,
    String? status,
    DateTime? createdAt,
  }) {
    return Payment(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      amount: amount ?? this.amount,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
