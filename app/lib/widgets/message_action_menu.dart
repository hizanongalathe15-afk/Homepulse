import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../models/chat_message.dart';
import '../../state/chat_provider.dart';
import '../../widgets/app_toast.dart';

class MessageActionMenu extends ConsumerWidget {
  final ChatMessage message;
  final String currentUserId;
  final VoidCallback? onReply;
  final VoidCallback? onForward;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onStar;
  final VoidCallback? onReport;

  const MessageActionMenu({
    super.key,
    required this.message,
    required this.currentUserId,
    this.onReply,
    this.onForward,
    this.onEdit,
    this.onDelete,
    this.onStar,
    this.onReport,
  });

  bool get _isOwnMessage => message.senderId == currentUserId;
  bool get _canEdit => _isOwnMessage && !message.isDeleted && !message.isForwarded;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        top: 12,
        left: 16,
        right: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      child: Wrap(
        children: [
          if (_canEdit)
            _ActionTile(
              icon: LucideIcons.pencil,
              label: 'Edit',
              color: AppColors.primary,
              onTap: () {
                Navigator.of(context).pop();
                onEdit?.call();
              },
            ),
          if (_isOwnMessage)
            _ActionTile(
              icon: LucideIcons.trash_2,
              label: 'Delete',
              color: AppColors.error,
              onTap: () {
                Navigator.of(context).pop();
                onDelete?.call();
              },
            ),
          _ActionTile(
            icon: Icons.forward_outlined,
            label: 'Forward',
            color: AppColors.primary,
            onTap: () {
              Navigator.of(context).pop();
              onForward?.call();
            },
          ),
          _ActionTile(
            icon: message.isStarred ? Icons.star_rounded : Icons.star_border_rounded,
            label: message.isStarred ? 'Unstar' : 'Star',
            color: AppColors.save,
            onTap: () {
              Navigator.of(context).pop();
              onStar?.call();
            },
          ),
          _ActionTile(
            icon: Icons.copy_outlined,
            label: 'Copy',
            color: AppColors.textSecondary,
            onTap: () {
              Navigator.of(context).pop();
              Clipboard.setData(ClipboardData(text: message.text));
              AppToast.show(context, 'Copied to clipboard');
            },
          ),
          _ActionTile(
            icon: Icons.reply_outlined,
            label: 'Reply',
            color: AppColors.primary,
            onTap: () {
              Navigator.of(context).pop();
              onReply?.call();
            },
          ),
          if (_isOwnMessage && !message.isDeleted)
            _ActionTile(
              icon: Icons.flag_outlined,
              label: 'Report',
              color: AppColors.warning,
              onTap: () {
                Navigator.of(context).pop();
                onReport?.call();
              },
            ),
          _ActionTile(
            icon: LucideIcons.x,
            label: 'Cancel',
            color: AppColors.textSecondary,
            onTap: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionTile({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
        child: Row(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(width: 16),
            Text(label, style: TextStyle(color: color, fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
