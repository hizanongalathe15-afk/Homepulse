import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:homepulse/core/config/constants.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/models/system_theme.dart';

class ThemeService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  static const String _themeCacheKey = 'cached_system_theme';

  Future<SystemThemeConfig?> fetchTheme() async {
    try {
      final response = await _api.get('/theme');
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final themeData = data['data'] as Map<String, dynamic>;
        final config = SystemThemeConfig.fromJson(themeData);
        await _cacheTheme(config);
        return config;
      }
    } on ApiException {
      return await _getCachedTheme();
    } catch (_) {
      return await _getCachedTheme();
    }
    return null;
  }

  Future<SystemThemeConfig?> getCachedTheme() async {
    return await _getCachedTheme();
  }

  Future<SystemThemeConfig> updateTheme(SystemThemeConfig config, String? token) async {
    final response = await _api.put('/admin/theme', data: config.toJson());
    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = response.data as Map<String, dynamic>;
      final themeData = data['data'] as Map<String, dynamic>;
      final updated = SystemThemeConfig.fromJson(themeData);
      await _cacheTheme(updated);
      return updated;
    }
    throw ApiException(message: 'Failed to update theme');
  }

  Future<SystemThemeConfig> resetTheme(String? token) async {
    final response = await _api.post('/admin/theme/reset');
    if (response.statusCode == 200) {
      final data = response.data as Map<String, dynamic>;
      final themeData = data['data'] as Map<String, dynamic>;
      final updated = SystemThemeConfig.fromJson(themeData);
      await _cacheTheme(updated);
      return updated;
    }
    throw ApiException(message: 'Failed to reset theme');
  }

  Future<void> _cacheTheme(SystemThemeConfig config) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeCacheKey, jsonEncode(config.toJson()));
  }

  Future<SystemThemeConfig?> _getCachedTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString(_themeCacheKey);
    if (cached == null) return null;
    try {
      return SystemThemeConfig.fromJson(jsonDecode(cached) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  static SystemThemeConfig _defaultTheme = SystemThemeConfig.fromJson(jsonDecode(
    '{"colors":{"primary":"#1A5276","primaryLight":"#2E86C1","primaryDark":"#0E2F44","secondary":"#2E86C1","secondaryLight":"#5DADE2","secondaryDark":"#1A5276","tertiary":"#F39C12","tertiaryLight":"#F7C548","tertiaryDark":"#D68910","background":"#FAFAFA","surface":"#FFFFFF","surfaceVariant":"#F0F2F5","error":"#E53935","onPrimary":"#FFFFFF","onSecondary":"#FFFFFF","onBackground":"#1A1A1A","onSurface":"#1A1A1A","onError":"#FFFFFF","textPrimary":"#1A1A1A","textSecondary":"#6B7280","textTertiary":"#9CA3AF","divider":"#E5E7EB","success":"#10B981","warning":"#F59E0B","info":"#3B82F6"},"typography":{"fontFamily":"Inter"},"borderRadius":{"small":"0.25rem","medium":"0.5rem","large":"0.75rem","xl":"1rem","full":"9999px"},"spacing":{"xs":4,"sm":8,"md":16,"lg":24,"xl":32,"xxl":48}}',
  ) as Map<String, dynamic>);

  SystemThemeConfig getDefaultTheme() => _defaultTheme;
}

final themeServiceProvider = Provider<ThemeService>((ref) => ThemeService());
