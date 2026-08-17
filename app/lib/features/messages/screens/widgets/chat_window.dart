import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/chat_message.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/message_action_menu.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../state/chat_provider.dart';
import 'typing_indicator.dart';

class ChatWindow extends ConsumerStatefulWidget {
  final List<ChatMessage> messages;
  final ScrollController controller;
  final Future<void> Function() onSend;
  final TextEditingController messageController;
  final String currentUserId;
  final String conversationId;
  final Function(String)? onReplyTo;

  const ChatWindow({
    super.key,
    required this.messages,
    required this.controller,
    required this.onSend,
    required this.messageController,
    required this.currentUserId,
    required this.conversationId,
    this.onReplyTo,
  });

  @override
  ConsumerState<ChatWindow> createState() => _ChatWindowState();
}

class _ChatWindowState extends ConsumerState<ChatWindow> {
  bool _isTyping = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            controller: widget.controller,
            padding: const EdgeInsets.all(16),
            itemCount: widget.messages.length + 1,
            itemBuilder: (context, index) {
              if (index >= widget.messages.length) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: TypingIndicator(),
                );
              }
              final message = widget.messages[index];
              final isMe = message.senderId == widget.currentUserId;
              return GestureDetector(
                onLongPress: () => _showMessageActions(context, message, isMe),
                child: Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: message.isDeleted
                          ? (isMe ? AppColors.primary.withOpacity(0.1) : AppColors.surfaceVariant.withOpacity(0.5))
                          : (isMe ? AppColors.primary : AppColors.background),
                      borderRadius: BorderRadius.circular(16).copyWith(
                        bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(16),
                        bottomLeft: isMe ? const Radius.circular(16) : const Radius.circular(4),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (message.isForwarded && message.forwardedFromName != null) ...[
                          Text(
                            'You forwarded this message',
                            style: TextStyle(
                              color: isMe ? Colors.white70 : AppColors.textSecondary,
                              fontSize: 11,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                          const SizedBox(height: 2),
                        ],
                        if (message.isDeleted)
                          Text(
                            'Message deleted',
                            style: TextStyle(
                              color: isMe ? Colors.white70 : AppColors.textSecondary,
                              fontSize: 14,
                              fontStyle: FontStyle.italic,
                            ),
                          )
                        else
                          Text(
                            message.text,
                            style: TextStyle(
                              color: isMe ? Colors.white : AppColors.textPrimary,
                              fontSize: 14,
                            ),
                          ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '${message.createdAt.hour.toString().padLeft(2, '0')}:${message.createdAt.minute.toString().padLeft(2, '0')}',
                              style: TextStyle(
                                color: isMe ? Colors.white70 : AppColors.textSecondary,
                                fontSize: 10,
                              ),
                            ),
                            if (message.isEdited) ...[
                              const SizedBox(width: 6),
                              Text(
                                'Edited',
                                style: TextStyle(
                                  color: isMe ? Colors.white70 : AppColors.textTertiary,
                                  fontSize: 10,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ],
                            if (isMe && !message.isDeleted) ...[
                              const SizedBox(width: 4),
                              _ReadReceipt(message: message),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border(top: BorderSide(color: AppColors.divider)),
          ),
          child: SafeArea(
            child: Row(
              children: [
                Expanded(
                  child: AppInput(
                    controller: widget.messageController,
                    hintText: 'Type a message...',
                    onChanged: (value) {
                      setState(() => _isTyping = value.trim().isNotEmpty);
                    },
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: widget.onSend,
                  icon: Icon(
                    Icons.send,
                    color: _isTyping ? AppColors.primary : AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _showMessageActions(BuildContext context, ChatMessage message, bool isMe) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => MessageActionMenu(
        message: message,
        currentUserId: widget.currentUserId,
        onReply: () {
          widget.onReplyTo?.call(message.text);
        },
        onEdit: () {
          if (isMe && !message.isDeleted) {
            _showEditDialog(context, message);
          }
        },
        onDelete: () async {
          try {
            await ref.read(chatProvider.notifier).deleteMessage(message.id);
            AppToast.show(context, 'Message deleted');
            if (mounted) Navigator.pop(ctx);
          } on Exception {
            AppToast.show(context, 'Failed to delete message');
          }
        },
        onStar: () async {
          try {
            if (message.isStarred) {
              await ref.read(chatProvider.notifier).unstarMessage(message.id);
            } else {
              await ref.read(chatProvider.notifier).starMessage(message.id);
            }
            AppToast.show(context, message.isStarred ? 'Unstarred' : 'Starred');
          } on Exception {
            AppToast.show(context, 'Failed to update star');
          }
        },
        onForward: () {
          _showForwardDialog(context, message);
        },
        onReport: () {
          _showReportDialog(context, message);
        },
      ),
    );
  }

  void _showEditDialog(BuildContext context, ChatMessage message) {
    final controller = TextEditingController(text: message.text);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Edit Message'),
        content: TextField(
          controller: controller,
          maxLines: 3,
          decoration: const InputDecoration(hintText: 'Edit your message'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () async {
              final newText = controller.text.trim();
              if (newText.isEmpty) return;
              try {
                await ref.read(chatProvider.notifier).editMessage(message.id, newText);
                AppToast.show(context, 'Message updated');
                Navigator.pop(ctx);
              } on Exception {
                AppToast.show(context, 'Failed to edit message');
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showForwardDialog(BuildContext context, ChatMessage message) {
    AppToast.show(context, 'Select conversation to forward');
  }

  void _showReportDialog(BuildContext context, ChatMessage message) {
    final reasonController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Report Message'),
        content: TextField(
          controller: reasonController,
          maxLines: 3,
          decoration: const InputDecoration(hintText: 'Reason for reporting'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () async {
              final reason = reasonController.text.trim();
              if (reason.isEmpty) return;
              try {
                await ref.read(chatProvider.notifier).reportMessage(message.id, reason);
                AppToast.show(context, 'Message reported');
                Navigator.pop(ctx);
              } on Exception {
                AppToast.show(context, 'Failed to report');
              }
            },
            child: const Text('Report'),
          ),
        ],
      ),
    );
  }
}

class _ReadReceipt extends StatelessWidget {
  final ChatMessage message;

  const _ReadReceipt({required this.message});

  @override
  Widget build(BuildContext context) {
    if (message.isRead) {
      return Icon(Icons.done_all_rounded, size: 14, color: AppColors.primary);
    }
    if (message.seenAt != null) {
      return Icon(Icons.done_all_rounded, size: 14, color: AppColors.primary.withOpacity(0.7));
    }
    return Icon(Icons.done_rounded, size: 14, color: AppColors.textSecondary);
  }
}
