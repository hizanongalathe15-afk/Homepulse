import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/analytics_snapshot.dart';

class AnalyticsNotifier extends AsyncNotifier<AnalyticsSnapshot?> {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);
  final List<AnalyticsEvent> _buffer = [];

  @override
  Future<AnalyticsSnapshot?> build() async {
    try {
      final response = await _api.get('/analytics/summary');
      return AnalyticsSnapshot.fromJson(response.data as Map<String, dynamic>);
    } on ApiException {
      return null;
    }
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
      await _api.post('/analytics/events', data: {
        'events': _buffer.map((e) => e.toJson()).toList(),
      });
      _buffer.clear();
    } on ApiException catch (_) {}
  }

  Future<AnalyticsSnapshot?> getSummary() async {
    try {
      final response = await _api.get('/analytics/summary');
      return AnalyticsSnapshot.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }
}

final analyticsProvider = AsyncNotifierProvider<AnalyticsNotifier, AnalyticsSnapshot?>(() => AnalyticsNotifier());
