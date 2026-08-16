class Banner {
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final String? deepLink;
  final String position;
  final bool isActive;
  final DateTime? startsAt;
  final DateTime? endsAt;
  final DateTime createdAt;

  const Banner({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    this.deepLink,
    required this.position,
    this.isActive = true,
    this.startsAt,
    this.endsAt,
    required this.createdAt,
  });

  factory Banner.fromJson(Map<String, dynamic> json) {
    return Banner(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      imageUrl: json['image_url'] as String,
      deepLink: json['deep_link'] as String?,
      position: json['position'] as String? ?? 'home',
      isActive: json['is_active'] as bool? ?? true,
      startsAt: json['starts_at'] != null ? DateTime.parse(json['starts_at'] as String) : null,
      endsAt: json['ends_at'] != null ? DateTime.parse(json['ends_at'] as String) : null,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'image_url': imageUrl,
      'deep_link': deepLink,
      'position': position,
      'is_active': isActive,
      'starts_at': startsAt?.toIso8601String(),
      'ends_at': endsAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class BannerImpression {
  final String id;
  final String bannerId;
  final String userId;
  final DateTime viewedAt;

  const BannerImpression({
    required this.id,
    required this.bannerId,
    required this.userId,
    required this.viewedAt,
  });

  factory BannerImpression.fromJson(Map<String, dynamic> json) {
    return BannerImpression(
      id: json['id'] as String,
      bannerId: json['banner_id'] as String,
      userId: json['user_id'] as String,
      viewedAt: DateTime.parse(json['viewed_at'] as String),
    );
  }
}
