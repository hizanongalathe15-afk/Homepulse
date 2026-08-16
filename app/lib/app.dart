import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/routing/app_router.dart';

class HomepulseApp extends ConsumerWidget {
  const HomepulseApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(goRouterProvider);
    return MaterialApp.router(
      title: 'Homepulse',
      theme: AppTheme.lightTheme,
      routerConfig: router,
    );
  }
}
