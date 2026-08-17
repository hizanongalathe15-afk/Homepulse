import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/feed/screens/feed_screen.dart';
import '../../features/landlord/screens/landlord_home_screen.dart';
import '../../features/qr_scanner/screens/scanner_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/auth/screens/verify_otp_screen.dart';
import '../../features/auth/screens/verify_id_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/search/screens/search_screen.dart';
import '../../features/map/screens/map_screen.dart';
import '../../features/messages/screens/messages_screen.dart';
import '../../features/messages/screens/chat_screen.dart';
import '../../features/roommates/screens/roommates_screen.dart';
import '../../state/auth_provider.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/feed',
    redirect: (context, state) {
      final isLoggedIn = authState.value != null;
      final isLandlordRoute = state.matchedLocation.startsWith('/landlord');
      final isAuthRoute = state.matchedLocation.startsWith('/login') ||
          state.matchedLocation.startsWith('/register') ||
          state.matchedLocation.startsWith('/forgot-password') ||
          state.matchedLocation.startsWith('/verify-otp') ||
          state.matchedLocation.startsWith('/verify-id');
      if (isLandlordRoute && !isLoggedIn) return '/feed';
      if (isLoggedIn && isAuthRoute) return '/feed';
      return null;
    },
    routes: [
      GoRoute(path: '/feed', builder: (context, state) => const FeedScreen()),
      GoRoute(path: '/landlord', builder: (context, state) => const LandlordHomeScreen()),
      GoRoute(path: '/scanner', builder: (context, state) => const ScannerScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
      GoRoute(path: '/forgot-password', builder: (context, state) => const ForgotPasswordScreen()),
      GoRoute(path: '/verify-otp', builder: (context, state) {
        final phone = state.uri.queryParameters['phone'] ?? '';
        return VerifyOtpScreen(phoneNumber: phone);
      }),
      GoRoute(path: '/verify-id', builder: (context, state) => const VerifyIdScreen()),
      GoRoute(path: '/profile', builder: (context, state) => const ProfileScreen()),
      GoRoute(path: '/search', builder: (context, state) => const SearchScreen()),
      GoRoute(path: '/map', builder: (context, state) => const MapScreen()),
      GoRoute(path: '/messages', builder: (context, state) => const MessagesScreen()),
      GoRoute(path: '/chat/:conversationId', builder: (context, state) {
        final id = state.pathParameters['conversationId'] ?? '';
        return ChatScreen(conversationId: id);
      }),
      GoRoute(path: '/roommates', builder: (context, state) => const RoommatesScreen()),
    ],
  );
});
