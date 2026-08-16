import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/conversation.dart';
import '../../../../state/chat_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/user_avatar.dart';

class CommunityChat extends ConsumerStatefulWidget {
  const CommunityChat({super.key});

  @override
  ConsumerState<CommunityChat> createState() => _CommunityChatState();
}

class _CommunityChatState extends ConsumerState<CommunityChat> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  String? _selectedConversationId;

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _sendMessage() async {
    final content = _messageController.text.trim();
    if (content.isEmpty || _selectedConversationId == null) return;
    try {
      await ref.read(chatProvider.notifier).sendMessage(_selectedConversationId!, content);
      _messageController.clear();
    } catch (e) {
      AppToast.error(context, 'Failed to send message');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final conversationsAsync = ref.watch(chatProvider);

    return Row(
      children: [
        Container(
          width: 320,
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            border: Border(right: BorderSide(color: AppColors.divider)),
          ),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Search conversations...',
                    prefixIcon: const Icon(Icons.search, size: 20),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                ),
              ),
              Expanded(
                child: conversationsAsync.when(
                  loading: () => const Center(child: LoadingSpinner(size: 24)),
                  error: (error, _) => Center(
                    child: Column(
                      children: [
                        const Icon(Icons.error_outline, color: Colors.red),
                        const SizedBox(height: 8),
                        TextButton(onPressed: () => ref.invalidate(chatProvider), child: const Text('Retry')),
                      ],
                    ),
                  ),
                  data: (conversations) {
                    if (conversations.isEmpty) {
                      return Center(
                        child: Text('No community chats', style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                      );
                    }
                    return ListView.builder(
                      itemCount: conversations.length,
                      itemBuilder: (context, index) {
                        final conversation = conversations[index];
                        final isSelected = conversation.id == _selectedConversationId;
                        return AppCard(
                          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          color: isSelected ? AppColors.primary.withOpacity(0.1) : null,
                          child: ListTile(
                            dense: true,
                            leading: UserAvatar(
                              initials: conversation.participantIds.isNotEmpty ? conversation.participantIds.first[0].toUpperCase() : '?',
                              size: 36,
                              backgroundColor: AppColors.primary,
                              textColor: Colors.white,
                            ),
                            title: Text(
                              conversation.participantIds.isNotEmpty ? conversation.participantIds.first : 'Group',
                              style: theme.textTheme.titleSmall,
                            ),
                            subtitle: Text(
                              conversation.lastMessage ?? 'No messages',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: theme.textTheme.bodySmall,
                            ),
                            trailing: conversation.unreadCount > 0
                                ? Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                                    child: Text('${conversation.unreadCount}', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                                  )
                                : null,
                            onTap: () {
                              setState(() => _selectedConversationId = conversation.id);
                            },
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: _selectedConversationId == null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.chat_bubble_outline, size: 64, color: AppColors.textSecondary.withOpacity(0.5)),
                      const SizedBox(height: 16),
                      Text('Select a conversation to start chatting', style: theme.textTheme.titleMedium),
                    ],
                  ),
                )
              : _ChatWindow(conversationId: _selectedConversationId!, messageController: _messageController, scrollController: _scrollController),
        ),
      ],
    );
  }
}

class _ChatWindow extends ConsumerWidget {
  final String conversationId;
  final TextEditingController messageController;
  final ScrollController scrollController;
  const _ChatWindow({required this.conversationId, required this.messageController, required this.scrollController});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final messagesAsync = ref.watch(messagesProvider(conversationId));

    return Column(
      children: [
        AppBar(
          title: const Text('Community Chat'),
          backgroundColor: theme.colorScheme.surface,
          foregroundColor: theme.colorScheme.onSurface,
          elevation: 1,
          automaticallyImplyLeading: false,
        ),
        Expanded(
          child: messagesAsync.when(
            loading: () => const Center(child: LoadingSpinner()),
            error: (error, _) => Center(
              child: Column(
                children: [
                  const Icon(Icons.error_outline, color: Colors.red),
                  const SizedBox(height: 8),
                  TextButton(onPressed: () => ref.invalidate(messagesProvider(conversationId)), child: const Text('Retry')),
                ],
              ),
            ),
            data: (messages) {
              if (messages.isEmpty) {
                return Center(
                  child: Text('No messages yet', style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                );
              }
              return RefreshIndicator(
                onRefresh: () async => ref.invalidate(messagesProvider(conversationId)),
                child: ListView.builder(
                  controller: scrollController,
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    final isMe = message.senderId == 'current_user';
                    return Align(
                      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          color: isMe ? AppColors.primary : theme.colorScheme.surfaceContainerHighest,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(message.text, style: TextStyle(color: isMe ? Colors.white : theme.colorScheme.onSurface)),
                            const SizedBox(height: 4),
                            Text(
                              _formatTime(message.createdAt),
                              style: TextStyle(fontSize: 11, color: isMe ? Colors.white70 : AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ),
        Container(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 16, right: 16, top: 8),
          decoration: BoxDecoration(color: theme.colorScheme.surface, border: Border(top: BorderSide(color: AppColors.divider))),
          child: Row(
            children: [
              Expanded(
                child: AppInput(
                  controller: messageController,
                  hintText: 'Type a message...',
                  maxLines: 1,
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () async {
                  final content = messageController.text.trim();
                  if (content.isEmpty) return;
                  try {
                    await ref.read(chatProvider.notifier).sendMessage(conversationId, content);
                    messageController.clear();
                  } catch (e) {
                    AppToast.error(context, 'Failed to send');
                  }
                },
                icon: const Icon(Icons.send_rounded),
                color: AppColors.primary,
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatTime(DateTime date) {
    return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
