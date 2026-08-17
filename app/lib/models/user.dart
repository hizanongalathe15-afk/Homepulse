class User {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String avatarUrl;
  final String role;
  final bool isVerified;
  final bool isOnline;
  final DateTime? lastSeen;
  final int? responseTimeMinutes;
  final int totalProperties;
  final double? rating;
  final DateTime createdAt;
  final String? instagram;
  final String? twitter;
  final String? facebook;
  final String? linkedin;
  final String? tiktok;
  final String? youtube;
  final String? website;
  final String? bio;
  final bool showEmail;
  final bool showPhone;
  final bool showLocation;
  final bool showOnlineStatus;
  final bool showLastSeen;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.avatarUrl = '',
    this.role = 'tenant',
    this.isVerified = false,
    this.isOnline = false,
    this.lastSeen,
    this.responseTimeMinutes,
    this.totalProperties = 0,
    this.rating,
    required this.createdAt,
    this.instagram,
    this.twitter,
    this.facebook,
    this.linkedin,
    this.tiktok,
    this.youtube,
    this.website,
    this.bio,
    this.showEmail = true,
    this.showPhone = true,
    this.showLocation = true,
    this.showOnlineStatus = true,
    this.showLastSeen = true,
  });

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? avatarUrl,
    String? role,
    bool? isVerified,
    bool? isOnline,
    DateTime? lastSeen,
    int? responseTimeMinutes,
    int? totalProperties,
    double? rating,
    DateTime? createdAt,
    String? instagram,
    String? twitter,
    String? facebook,
    String? linkedin,
    String? tiktok,
    String? youtube,
    String? website,
    String? bio,
    bool? showEmail,
    bool? showPhone,
    bool? showLocation,
    bool? showOnlineStatus,
    bool? showLastSeen,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      role: role ?? this.role,
      isVerified: isVerified ?? this.isVerified,
      isOnline: isOnline ?? this.isOnline,
      lastSeen: lastSeen ?? this.lastSeen,
      responseTimeMinutes: responseTimeMinutes ?? this.responseTimeMinutes,
      totalProperties: totalProperties ?? this.totalProperties,
      rating: rating ?? this.rating,
      createdAt: createdAt ?? this.createdAt,
      instagram: instagram ?? this.instagram,
      twitter: twitter ?? this.twitter,
      facebook: facebook ?? this.facebook,
      linkedin: linkedin ?? this.linkedin,
      tiktok: tiktok ?? this.tiktok,
      youtube: youtube ?? this.youtube,
      website: website ?? this.website,
      bio: bio ?? this.bio,
      showEmail: showEmail ?? this.showEmail,
      showPhone: showPhone ?? this.showPhone,
      showLocation: showLocation ?? this.showLocation,
      showOnlineStatus: showOnlineStatus ?? this.showOnlineStatus,
      showLastSeen: showLastSeen ?? this.showLastSeen,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'avatar_url': avatarUrl,
      'role': role,
      'is_verified': isVerified,
      'is_online': isOnline,
      'last_seen': lastSeen?.toIso8601String(),
      'response_time_minutes': responseTimeMinutes,
      'total_properties': totalProperties,
      'rating': rating,
      'created_at': createdAt.toIso8601String(),
      'instagram': instagram,
      'twitter': twitter,
      'facebook': facebook,
      'linkedin': linkedin,
      'tiktok': tiktok,
      'youtube': youtube,
      'website': website,
      'bio': bio,
      'show_email': showEmail,
      'show_phone': showPhone,
      'show_location': showLocation,
      'show_online_status': showOnlineStatus,
      'show_last_seen': showLastSeen,
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      avatarUrl: json['avatar_url'] as String? ?? '',
      role: json['role'] as String? ?? 'tenant',
      isVerified: json['is_verified'] as bool? ?? false,
      isOnline: json['is_online'] as bool? ?? false,
      lastSeen: json['last_seen'] != null ? DateTime.parse(json['last_seen'] as String) : null,
      responseTimeMinutes: json['response_time_minutes'] as int?,
      totalProperties: json['total_properties'] as int? ?? 0,
      rating: (json['rating'] as num?)?.toDouble(),
      createdAt: DateTime.parse(json['created_at'] as String),
      instagram: json['instagram'] as String?,
      twitter: json['twitter'] as String?,
      facebook: json['facebook'] as String?,
      linkedin: json['linkedin'] as String?,
      tiktok: json['tiktok'] as String?,
      youtube: json['youtube'] as String?,
      website: json['website'] as String?,
      bio: json['bio'] as String?,
      showEmail: json['show_email'] as bool? ?? true,
      showPhone: json['show_phone'] as bool? ?? true,
      showLocation: json['show_location'] as bool? ?? true,
      showOnlineStatus: json['show_online_status'] as bool? ?? true,
      showLastSeen: json['show_last_seen'] as bool? ?? true,
    );
  }
}
