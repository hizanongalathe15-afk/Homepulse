import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/models/app_notification.dart';
import '../services/notification_service.dart';

final notificationServiceProvider = Provider<NotificationService>((ref) => NotificationService());

class NotificationNotifier extends AsyncNotifier<List<AppNotification>> {
  late final NotificationService _notificationService = ref.read(notificationServiceProvider);

  @override
  Future<List<AppNotification>> build() async {
    return _notificationService.getNotifications();
  }

  Future<List<AppNotification>> getInAppNotifications({int page = 1, int limit = 20}) async {
    try {
      return await _notificationService.getNotifications(page: page, limit: limit);
    } on Exception catch (e) {
      rethrow;
    }
  }

  Future<void> registerPushToken(String token) async {
    try {
      await _notificationService.registerPushToken(token);
    } on Exception catch (e) {
      rethrow;
    }
  }

  Future<void> markAsRead(String notificationId) async {
    try {
      await _notificationService.markAsRead(notificationId);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data(current.map((n) => n.copyWith(isRead: true)).toList());
    } on Exception catch (e) {
      rethrow;
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _notificationService.markAllAsRead();
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data(current.map((n) => n.copyWith(isRead: true)).toList());
    } on Exception catch (e) {
      rethrow;
    }
  }

  Future<void> updatePreferences(Map<String, bool> preferences) async {
    try {
      await _notificationService.updatePreferences(preferences);
    } on Exception catch (e) {
      rethrow;
    }
  }
}

final notificationProvider = AsyncNotifierProvider<NotificationNotifier, List<AppNotification>>(() => NotificationNotifier());

final unreadNotificationsCountProvider = Provider<int>((ref) {
  final notifications = ref.watch(notificationProvider).valueOrNull ?? [];
  return notifications.where((n) => !n.isRead).length;
});

final notificationPreferencesProvider = StateProvider<Map<String, bool>>((ref) => {
  'push': true,
  'email': true,
  'sms': false,
  'in_app': true,
});
