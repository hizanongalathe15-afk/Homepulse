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
import '../../features/dashboard/screens/dashboard_screen.dart';
import '../../features/community/screens/community_screen.dart';
import '../../features/community/screens/neighborhood_screen.dart';
import '../../features/payments/screens/payments_screen.dart';
import '../../features/property_detail/screens/property_detail_screen.dart';
import '../../features/safety/screens/sos_screen.dart';
import '../../features/safety/screens/safety_reports_screen.dart';
import '../../features/referrals/screens/referrals_screen.dart';
import '../../features/search/screens/saved_searches_screen.dart';
import '../../features/archive/screens/archive_screen.dart';
import '../../features/notifications/screens/notifications_screen.dart';
import '../../screens/privacy_settings_screen.dart';
import '../../screens/history_screen.dart';
import '../../screens/followers_screen.dart';
import '../../screens/following_screen.dart';
import '../../screens/blocked_users_screen.dart';
import '../../state/auth_provider.dart';
import '../transitions/transitions.dart';

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
      GoRoute(
        path: '/feed',
        pageBuilder: (context, state) =>
            fadeScaleTransition(child: const FeedScreen(), state: state),
      ),
      GoRoute(
        path: '/landlord',
        pageBuilder: (context, state) =>
            fadeScaleTransition(child: const LandlordHomeScreen(), state: state),
      ),
      GoRoute(
        path: '/scanner',
        pageBuilder: (context, state) =>
            slideTransition(child: const ScannerScreen(), state: state),
      ),
      GoRoute(
        path: '/login',
        pageBuilder: (context, state) =>
            fadeScaleTransition(child: const LoginScreen(), state: state),
      ),
      GoRoute(
        path: '/register',
        pageBuilder: (context, state) =>
            fadeScaleTransition(child: const RegisterScreen(), state: state),
      ),
      GoRoute(
        path: '/forgot-password',
        pageBuilder: (context, state) =>
            fadeScaleTransition(child: const ForgotPasswordScreen(), state: state),
      ),
      GoRoute(
        path: '/verify-otp',
        pageBuilder: (context, state) {
          final phone = state.uri.queryParameters['phone'] ?? '';
          return fadeScaleTransition(
            child: VerifyOtpScreen(phoneNumber: phone),
            state: state,
          );
        },
      ),
      GoRoute(
        path: '/verify-id',
        pageBuilder: (context, state) =>
            fadeScaleTransition(child: const VerifyIdScreen(), state: state),
      ),
      GoRoute(
        path: '/profile',
        pageBuilder: (context, state) =>
            slideTransition(child: const ProfileScreen(), state: state),
      ),
      GoRoute(
        path: '/search',
        pageBuilder: (context, state) =>
            slideTransition(child: const SearchScreen(), state: state),
      ),
      GoRoute(
        path: '/map',
        pageBuilder: (context, state) =>
            slideTransition(child: const MapScreen(), state: state),
      ),
      GoRoute(
        path: '/messages',
        pageBuilder: (context, state) =>
            slideTransition(child: const MessagesScreen(), state: state),
      ),
      GoRoute(
        path: '/chat/:conversationId',
        pageBuilder: (context, state) {
          final id = state.pathParameters['conversationId'] ?? '';
          return slideTransition(
            begin: const Offset(0, 0.1),
            child: ChatScreen(conversationId: id),
            state: state,
          );
        },
      ),
      GoRoute(
        path: '/property/:propertyId',
        pageBuilder: (context, state) {
          final id = state.pathParameters['propertyId'] ?? '';
          return fadeScaleTransition(
            child: PropertyDetailScreen(propertyId: id),
            state: state,
          );
        },
      ),
      GoRoute(
        path: '/roommates',
        pageBuilder: (context, state) =>
            slideTransition(child: const RoommatesScreen(), state: state),
      ),
      GoRoute(
        path: '/privacy',
        pageBuilder: (context, state) =>
            slideTransition(child: const PrivacySettingsScreen(), state: state),
      ),
      GoRoute(
        path: '/history',
        pageBuilder: (context, state) =>
            slideTransition(child: const HistoryScreen(), state: state),
      ),
      GoRoute(
        path: '/followers',
        pageBuilder: (context, state) =>
            slideTransition(child: const FollowersScreen(users: []), state: state),
      ),
      GoRoute(
        path: '/following',
        pageBuilder: (context, state) =>
            slideTransition(child: const FollowingScreen(users: []), state: state),
      ),
      GoRoute(
        path: '/blocked-users',
        pageBuilder: (context, state) =>
            slideTransition(child: const BlockedUsersScreen(users: []), state: state),
      ),
      GoRoute(
        path: '/dashboard',
        pageBuilder: (context, state) =>
            fadeScaleTransition(child: const DashboardScreen(), state: state),
      ),
      GoRoute(
        path: '/community',
        pageBuilder: (context, state) =>
            slideTransition(child: const CommunityScreen(), state: state),
      ),
      GoRoute(
        path: '/neighborhood/:neighborhoodId',
        pageBuilder: (context, state) {
          final id = state.pathParameters['neighborhoodId'] ?? '';
          return fadeScaleTransition(
            child: NeighborhoodScreen(neighborhoodId: id),
            state: state,
          );
        },
      ),
      GoRoute(
        path: '/payments',
        pageBuilder: (context, state) =>
            slideTransition(child: const PaymentsScreen(), state: state),
      ),
      GoRoute(
        path: '/sos',
        pageBuilder: (context, state) =>
            slideTransition(child: const SOSScreen(), state: state),
      ),
      GoRoute(
        path: '/safety-reports',
        pageBuilder: (context, state) =>
            slideTransition(child: const SafetyReportsScreen(), state: state),
      ),
      GoRoute(
        path: '/referrals',
        pageBuilder: (context, state) =>
            slideTransition(child: const ReferralsScreen(), state: state),
      ),
      GoRoute(
        path: '/saved-searches',
        pageBuilder: (context, state) =>
            slideTransition(child: const SavedSearchesScreen(), state: state),
      ),
      GoRoute(
        path: '/archive',
        pageBuilder: (context, state) =>
            slideTransition(child: const ArchiveScreen(), state: state),
      ),
      GoRoute(
        path: '/notifications',
        pageBuilder: (context, state) =>
            slideTransition(child: const NotificationsScreen(), state: state),
      ),
    ],
  );
});
