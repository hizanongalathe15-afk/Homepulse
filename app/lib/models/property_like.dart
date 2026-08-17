class PropertyLike {
  final String id;
  final String propertyId;
  final String userId;
  final DateTime createdAt;

  PropertyLike({
    required this.id,
    required this.propertyId,
    required this.userId,
    required this.createdAt,
  });

  factory PropertyLike.fromJson(Map<String, dynamic> json) => PropertyLike(
        id: json['id'] as String,
        propertyId: json['propertyId'] as String,
        userId: json['userId'] as String,
        createdAt: DateTime.parse(json['createdAt'] as String),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'propertyId': propertyId,
        'userId': userId,
        'createdAt': createdAt.toIso8601String(),
      };
}
