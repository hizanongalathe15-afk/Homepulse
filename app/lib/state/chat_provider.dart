import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/chat_message.dart';
import 'package:homepulse/models/conversation.dart';
import '../services/chat_service.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

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

  Future<ChatMessage> editMessage(String messageId, String newContent) async {
    try {
      return await _chatService.editMessage(messageId, newContent);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<void> deleteMessage(String messageId) async {
    try {
      await _chatService.deleteMessage(messageId);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<ChatMessage> forwardMessage(String messageId, String toConversationId) async {
    try {
      return await _chatService.forwardMessage(messageId, toConversationId);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<ChatMessage> starMessage(String messageId) async {
    try {
      return await _chatService.starMessage(messageId);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<ChatMessage> unstarMessage(String messageId) async {
    try {
      return await _chatService.unstarMessage(messageId);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<void> reportMessage(String messageId, String reason) async {
    try {
      await _chatService.reportMessage(messageId, reason);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<void> muteConversation(String conversationId, {Duration? duration}) async {
    try {
      await _chatService.muteConversation(conversationId, duration: duration);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<void> unmuteConversation(String conversationId) async {
    try {
      await _chatService.unmuteConversation(conversationId);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<Conversation> pinConversation(String conversationId) async {
    try {
      return await _chatService.pinConversation(conversationId);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<void> archiveConversation(String conversationId) async {
    try {
      await _chatService.archiveConversation(conversationId);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<Conversation> pauseConversation(String conversationId) async {
    try {
      final updated = await _chatService.pauseConversation(conversationId);
      final previous = state.valueOrNull ?? const [];
      state = AsyncData(
        previous
            .map((c) => c.id == conversationId ? updated : c)
            .toList(growable: false),
      );
      return updated;
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<Conversation> resumeConversation(String conversationId) async {
    try {
      final updated = await _chatService.resumeConversation(conversationId);
      final previous = state.valueOrNull ?? const [];
      state = AsyncData(
        previous
            .map((c) => c.id == conversationId ? updated : c)
            .toList(growable: false),
      );
      return updated;
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<void> markConversationAsRead(String conversationId) async {
    try {
      await _chatService.markConversationAsRead(conversationId);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<int> getUnreadCount() async {
    try {
      return await _chatService.getUnreadCount();
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
    _channel = WebSocketChannel.connect(Uri.parse('${Constants.socketUrl}/ws'));
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
