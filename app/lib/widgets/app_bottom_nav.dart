import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:go_router/go_router.dart';

class AppBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const AppBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  int _indexForLocation(String location) {
    if (location.startsWith('/map')) return 1;
    if (location.startsWith('/search')) return 2;
    if (location.startsWith('/messages') || location.startsWith('/chat')) return 3;
    if (location.startsWith('/profile') ||
        location.startsWith('/history') ||
        location.startsWith('/followers') ||
        location.startsWith('/following') ||
        location.startsWith('/blocked-users') ||
        location.startsWith('/privacy')) return 4;
    return 0;
  }

  static int indexFor(BuildContext context) {
    final location = GoRouter.of(context).location;
    return AppBottomNav()._indexForLocation(location);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return NavigationBar(
      selectedIndex: currentIndex,
      onTap: onTap,
      backgroundColor: theme.colorScheme.surface,
      elevation: 8,
      destinations: const [
        NavigationDestination(
          icon: Icon(LucideIcons.home),
          label: 'Feed',
        ),
        NavigationDestination(
          icon: Icon(LucideIcons.map),
          label: 'Map',
        ),
        NavigationDestination(
          icon: Icon(LucideIcons.search),
          label: 'Search',
        ),
        NavigationDestination(
          icon: Icon(LucideIcons.message),
          label: 'Messages',
        ),
        NavigationDestination(
          icon: Icon(LucideIcons.user),
          label: 'Profile',
        ),
      ],
    );
  }
}
