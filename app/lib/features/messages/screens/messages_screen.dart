import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../widgets/app_bottom_nav.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/conversation.dart';
import '../../../../services/chat_service.dart';
import '../../../../state/chat_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../widgets/app_toast.dart';
import './widgets/chat_window.dart';
import './widgets/negotiation_panel.dart';
import './widgets/qr_share.dart';
import './widgets/typing_indicator.dart';
import './widgets/voice_call.dart';
import './widgets/video_pre_call_verify.dart';
import './chat_screen.dart';

class MessagesScreen extends ConsumerStatefulWidget {
  const MessagesScreen({super.key});

  @override
  ConsumerState<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends ConsumerState<MessagesScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Conversation> _filteredConversations = const [];
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    final query = _searchController.text.trim().toLowerCase();
    final conversations = ref.read(chatProvider).valueOrNull ?? const [];
    setState(() {
      _isSearching = query.isNotEmpty;
      _filteredConversations = query.isEmpty
          ? conversations
          : conversations.where((c) {
              final participantNames = c.participantIds.join(' ').toLowerCase();
              final lastMessage = c.lastMessage?.toLowerCase() ?? '';
              return participantNames.contains(query) || lastMessage.contains(query);
            }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final conversationsAsync = ref.watch(chatProvider);
    final selectedId = ref.watch(selectedConversationIdProvider);
    final screenWidth = MediaQuery.of(context).size.width;
    final isSplitScreen = screenWidth > 800;

    final conversations = conversationsAsync.valueOrNull ?? const [];
    final filtered = _isSearching ? _filteredConversations : conversations;

    if (isSplitScreen) {
      return Scaffold(
        body: Row(
          children: [
            SizedBox(
              width: 340,
              child: _buildConversationList(theme, conversationsAsync, filtered, selectedId, isSplitScreen),
            ),
            const VerticalDivider(width: 1),
            if (selectedId != null)
              Expanded(
                child: ChatScreen(conversationId: selectedId!),
              )
            else
              const Expanded(
                child: Center(
                  child: Text(
                    'Select a conversation to start chatting',
                    style: TextStyle(fontSize: 14),
                  ),
                ),
              ),
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        actions: [
          IconButton(
            onPressed: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                builder: (context) => DraggableScrollableSheet(
                  initialChildSize: 0.6,
                  minChildSize: 0.4,
                  maxChildSize: 0.9,
                  expand: false,
                  builder: (context, scrollController) => QRShare(),
                ),
              );
            },
            icon: const Icon(LucideIcons.qr_code, size: 20),
            tooltip: 'Share QR',
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search conversations...',
                prefixIcon: Icon(LucideIcons.search, size: 20),
                suffixIcon: _isSearching
                    ? IconButton(
                        onPressed: () {
                          _searchController.clear();
                        },
                        icon: const Icon(LucideIcons.x, size: 20),
                      )
                    : null,
              ),
            ),
          ),
          Expanded(child: _buildConversationList(theme, conversationsAsync, filtered, selectedId, false)),
        ],
      ),
      bottomNavigationBar: AppBottomNav(
        currentIndex: AppBottomNav.indexFor(context),
        onTap: (index) {
          switch (index) {
            case 0:
              context.go('/feed');
              break;
            case 1:
              context.go('/map');
              break;
            case 2:
              context.go('/search');
              break;
            case 3:
              context.go('/messages');
              break;
            case 4:
              context.go('/profile');
              break;
          }
        },
      ),
    );
  }

  Widget _buildConversationList(
    ThemeData theme,
    AsyncValue<List<Conversation>> conversationsAsync,
    List<Conversation> displayList,
    String? selectedId,
    bool isSplitScreen,
  ) {
    if (!isSplitScreen) {
      return Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search conversations...',
                prefixIcon: Icon(LucideIcons.search, size: 20),
                suffixIcon: _isSearching
                    ? IconButton(
                        onPressed: () {
                          _searchController.clear();
                        },
                        icon: const Icon(LucideIcons.x, size: 20),
                      )
                    : null,
              ),
            ),
          ),
          Expanded(
            child: conversationsAsync.when(
              loading: () => const Center(child: LoadingSpinner()),
              error: (error, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(LucideIcons.circle_alert, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text('Error loading messages', style: theme.textTheme.titleMedium),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () => ref.invalidate(chatProvider),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
              data: (conversations) {
                if (displayList.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.message_circle, size: 64, color: AppColors.textSecondary.withOpacity(0.5)),
                        const SizedBox(height: 16),
                        Text(
                          _isSearching ? 'No results found' : 'No messages yet',
                          style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () => ref.read(chatProvider.notifier).build(),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: displayList.length,
                    itemBuilder: (context, index) {
                      final conversation = displayList[index];
                      return AppCard(
                        margin: const EdgeInsets.only(bottom: 8),
                        selected: selectedId == conversation.id,
                        onTap: () {
                          if (isSplitScreen) {
                            ref.read(selectedConversationIdProvider.notifier).state = conversation.id;
                          } else {
                            context.push('/chat/${conversation.id}');
                          }
                        },
                        child: ListTile(
                          selected: selectedId == conversation.id,
                          leading: CircleAvatar(
                            backgroundColor: AppColors.primary,
                            child: Text(
                              conversation.participantIds.isNotEmpty
                                  ? conversation.participantIds.first[0].toUpperCase()
                                  : '?',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                          title: Text(
                            conversation.participantIds.isNotEmpty ? conversation.participantIds.first : 'User',
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (conversation.lastMessage != null)
                                Text(
                                  conversation.lastMessage!,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: theme.textTheme.bodySmall,
                                ),
                              if (conversation.lastMessageAt != null)
                                Text(
                                  _formatDate(conversation.lastMessageAt!),
                                  style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textSecondary),
                                ),
                            ],
                          ),
                          trailing: conversation.unreadCount > 0
                              ? Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Text(
                                    '${conversation.unreadCount}',
                                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                                  ),
                                )
                              : null,
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      );
    }

    return conversationsAsync.when(
      loading: () => const Center(child: LoadingSpinner()),
      error: (error, _) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(LucideIcons.circle_alert, size: 48, color: Colors.red),
            const SizedBox(height: 16),
            Text('Error loading messages', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => ref.invalidate(chatProvider),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
      data: (conversations) {
        if (displayList.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(LucideIcons.message_circle, size: 64, color: AppColors.textSecondary.withOpacity(0.5)),
                const SizedBox(height: 16),
                Text(
                  _isSearching ? 'No results found' : 'No messages yet',
                  style: theme.textTheme.titleMedium?.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          );
        }
        return RefreshIndicator(
          onRefresh: () => ref.read(chatProvider.notifier).build(),
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: displayList.length,
            itemBuilder: (context, index) {
              final conversation = displayList[index];
              return AppCard(
                margin: const EdgeInsets.only(bottom: 8),
                selected: selectedId == conversation.id,
                onTap: () {
                  if (isSplitScreen) {
                    ref.read(selectedConversationIdProvider.notifier).state = conversation.id;
                  } else {
                    context.push('/chat/${conversation.id}');
                  }
                },
                child: ListTile(
                  selected: selectedId == conversation.id,
                  leading: CircleAvatar(
                    backgroundColor: AppColors.primary,
                    child: Text(
                      conversation.participantIds.isNotEmpty
                          ? conversation.participantIds.first[0].toUpperCase()
                          : '?',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                  title: Text(
                    conversation.participantIds.isNotEmpty ? conversation.participantIds.first : 'User',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (conversation.lastMessage != null)
                        Text(
                          conversation.lastMessage!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.bodySmall,
                        ),
                      if (conversation.lastMessageAt != null)
                        Text(
                          _formatDate(conversation.lastMessageAt!),
                          style: theme.textTheme.labelSmall?.copyWith(color: AppColors.textSecondary),
                        ),
                    ],
                  ),
                  trailing: conversation.unreadCount > 0
                      ? Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            '${conversation.unreadCount}',
                            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        )
                      : null,
                ),
              );
            },
          ),
        );
      },
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inDays == 0) {
      return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    } else if (diff.inDays == 1) {
      return 'Yesterday';
    } else if (diff.inDays < 7) {
      return '${diff.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
