class PropertyComment {
  final String id;
  final String propertyId;
  final String userId;
  final String? parentId;
  final String content;
  final int likesCount;
  final bool isEdited;
  final bool isPinned;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;
  final CommentUser user;
  final List<PropertyComment> replies;

  PropertyComment({
    required this.id,
    required this.propertyId,
    required this.userId,
    this.parentId,
    required this.content,
    this.likesCount = 0,
    this.isEdited = false,
    this.isPinned = false,
    this.status = 'active',
    required this.createdAt,
    required this.updatedAt,
    required this.user,
    this.replies = const [],
  });

  factory PropertyComment.fromJson(Map<String, dynamic> json) {
    final repliesData = json['replies'] as List<dynamic>? ?? [];
    return PropertyComment(
      id: json['id'] as String,
      propertyId: json['propertyId'] as String,
      userId: json['userId'] as String,
      parentId: json['parentId'] as String?,
      content: json['content'] as String,
      likesCount: json['likesCount'] as int? ?? json['likes_count'] as int? ?? 0,
      isEdited: json['isEdited'] as bool? ?? json['is_edited'] as bool? ?? false,
      isPinned: json['isPinned'] as bool? ?? json['is_pinned'] as bool? ?? false,
      status: json['status'] as String? ?? 'active',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : (json['created_at'] != null
              ? DateTime.parse(json['created_at'] as String)
              : DateTime.now()),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : (json['updated_at'] != null
              ? DateTime.parse(json['updated_at'] as String)
              : DateTime.now()),
      user: json['user'] != null
          ? CommentUser.fromJson(json['user'] as Map<String, dynamic>)
          : (json['author'] != null
              ? CommentUser.fromJson(json['author'] as Map<String, dynamic>)
              : CommentUser(id: json['userId'] as String, firstName: '', lastName: '', role: '')),
      replies: repliesData
          .map((e) => PropertyComment.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'propertyId': propertyId,
        'userId': userId,
        'parentId': parentId,
        'content': content,
        'likesCount': likesCount,
        'isEdited': isEdited,
        'isPinned': isPinned,
        'status': status,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
        'user': user.toJson(),
        'replies': replies.map((e) => e.toJson()).toList(),
      };

  PropertyComment copyWith({
    String? id,
    String? propertyId,
    String? userId,
    String? parentId,
    String? content,
    int? likesCount,
    bool? isEdited,
    bool? isPinned,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
    CommentUser? user,
    List<PropertyComment>? replies,
  }) {
    return PropertyComment(
      id: id ?? this.id,
      propertyId: propertyId ?? this.propertyId,
      userId: userId ?? this.userId,
      parentId: parentId ?? this.parentId,
      content: content ?? this.content,
      likesCount: likesCount ?? this.likesCount,
      isEdited: isEdited ?? this.isEdited,
      isPinned: isPinned ?? this.isPinned,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      user: user ?? this.user,
      replies: replies ?? this.replies,
    );
  }
}

class CommentUser {
  final String id;
  final String firstName;
  final String lastName;
  final String? profileImage;
  final String role;

  CommentUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.profileImage,
    this.role = 'tenant',
  });

  factory CommentUser.fromJson(Map<String, dynamic> json) => CommentUser(
        id: json['id'] as String,
        firstName: json['firstName'] as String? ?? json['first_name'] as String? ?? '',
        lastName: json['lastName'] as String? ?? json['last_name'] as String? ?? '',
        profileImage: json['profileImage'] as String? ?? json['profile_image'] as String? ?? json['avatarUrl'] as String?,
        role: json['role'] as String? ?? 'tenant',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'firstName': firstName,
        'lastName': lastName,
        'profileImage': profileImage,
        'role': role,
      };

  String get fullName => '$firstName $lastName'.trim();

  String get initials {
    final first = firstName.isNotEmpty ? firstName[0] : '';
    final last = lastName.isNotEmpty ? lastName[0] : '';
    return '$first$last'.toUpperCase();
  }
}
