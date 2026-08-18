import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/core/theme/app_theme.dart';
import 'package:homepulse/models/system_theme.dart';
import 'package:homepulse/services/theme_service.dart';
import 'package:homepulse/services/auth_service.dart';
import 'package:homepulse/state/auth_provider.dart';

class SystemThemeNotifier extends AsyncNotifier<SystemThemeConfig> {
  late final ThemeService _themeService;
  static const String _themeCacheKey = 'cached_system_theme';
  dynamic _socket;
  bool _isUpdating = false;

  @override
  Future<SystemThemeConfig> build() async {
    _themeService = ref.read(themeServiceProvider);
    _initSocketListener();
    ref.onDispose(() {
      _socket?.dispose();
    });
    return await _loadTheme();
  }

  Future<SystemThemeConfig> _loadTheme() async {
    try {
      final cached = await _themeService.getCachedTheme();
      final fetched = await _themeService.fetchTheme();

      if (fetched != null) {
        _cacheTheme(fetched);
        return fetched;
      }

      if (cached != null) {
        return cached;
      }

      final defaults = _themeService.getDefaultTheme();
      _cacheTheme(defaults);
      return defaults;
    } catch (_) {
      return _themeService.getDefaultTheme();
    }
  }

  void _cacheTheme(SystemThemeConfig config) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_themeCacheKey, jsonEncode(config.toJson()));
    } catch (_) {}
  }

  void _initSocketListener() {
    if (!kDebugMode && !kReleaseMode) return;

    try {
      final socketUrl = Constants.socketUrl;
      _applySocketImport(socketUrl);
    } catch (e) {
      if (kDebugMode) {
        print('Failed to initialize theme socket: $e');
      }
    }
  }

  void _applySocketImport(String socketUrl) {
    try {
      void Function(String event, dynamic Function(dynamic)? cb) on;
      void Function(String event, dynamic data) emit;
      void Function() connect;
      void Function() dispose;
      _ = socketUrl;
    } catch (_) {}
  }

  void _handleRemoteThemeUpdate(dynamic data) {
    if (_isUpdating) return;

    try {
      final themeData = data is Map<String, dynamic>
          ? (data.containsKey('data') ? data['data'] as Map<String, dynamic> : data)
          : null;

      if (themeData != null) {
        final config = SystemThemeConfig.fromJson(themeData);
        _applyTheme(config);
      }
    } catch (e) {
      if (kDebugMode) {
        print('Failed to parse remote theme update: $e');
      }
    }
  }

  void _applyTheme(SystemThemeConfig config) {
    _isUpdating = true;
    _cacheTheme(config);
    state = AsyncValue.data(config);
    _isUpdating = false;
  }

  Future<SystemThemeConfig> saveTheme(SystemThemeConfig config) async {
    _isUpdating = true;
    try {
      final token = await _getToken();
      final updated = await _themeService.updateTheme(config, token);
      _cacheTheme(updated);

      final previous = state.valueOrNull ?? _themeService.getDefaultTheme();
      state = AsyncValue.data(updated.copyWith(
        name: updated.name ?? previous.name,
        createdAt: updated.createdAt ?? previous.createdAt,
        updatedBy: updated.updatedBy ?? previous.updatedBy,
      ));

      return updated;
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      rethrow;
    } finally {
      _isUpdating = false;
    }
  }

  Future<SystemThemeConfig> resetTheme() async {
    _isUpdating = true;
    try {
      final token = await _getToken();
      final reset = await _themeService.resetTheme(token);
      _cacheTheme(reset);
      state = AsyncValue.data(reset);
      return reset;
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      rethrow;
    } finally {
      _isUpdating = false;
    }
  }

  Future<String?> _getToken() async {
    final authService = ref.read(authServiceProvider);
    return authService.getStoredToken();
  }
}

final systemThemeProvider =
    AsyncNotifierProvider<SystemThemeNotifier, SystemThemeConfig>(
  () => SystemThemeNotifier(),
);

final currentThemeProvider = Provider<AsyncValue<SystemThemeConfig>>((ref) {
  return ref.watch(systemThemeProvider);
});

final lightThemeProvider = Provider<ThemeData>((ref) {
  final config = ref.watch(systemThemeProvider).valueOrNull;
  if (config == null) {
    return AppTheme.generateLightTheme(
      ref.read(themeServiceProvider).getDefaultTheme(),
    );
  }
  return AppTheme.generateLightTheme(config);
});

final darkThemeProvider = Provider<ThemeData>((ref) {
  final config = ref.watch(systemThemeProvider).valueOrNull;
  if (config == null) {
    return AppTheme.generateDarkTheme(
      ref.read(themeServiceProvider).getDefaultTheme(),
    );
  }
  return AppTheme.generateDarkTheme(config);
});

final isCurrentUserAdminProvider = Provider<bool>((ref) {
  final user = ref.watch(authProvider).valueOrNull;
  if (user == null) return false;
  return user.role.toLowerCase() == 'admin' || user.role.toLowerCase() == 'super_admin';
});
