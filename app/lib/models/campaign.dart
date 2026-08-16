class FeedPost {
  final String id;
  final String userId;
  final String userName;
  final String? userAvatarUrl;
  final String content;
  final String? imageUrl;
  final List<String> imageUrls;
  final String? propertyId;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final bool isLiked;
  final DateTime createdAt;

  const FeedPost({
    required this.id,
    required this.userId,
    required this.userName,
    this.userAvatarUrl,
    required this.content,
    this.imageUrl,
    this.imageUrls = const [],
    this.propertyId,
    this.likesCount = 0,
    this.commentsCount = 0,
    this.sharesCount = 0,
    this.isLiked = false,
    required this.createdAt,
  });

  factory FeedPost.fromJson(Map<String, dynamic> json) {
    return FeedPost(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      userName: json['user_name'] as String,
      userAvatarUrl: json['user_avatar_url'] as String?,
      content: json['content'] as String,
      imageUrl: json['image_url'] as String?,
      imageUrls: json['image_urls'] != null ? List<String>.from(json['image_urls']) : [],
      propertyId: json['property_id'] as String?,
      likesCount: json['likes_count'] as int? ?? 0,
      commentsCount: json['comments_count'] as int? ?? 0,
      sharesCount: json['shares_count'] as int? ?? 0,
      isLiked: json['is_liked'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'user_name': userName,
      'user_avatar_url': userAvatarUrl,
      'content': content,
      'image_url': imageUrl,
      'image_urls': imageUrls,
      'property_id': propertyId,
      'likes_count': likesCount,
      'comments_count': commentsCount,
      'shares_count': sharesCount,
      'is_liked': isLiked,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class FeedComment {
  final String id;
  final String postId;
  final String userId;
  final String userName;
  final String content;
  final DateTime createdAt;

  const FeedComment({
    required this.id,
    required this.postId,
    required this.userId,
    required this.userName,
    required this.content,
    required this.createdAt,
  });

  factory FeedComment.fromJson(Map<String, dynamic> json) {
    return FeedComment(
      id: json['id'] as String,
      postId: json['post_id'] as String,
      userId: json['user_id'] as String,
      userName: json['user_name'] as String,
      content: json['content'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }
}
