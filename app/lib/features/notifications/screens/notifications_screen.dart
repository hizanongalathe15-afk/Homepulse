import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/state/auth_provider.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_toast.dart';
import 'package:homepulse/widgets/loading_spinner.dart';
import 'package:homepulse/services/notification_service.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final notificationsAsync = ref.watch(notificationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          IconButton(
            onPressed: () async {
              try {
                await ref.read(notificationServiceProvider).markAllAsRead();
                AppToast.success(context, 'All notifications marked as read');
                ref.invalidate(notificationsProvider);
              } catch (e) {
                AppToast.error(context, 'Failed to mark all as read');
              }
            },
            icon: const Icon(Icons.done_all_rounded),
            tooltip: 'Mark all as read',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(notificationsProvider),
        child: notificationsAsync.when(
          loading: () => const Center(child: LoadingSpinner()),
          error: (error, _) => Center(child: Text('Failed to load notifications')),
          data: (notifications) {
            if (notifications.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Icon(Icons.notifications_off_rounded, size: 64, color: AppColors.textTertiary),
                      const SizedBox(height: 16),
                      Text('No notifications yet', style: theme.textTheme.titleMedium),
                      const SizedBox(height: 8),
                      Text('We will notify you when something important happens.', style: theme.textTheme.bodyMedium),
                    ],
                  ),
                ),
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                return AppCard(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: Icon(
                      notification.type == 'alert' ? Icons.notifications_active_rounded :
                      notification.type == 'payment' ? Icons.payment_rounded :
                      notification.type == 'chat' ? Icons.chat_rounded :
                      Icons.notifications_rounded,
                      color: notification.isRead ? AppColors.textSecondary : AppColors.primary,
                    ),
                    title: Text(notification.title),
                    subtitle: Text(notification.body),
                    trailing: Text(
                      _formatDate(notification.createdAt),
                      style: theme.textTheme.bodySmall,
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
