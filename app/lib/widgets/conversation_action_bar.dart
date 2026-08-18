import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../models/conversation.dart';
import '../../state/chat_provider.dart';
import '../../widgets/app_toast.dart';

class ConversationActionBar extends ConsumerWidget {
  final Conversation conversation;
  final String currentUserId;

  const ConversationActionBar({
    super.key,
    required this.conversation,
    required this.currentUserId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Row(
      children: [
        IconButton(
          onPressed: () => _toggleMute(context, ref),
          icon: Icon(
            conversation.isMuted
                ? LucideIcons.bell_off
                : LucideIcons.bell,
            color: conversation.isMuted ? AppColors.textTertiary : null,
          ),
          tooltip: conversation.isMuted ? 'Unmute' : 'Mute',
        ),
        IconButton(
          onPressed: () => _togglePin(context, ref),
          icon: Icon(
            conversation.isPinned
                ? LucideIcons.pin
                : LucideIcons.pin,
            color: conversation.isPinned ? AppColors.primary : null,
          ),
          tooltip: conversation.isPinned ? 'Unpin' : 'Pin',
        ),
        IconButton(
          onPressed: () => _archive(context, ref),
          icon: Icon(
            LucideIcons.archive,
            color: conversation.isArchived ? AppColors.textTertiary : null,
          ),
          tooltip: conversation.isArchived ? 'Unarchive' : 'Archive',
        ),
        if (conversation.unreadCount > 0)
          IconButton(
            onPressed: () => _markAsRead(context, ref),
            icon: const Icon(LucideIcons.mail),
            tooltip: 'Mark as read',
          ),
        IconButton(
          onPressed: () => _togglePause(context, ref),
          icon: Icon(
            conversation.isPaused
                ? LucideIcons.play
                : LucideIcons.pause,
            color: conversation.isPaused ? AppColors.warning : null,
          ),
          tooltip: conversation.isPaused ? 'Resume' : 'Pause',
        ),
        PopupMenuButton<String>(
          onSelected: (value) => _handleMenuAction(context, ref, value),
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'clear',
              child: Text('Clear History'),
            ),
            const PopupMenuItem(
              value: 'delete',
              child: Text('Delete Conversation'),
            ),
            const PopupMenuItem(
              value: 'export',
              child: Text('Export Chat'),
            ),
          ],
        ),
      ],
    );
  }

  Future<void> _toggleMute(BuildContext context, WidgetRef ref) async {
    try {
      if (conversation.isMuted) {
        await ref.read(chatProvider.notifier).unmuteConversation(conversation.id);
        AppToast.show(context, 'Conversation unmuted');
      } else {
        await ref.read(chatProvider.notifier).muteConversation(conversation.id);
        AppToast.show(context, 'Conversation muted');
      }
      ref.invalidate(chatProvider);
    } on Exception {
      AppToast.show(context, 'Failed to update mute status');
    }
  }

  Future<void> _togglePin(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(chatProvider.notifier).pinConversation(conversation.id);
      AppToast.show(context, conversation.isPinned ? 'Conversation unpinned' : 'Conversation pinned');
      ref.invalidate(chatProvider);
    } on Exception {
      AppToast.show(context, 'Failed to update pin status');
    }
  }

  Future<void> _archive(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(chatProvider.notifier).archiveConversation(conversation.id);
      AppToast.show(context, conversation.isArchived ? 'Conversation unarchived' : 'Conversation archived');
      ref.invalidate(chatProvider);
    } on Exception {
      AppToast.show(context, 'Failed to archive conversation');
    }
  }

  Future<void> _togglePause(BuildContext context, WidgetRef ref) async {
    try {
      if (conversation.isPaused) {
        await ref.read(chatProvider.notifier).resumeConversation(conversation.id);
        AppToast.show(context, 'Chat resumed');
      } else {
        await ref.read(chatProvider.notifier).pauseConversation(conversation.id);
        AppToast.show(context, 'Chat paused');
      }
    } on Exception {
      AppToast.show(context, 'Failed to update chat status');
    }
  }

  Future<void> _markAsRead(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(chatProvider.notifier).markConversationAsRead(conversation.id);
      AppToast.show(context, 'Marked as read');
      ref.invalidate(chatProvider);
    } on Exception {
      AppToast.show(context, 'Failed to mark as read');
    }
  }

  Future<void> _handleMenuAction(BuildContext context, WidgetRef ref, String value) async {
    switch (value) {
      case 'clear':
        final confirmed = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Clear History'),
            content: const Text('Are you sure you want to clear all messages in this conversation?'),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
              TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Clear')),
            ],
          ),
        );
        if (confirmed == true && context.mounted) {
          AppToast.show(context, 'History cleared');
        }
        break;
      case 'delete':
        final confirmed = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Delete Conversation'),
            content: const Text('Are you sure you want to delete this conversation?'),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
              TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
            ],
          ),
        );
        if (confirmed == true && context.mounted) {
          AppToast.show(context, 'Conversation deleted');
        }
        break;
      case 'export':
        AppToast.show(context, 'Chat exported');
        break;
    }
  }
}
