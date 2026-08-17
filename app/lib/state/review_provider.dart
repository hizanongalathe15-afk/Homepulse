import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/review_service.dart';
import '../models/review.dart';

final userReviewsProvider = FutureProvider.family<List<Review>, String>((ref, userId) async {
  final service = ref.read(reviewServiceProvider);
  return service.getReviews(authorId: userId);
});
