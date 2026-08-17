import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/config/constants.dart';

class AnalyticsService {
  final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<void> recordEvent({
    required String eventType,
    String? entityType,
    String? entityId,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      await _api.post('/analytics/events', data: {
        'eventType': eventType,
        'entityType': entityType,
        'entityId': entityId,
        'metadata': metadata,
      });
    } catch (e) {
      // Silently ignore analytics errors - don't break UX
    }
  }

  Future<void> trackPageView(String page) async {
    await recordEvent(
      eventType: 'PAGE_VIEWED',
      entityType: 'page',
      entityId: page,
      metadata: {'platform': 'mobile'},
    );
  }

  Future<void> trackPropertyView(String propertyId) async {
    await recordEvent(
      eventType: 'PROPERTY_VIEWED',
      entityType: 'property',
      entityId: propertyId,
    );
  }

  Future<void> trackPropertySave(String propertyId) async {
    await recordEvent(
      eventType: 'PROPERTY_SAVED',
      entityType: 'property',
      entityId: propertyId,
    );
  }

  Future<void> trackPropertyLike(String propertyId) async {
    await recordEvent(
      eventType: 'PROPERTY_LIKED',
      entityType: 'property',
      entityId: propertyId,
    );
  }

  Future<Map<String, dynamic>> getRevenue(String landlordId) async {
    final response = await _api.get('/analytics/revenue?landlordId=$landlordId');
    return response.data as Map<String, dynamic>;
  }
}

final analyticsServiceProvider = Provider<AnalyticsService>((ref) => AnalyticsService());
