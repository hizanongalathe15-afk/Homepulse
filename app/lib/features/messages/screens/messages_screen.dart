import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
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
            icon: const Icon(Icons.qr_code_2_outlined),
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
                prefixIcon: const Icon(Icons.search, size: 20),
                suffixIcon: _isSearching
                    ? IconButton(
                        onPressed: () {
                          _searchController.clear();
                        },
                        icon: const Icon(Icons.clear, size: 20),
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
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
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
                final displayList = _isSearching ? _filteredConversations : conversations;
                if (displayList.isEmpty) {
                  return Center(
                    child: Column(
                      children: [
                        Icon(Icons.chat_bubble_outline, size: 64, color: AppColors.textSecondary.withOpacity(0.5)),
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
                        onTap: () {
                          context.push('/chat/${conversation.id}');
                        },
                        child: ListTile(
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
                                  decoration: const BoxDecoration(
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
      ),
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
