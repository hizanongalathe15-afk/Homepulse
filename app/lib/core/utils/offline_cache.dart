import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class OfflineCache {
  static Database? _database;

  static Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  static Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    return openDatabase(
      join(dbPath, 'homepulse_cache.db'),
      version: 1,
      onCreate: (db, version) {
        return db.execute('''
          CREATE TABLE cache(
            id TEXT PRIMARY KEY,
            entityType TEXT,
            entityId TEXT,
            data TEXT,
            cachedAt TEXT,
            expiresAt TEXT
          )
        ''');
      },
    );
  }

  static Future<void> cacheListings(List<dynamic> listings) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('cached_listings', jsonEncode(listings));
      
      final db = await database;
      final now = DateTime.now().toIso8601String();
      final expires = DateTime.now().add(const Duration(hours: 24)).toIso8601String();
      
      for (final listing in listings) {
        await db.insert('cache', {
          'id': 'listing_${listing['id']}',
          'entityType': 'listings',
          'entityId': listing['id'].toString(),
          'data': jsonEncode(listing),
          'cachedAt': now,
          'expiresAt': expires,
        }, conflictAlgorithm: ConflictAlgorithm.replace);
      }
    } catch (e) {
      debugPrint('Failed to cache listings: $e');
    }
  }

  static Future<List<dynamic>?> getCachedListings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cached = prefs.getString('cached_listings');
      if (cached != null) {
        return jsonDecode(cached) as List<dynamic>;
      }
      return null;
    } catch (e) {
      debugPrint('Failed to get cached listings: $e');
      return null;
    }
  }

  static Future<void> cacheChatMessages(String conversationId, List<dynamic> messages) async {
    try {
      final db = await database;
      final now = DateTime.now().toIso8601String();
      final expires = DateTime.now().add(const Duration(hours: 24)).toIso8601String();
      
      for (final message in messages) {
        await db.insert('cache', {
          'id': 'chat_${conversationId}_${message['id']}',
          'entityType': 'chats',
          'entityId': conversationId,
          'data': jsonEncode(message),
          'cachedAt': now,
          'expiresAt': expires,
        }, conflictAlgorithm: ConflictAlgorithm.replace);
      }
    } catch (e) {
      debugPrint('Failed to cache chat messages: $e');
    }
  }

  static Future<List<dynamic>?> getCachedChatMessages(String conversationId) async {
    try {
      final db = await database;
      final now = DateTime.now().toIso8601String();
      final results = await db.query(
        'cache',
        where: 'entityType = ? AND entityId = ? AND expiresAt > ?',
        whereArgs: ['chats', conversationId, now],
        orderBy: 'cachedAt DESC',
      );
      return results.map((row) => jsonDecode(row['data'] as String) as Map<String, dynamic>).toList();
    } catch (e) {
      debugPrint('Failed to get cached chat messages: $e');
      return null;
    }
  }

  static Future<void> clearExpired() async {
    try {
      final db = await database;
      final now = DateTime.now().toIso8601String();
      await db.delete('cache', where: 'expiresAt < ?', whereArgs: [now]);
    } catch (e) {
      debugPrint('Failed to clear expired cache: $e');
    }
  }
}
