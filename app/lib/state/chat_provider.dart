import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/models/chat_message.dart';
import 'package:homepulse/models/conversation.dart';
import '../services/chat_service.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

final chatServiceProvider = Provider<ChatService>((ref) => ChatService());

class ChatNotifier extends AsyncNotifier<List<Conversation>> {
  late final ChatService _chatService = ref.read(chatServiceProvider);
  StreamSubscription? _subscription;
  WebSocketChannel? _channel;

  @override
  Future<List<Conversation>> build() async {
    return _chatService.getConversations();
  }

  Future<List<ChatMessage>> getMessages(String conversationId, {int page = 1, int limit = 50}) async {
    try {
      return await _chatService.getMessages(conversationId, page: page, limit: limit);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<ChatMessage> sendMessage(String conversationId, String content, {String? attachmentUrl}) async {
    try {
      return await _chatService.sendMessage(conversationId, content, attachmentUrl: attachmentUrl);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<void> sendTypingIndicator(String conversationId, bool isTyping) async {
    try {
      await _chatService.sendTypingIndicator(conversationId, isTyping);
    } on Exception catch (_) {}
  }

  Future<void> markAsRead(String conversationId, String messageId) async {
    try {
      await _chatService.markAsRead(conversationId, messageId);
    } on Exception catch (_) {}
  }

  void connectRealtime(String userId) {
    _channel = WebSocketChannel.connect(Uri.parse('wss://api.homepulse.app/ws'));
    _subscription = _channel!.stream.listen((data) {
      final decoded = data as String;
      final event = decoded.split(':').first;
      if (event == 'message') {
      } else if (event == 'typing') {
      }
    });
  }

  void disconnect() {
    _subscription?.cancel();
    _channel?.sink.close();
    _subscription = null;
    _channel = null;
  }
}

final chatProvider = AsyncNotifierProvider<ChatNotifier, List<Conversation>>(() => ChatNotifier());

final selectedConversationIdProvider = StateProvider<String?>((ref) => null);

final messagesProvider = FutureProvider.family<List<ChatMessage>, String>((ref, conversationId) async {
  final notifier = ref.read(chatProvider.notifier);
  return notifier.getMessages(conversationId);
});
