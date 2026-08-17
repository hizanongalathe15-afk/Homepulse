import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/config/constants.dart';
import '../models/review.dart';

class ReviewService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<List<Review>> getReviews({String? targetId, String? targetType, String? authorId, int page = 1, int limit = 20}) async {
    final response = await _api.get('/reviews', queryParameters: {
      if (targetId != null) 'targetId': targetId,
      if (targetType != null) 'targetType': targetType,
      if (authorId != null) 'authorId': authorId,
      'page': page,
      'limit': limit,
    });
    final List<dynamic> data = response.data['data'] as List<dynamic>? ?? [];
    return data.map((json) => Review.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<Review> createReview(Map<String, dynamic> reviewData) async {
    final response = await _api.post('/reviews', data: reviewData);
    return Review.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<void> markHelpful(String reviewId) async {
    await _api.post('/reviews/$reviewId/helpful');
  }

  Future<void> unmarkHelpful(String reviewId) async {
    await _api.post('/reviews/$reviewId/unhelpful');
  }
}

final reviewServiceProvider = Provider<ReviewService>((ref) => ReviewService());

final userReviewsProvider = FutureProvider.family<List<Review>, String>((ref, userId) async {
  return ref.read(reviewServiceProvider).getReviews(authorId: userId, targetType: 'user');
});
