import 'dart:async';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/models/chat_message.dart';
import 'package:homepulse/models/conversation.dart';

class ChatService {
  late final ApiClient _api = ApiClient(baseUrl: 'https://api.homepulse.app');

  Future<List<Conversation>> getConversations() async {
    final response = await _api.get('/conversations');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Conversation.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<ChatMessage>> getMessages(String conversationId, {int page = 1, int limit = 50}) async {
    final response = await _api.get('/conversations/$conversationId/messages', queryParameters: {
      'page': page,
      'limit': limit,
    });
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => ChatMessage.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<ChatMessage> sendMessage(String conversationId, String content, {String? attachmentUrl}) async {
    final response = await _api.post('/conversations/$conversationId/messages', data: {
      'content': content,
      'attachment_url': attachmentUrl,
    });
    return ChatMessage.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> sendTypingIndicator(String conversationId, bool isTyping) async {
    try {
      await _api.post('/conversations/$conversationId/typing', data: {'is_typing': isTyping});
    } on ApiException catch (_) {}
  }

  Future<void> markAsRead(String conversationId, String messageId) async {
    try {
      await _api.post('/conversations/$conversationId/messages/$messageId/read');
    } on ApiException catch (_) {}
  }
}

final chatServiceProvider = Provider<ChatService>((ref) => ChatService());
