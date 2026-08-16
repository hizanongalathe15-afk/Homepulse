class Neighborhood {
  final String id;
  final String name;
  final String city;
  final String country;
  final double? safetyRating;
  final int? population;
  final String? description;
  final double latitude;
  final double longitude;

  const Neighborhood({
    required this.id,
    required this.name,
    required this.city,
    required this.country,
    this.safetyRating,
    this.population,
    this.description,
    required this.latitude,
    required this.longitude,
  });

  factory Neighborhood.fromJson(Map<String, dynamic> json) {
    return Neighborhood(
      id: json['id'] as String,
      name: json['name'] as String,
      city: json['city'] as String,
      country: json['country'] as String,
      safetyRating: json['safety_rating'] != null ? (json['safety_rating'] as num).toDouble() : null,
      population: json['population'] as int?,
      description: json['description'] as String?,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'city': city,
      'country': country,
      'safety_rating': safetyRating,
      'population': population,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}

class CommunityEvent {
  final String id;
  final String neighborhoodId;
  final String title;
  final String description;
  final DateTime startDate;
  final DateTime endDate;
  final String? location;
  final String? imageUrl;
  final int attendeesCount;
  final bool isAttending;
  final DateTime createdAt;

  const CommunityEvent({
    required this.id,
    required this.neighborhoodId,
    required this.title,
    required this.description,
    required this.startDate,
    required this.endDate,
    this.location,
    this.imageUrl,
    this.attendeesCount = 0,
    this.isAttending = false,
    required this.createdAt,
  });

  factory CommunityEvent.fromJson(Map<String, dynamic> json) {
    return CommunityEvent(
      id: json['id'] as String,
      neighborhoodId: json['neighborhood_id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      startDate: DateTime.parse(json['start_date'] as String),
      endDate: DateTime.parse(json['end_date'] as String),
      location: json['location'] as String?,
      imageUrl: json['image_url'] as String?,
      attendeesCount: json['attendees_count'] as int? ?? 0,
      isAttending: json['is_attending'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'neighborhood_id': neighborhoodId,
      'title': title,
      'description': description,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate.toIso8601String(),
      'location': location,
      'image_url': imageUrl,
      'attendees_count': attendeesCount,
      'is_attending': isAttending,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class CommunityDiscussion {
  final String id;
  final String neighborhoodId;
  final String userId;
  final String userName;
  final String title;
  final String content;
  final int commentsCount;
  final int likesCount;
  final bool isPinned;
  final DateTime createdAt;

  const CommunityDiscussion({
    required this.id,
    required this.neighborhoodId,
    required this.userId,
    required this.userName,
    required this.title,
    required this.content,
    this.commentsCount = 0,
    this.likesCount = 0,
    this.isPinned = false,
    required this.createdAt,
  });

  factory CommunityDiscussion.fromJson(Map<String, dynamic> json) {
    return CommunityDiscussion(
      id: json['id'] as String,
      neighborhoodId: json['neighborhood_id'] as String,
      userId: json['user_id'] as String,
      userName: json['user_name'] as String,
      title: json['title'] as String,
      content: json['content'] as String,
      commentsCount: json['comments_count'] as int? ?? 0,
      likesCount: json['likes_count'] as int? ?? 0,
      isPinned: json['is_pinned'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'neighborhood_id': neighborhoodId,
      'user_id': userId,
      'user_name': userName,
      'title': title,
      'content': content,
      'comments_count': commentsCount,
      'likes_count': likesCount,
      'is_pinned': isPinned,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
