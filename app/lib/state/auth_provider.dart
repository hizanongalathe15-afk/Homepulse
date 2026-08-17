import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/models/user.dart';
import 'package:homepulse/models/auth_response.dart';
import '../services/auth_service.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthNotifier extends AsyncNotifier<User?> {
  late final AuthService _authService = ref.read(authServiceProvider);

  @override
  Future<User?> build() async {
    final token = await _authService.getStoredToken();
    if (token == null) return null;
    try {
      final user = await _authService.getCurrentUser(token);
      return user;
    } on Exception {
      await _authService.clearToken();
      return null;
    }
  }

  Future<User?> login({required String email, required String password}) async {
    state = const AsyncValue.loading();
    try {
      final authResponse = await _authService.login(email: email, password: password);
      await _authService.storeToken(authResponse.accessToken);
      state = AsyncValue.data(authResponse.user);
      return authResponse.user;
    } on Exception catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<User?> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phoneNumber,
  }) async {
    state = const AsyncValue.loading();
    try {
      final authResponse = await _authService.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      );
      await _authService.storeToken(authResponse.accessToken);
      state = AsyncValue.data(authResponse.user);
      return authResponse.user;
    } on Exception catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> verifyOtp({required String phoneNumber, required String code}) async {
    state = const AsyncValue.loading();
    try {
      await _authService.verifyOtp(phoneNumber: phoneNumber, code: code);
      state = AsyncValue.data(state.value);
    } on Exception catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> resetPassword({required String email, required String newPassword}) async {
    try {
      await _authService.resetPassword(email: email, newPassword: newPassword);
    } on Exception catch (_) {
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      await _authService.logout();
    } catch (_) {}
    await _authService.clearToken();
    state = const AsyncValue.data(null);
  }
}

final authProvider = AsyncNotifierProvider<AuthNotifier, User?>(() => AuthNotifier());

final authStatusProvider = StateProvider<AuthStatus>((ref) {
  final authState = ref.watch(authProvider);
  return authState.value != null ? AuthStatus.authenticated : AuthStatus.unauthenticated;
});
