import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/conversation.dart';
import '../../../../models/chat_message.dart';
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

class ChatScreen extends ConsumerStatefulWidget {
  final String conversationId;

  const ChatScreen({
    super.key,
    required this.conversationId,
  });

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  List<ChatMessage> _messages = const [];
  bool _isLoading = false;
  bool _showNegotiationPanel = false;

  @override
  void initState() {
    super.initState();
    _loadMessages();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadMessages() async {
    setState(() => _isLoading = true);
    try {
      final messages = await ref.read(chatProvider.notifier).getMessages(widget.conversationId);
      setState(() => _messages = messages);
      _scrollToBottom();
    } on Exception catch (e) {
      AppToast.show(context, 'Failed to load messages');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    _messageController.clear();
    try {
      await ref.read(chatProvider.notifier).sendMessage(widget.conversationId, text);
      await _loadMessages();
    } on Exception catch (e) {
      AppToast.show(context, 'Failed to send message');
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final conversationAsync = ref.watch(chatProvider);

    return Scaffold(
      appBar: AppBar(
        title: conversationAsync.valueOrNull != null && conversationAsync.valueOrNull!.isNotEmpty
            ? Text('Chat with ${conversationAsync.valueOrNull!.first.participantIds.first}')
            : const Text('Chat'),
        actions: [
          IconButton(
            onPressed: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                builder: (context) => DraggableScrollableSheet(
                  initialChildSize: 0.5,
                  minChildSize: 0.3,
                  maxChildSize: 0.8,
                  expand: false,
                  builder: (context, scrollController) => VoiceCallScreen(),
                ),
              );
            },
            icon: const Icon(Icons.call_outlined),
            tooltip: 'Voice Call',
          ),
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
                  builder: (context, scrollController) => VideoPreCallVerify(
                    onVerified: () {
                      Navigator.pop(context);
                      AppToast.show(context, 'Identity verified');
                    },
                  ),
                ),
              );
            },
            icon: const Icon(Icons.videocam_outlined),
            tooltip: 'Video Call',
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'negotiate') {
                setState(() => _showNegotiationPanel = !_showNegotiationPanel);
              } else if (value == 'qr') {
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
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'negotiate', child: Text('Negotiate Rent')),
              const PopupMenuItem(value: 'qr', child: Text('Share QR Code')),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          if (_showNegotiationPanel)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.background,
                border: Border(bottom: BorderSide(color: AppColors.divider)),
              ),
              child: NegotiationPanel(
                onOfferSent: () {
                  AppToast.show(context, 'Offer sent');
                },
              ),
            ),
          Expanded(
            child: _isLoading
                ? const Center(child: LoadingSpinner())
                : ChatWindow(
                    messages: _messages,
                    controller: _scrollController,
                    onSend: _sendMessage,
                    messageController: _messageController,
                  ),
          ),
        ],
      ),
    );
  }
}
