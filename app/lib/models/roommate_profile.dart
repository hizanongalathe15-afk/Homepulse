class RoommateProfile {
  final String id;
  final String userId;
  final String bio;
  final int? age;
  final String? gender;
  final List<String> interests;
  final String occupation;
  final String budgetRange;
  final String preferredNeighborhood;
  final bool isLooking;
  final double? compatibilityScore;
  final DateTime createdAt;

  const RoommateProfile({
    required this.id,
    required this.userId,
    required this.bio,
    this.age,
    this.gender,
    this.interests = const [],
    required this.occupation,
    required this.budgetRange,
    required this.preferredNeighborhood,
    this.isLooking = true,
    this.compatibilityScore,
    required this.createdAt,
  });

  factory RoommateProfile.fromJson(Map<String, dynamic> json) {
    return RoommateProfile(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      bio: json['bio'] as String,
      age: json['age'] as int?,
      gender: json['gender'] as String?,
      interests: json['interests'] != null ? List<String>.from(json['interests']) : [],
      occupation: json['occupation'] as String,
      budgetRange: json['budget_range'] as String,
      preferredNeighborhood: json['preferred_neighborhood'] as String,
      isLooking: json['is_looking'] as bool? ?? true,
      compatibilityScore: json['compatibility_score'] != null ? (json['compatibility_score'] as num).toDouble() : null,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'bio': bio,
      'age': age,
      'gender': gender,
      'interests': interests,
      'occupation': occupation,
      'budget_range': budgetRange,
      'preferred_neighborhood': preferredNeighborhood,
      'is_looking': isLooking,
      'compatibility_score': compatibilityScore,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
