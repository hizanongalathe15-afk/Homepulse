import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/config/constants.dart';
import '../models/property.dart';

class FeedService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<List<Property>> fetchFeed({int page = 0, int limit = 10}) async {
    final response = await _api.get('/properties', queryParameters: {
      'page': page + 1,
      'limit': limit,
    });
    final List<dynamic> data = response.data['data'] as List<dynamic>? ?? [];
    return data.map((json) => Property.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<void> likeProperty(String propertyId) async {
    await _api.post('/properties/$propertyId/like');
  }

  Future<void> saveProperty(String propertyId) async {
    await _api.post('/properties/$propertyId/save');
  }
}

final feedServiceProvider = Provider<FeedService>((ref) => FeedService());
