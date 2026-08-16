import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/models/user.dart';
import 'package:homepulse/models/auth_response.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  late final ApiClient _api = ApiClient(baseUrl: 'https://api.homepulse.app');

  Future<User?> getCurrentUser(String token) async {
    try {
      final response = await _api.get('/auth/me');
      return User.fromJson(response.data as Map<String, dynamic>);
    } on ApiException {
      return null;
    }
  }

  Future<AuthResponse> login({required String email, required String password}) async {
    final response = await _api.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return AuthResponse.fromJson(response.data as Map<String, dynamic>);
  }

  Future<AuthResponse> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phoneNumber,
  }) async {
    final response = await _api.post('/auth/register', data: {
      'email': email,
      'password': password,
      'first_name': firstName,
      'last_name': lastName,
      'phone_number': phoneNumber,
    });
    return AuthResponse.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> verifyOtp({required String phoneNumber, required String code}) async {
    await _api.post('/auth/verify-otp', data: {
      'phone_number': phoneNumber,
      'code': code,
    });
  }

  Future<void> resetPassword({required String email, required String newPassword}) async {
    await _api.post('/auth/reset-password', data: {
      'email': email,
      'new_password': newPassword,
    });
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (_) {}
  }

  Future<void> storeToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<String?> getStoredToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }
}

final authServiceProvider = Provider<AuthService>((ref) => AuthService());
