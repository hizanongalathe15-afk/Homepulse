class Referral {
  final String id;
  final String referrerId;
  final String refereeId;
  final String code;
  final String status;
  final int rewardPoints;
  final DateTime? claimedAt;
  final DateTime createdAt;

  const Referral({
    required this.id,
    required this.referrerId,
    required this.refereeId,
    required this.code,
    required this.status,
    required this.rewardPoints,
    this.claimedAt,
    required this.createdAt,
  });

  factory Referral.fromJson(Map<String, dynamic> json) {
    return Referral(
      id: json['id'] as String,
      referrerId: json['referrer_id'] as String,
      refereeId: json['referee_id'] as String,
      code: json['code'] as String,
      status: json['status'] as String,
      rewardPoints: json['reward_points'] as int,
      claimedAt: json['claimed_at'] != null ? DateTime.parse(json['claimed_at'] as String) : null,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'referrer_id': referrerId,
      'referee_id': refereeId,
      'code': code,
      'status': status,
      'reward_points': rewardPoints,
      'claimed_at': claimedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }
}
