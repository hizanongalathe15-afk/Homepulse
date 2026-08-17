import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/analytics_snapshot.dart';

class AnalyticsService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<AnalyticsSnapshot?> getSummary() async {
    try {
      final response = await _api.get('/analytics/summary');
      return AnalyticsSnapshot.fromJson(response.data as Map<String, dynamic>);
    } on ApiException {
      return null;
    }
  }

  Future<AnalyticsSnapshot> getRevenue(String landlordId) async {
    final response = await _api.get('/analytics/revenue', queryParameters: {'landlord_id': landlordId});
    return AnalyticsSnapshot.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> trackEvent(String eventName, Map<String, dynamic> properties) async {
    await _api.post('/analytics/events', data: {
      'event_name': eventName,
      'properties': properties,
    });
  }

  Future<void> trackScreenView(String screenName) async {
    await trackEvent('screen_view', {'screen_name': screenName});
  }
}

final analyticsServiceProvider = Provider<AnalyticsService>((ref) => AnalyticsService());

class AnalyticsNotifier extends AsyncNotifier<AnalyticsSnapshot?> {
  late final AnalyticsService _analyticsService = ref.read(analyticsServiceProvider);
  final List<AnalyticsEvent> _buffer = [];

  @override
  Future<AnalyticsSnapshot?> build() async {
    return _analyticsService.getSummary();
  }

  Future<void> trackEvent(String eventName, Map<String, dynamic> properties) async {
    final event = AnalyticsEvent(
      id: '',
      userId: '',
      eventName: eventName,
      properties: properties,
      timestamp: DateTime.now(),
    );
    _buffer.add(event);
    if (_buffer.length >= 10) {
      await _flush();
    }
  }

  Future<void> trackScreenView(String screenName) async {
    await trackEvent('screen_view', {'screen_name': screenName});
  }

  Future<void> _flush() async {
    if (_buffer.isEmpty) return;
    try {
      await _analyticsService.trackEvent('batch_flush', {'events': _buffer.map((e) => e.toJson()).toList()});
      _buffer.clear();
    } on ApiException catch (_) {}
  }

  Future<AnalyticsSnapshot?> getSummary() async {
    return _analyticsService.getSummary();
  }
}

final analyticsProvider = AsyncNotifierProvider<AnalyticsNotifier, AnalyticsSnapshot?>(() => AnalyticsNotifier());
