import 'dart:async';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/models/app_notification.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NotificationService {
  late final ApiClient _api = ApiClient(baseUrl: 'https://api.homepulse.app');

  Future<List<AppNotification>> getNotifications({int page = 1, int limit = 20}) async {
    final response = await _api.get('/notifications', queryParameters: {'page': page, 'limit': limit});
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => AppNotification.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> registerPushToken(String token) async {
    await _api.post('/notifications/register-push-token', data: {'token': token});
  }

  Future<void> markAsRead(String notificationId) async {
    await _api.post('/notifications/$notificationId/read');
  }

  Future<void> markAllAsRead() async {
    await _api.post('/notifications/mark-all-read');
  }

  Future<void> updatePreferences(Map<String, bool> preferences) async {
    await _api.put('/notifications/preferences', data: preferences);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('notification_prefs', preferences.toString());
  }
}

final notificationServiceProvider = Provider<NotificationService>((ref) => NotificationService());
