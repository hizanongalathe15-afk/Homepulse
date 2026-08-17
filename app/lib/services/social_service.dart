import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/core/config/constants.dart';
import '../models/property_like.dart';
import '../models/comment.dart';

enum SortOption { newest, oldest, mostLiked }

class SocialService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<List<PropertyLike>> getPropertyLikes(String propertyId) async {
    final response = await _api.get('/social/properties/$propertyId/likes');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => PropertyLike.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<PropertyLike> likeProperty(String propertyId) async {
    final response = await _api.post('/social/properties/$propertyId/like');
    return PropertyLike.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> unlikeProperty(String propertyId) async {
    await _api.delete('/social/properties/$propertyId/like');
  }

  Future<bool> hasLikedProperty(String propertyId) async {
    try {
      final response = await _api.get('/social/properties/$propertyId/liked');
      return response.data == true || (response.data is Map && response.data['liked'] == true);
    } on ApiException catch (_) {
      return false;
    }
  }

  Future<List<PropertyComment>> getComments(String propertyId, {SortOption sort = SortOption.newest, int page = 1, int limit = 20}) async {
    final sortParam = switch (sort) {
      SortOption.newest => 'newest',
      SortOption.oldest => 'oldest',
      SortOption.mostLiked => 'most_liked',
    };
    final response = await _api.get('/comments/property/$propertyId', queryParameters: {
      'sort': sortParam,
      'page': page,
      'limit': limit,
    });
    final List<dynamic> list = response.data['data'] as List<dynamic>? ?? response.data as List<dynamic>;
    return list.map((e) => PropertyComment.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<PropertyComment> createComment(String propertyId, String content, {String? parentId}) async {
    final response = await _api.post('/comments/property/$propertyId', data: {
      'content': content,
      if (parentId != null) 'parentId': parentId,
    });
    return PropertyComment.fromJson(response.data['data'] as Map<String, dynamic>? ?? response.data as Map<String, dynamic>);
  }

  Future<PropertyComment> updateComment(String commentId, String content) async {
    final response = await _api.put('/comments/$commentId', data: {'content': content});
    return PropertyComment.fromJson(response.data['data'] as Map<String, dynamic>? ?? response.data as Map<String, dynamic>);
  }

  Future<void> deleteComment(String commentId) async {
    await _api.delete('/comments/$commentId');
  }

  Future<List<PropertyComment>> getReplies(String commentId, {int page = 1, int limit = 20}) async {
    final response = await _api.get('/comments/$commentId/replies', queryParameters: {
      'page': page,
      'limit': limit,
    });
    final List<dynamic> list = response.data['data'] as List<dynamic>? ?? response.data as List<dynamic>;
    return list.map((e) => PropertyComment.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> likeComment(String commentId) async {
    await _api.post('/comments/$commentId/like');
  }

  Future<void> unlikeComment(String commentId) async {
    await _api.delete('/comments/$commentId/like');
  }

  Future<List<PropertyComment>> getCommentLikes(String commentId) async {
    final response = await _api.get('/comments/$commentId/likes');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => PropertyComment.fromJson(e as Map<String, dynamic>)).toList();
  }
}

final socialServiceProvider = Provider<SocialService>((ref) => SocialService());
