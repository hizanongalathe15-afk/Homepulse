import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/models/chat_message.dart';
import 'package:homepulse/models/conversation.dart';

class ChatService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

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

  Future<ChatMessage> editMessage(String messageId, String newContent) async {
    final response = await _api.patch('/messages/$messageId', data: {
      'content': newContent,
    });
    return ChatMessage.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deleteMessage(String messageId) async {
    await _api.delete('/messages/$messageId');
  }

  Future<ChatMessage> forwardMessage(String messageId, String toConversationId) async {
    final response = await _api.post('/messages/$messageId/forward', data: {
      'to_conversation_id': toConversationId,
    });
    return ChatMessage.fromJson(response.data as Map<String, dynamic>);
  }

  Future<ChatMessage> starMessage(String messageId) async {
    final response = await _api.post('/messages/$messageId/star');
    return ChatMessage.fromJson(response.data as Map<String, dynamic>);
  }

  Future<ChatMessage> unstarMessage(String messageId) async {
    final response = await _api.delete('/messages/$messageId/star');
    return ChatMessage.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> reportMessage(String messageId, String reason) async {
    await _api.post('/messages/$messageId/report', data: {
      'reason': reason,
    });
  }

  Future<void> muteConversation(String conversationId, {Duration? duration}) async {
    await _api.post('/conversations/$conversationId/mute', data: {
      'duration_minutes': duration?.inMinutes,
    });
  }

  Future<void> unmuteConversation(String conversationId) async {
    await _api.delete('/conversations/$conversationId/mute');
  }

  Future<Conversation> pinConversation(String conversationId) async {
    final response = await _api.post('/conversations/$conversationId/pin');
    return Conversation.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> archiveConversation(String conversationId) async {
    await _api.post('/conversations/$conversationId/archive');
  }

  Future<Conversation> pauseConversation(String conversationId) async {
    final response = await _api.post('/conversations/$conversationId/pause');
    return Conversation.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Conversation> resumeConversation(String conversationId) async {
    final response = await _api.delete('/conversations/$conversationId/pause');
    return Conversation.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> markConversationAsRead(String conversationId) async {
    await _api.post('/conversations/$conversationId/read');
  }

  Future<int> getUnreadCount() async {
    final response = await _api.get('/conversations/unread-count');
    return (response.data as int?) ?? 0;
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
