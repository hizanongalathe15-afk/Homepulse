import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/theme/app_theme.dart';
import 'core/routing/app_router.dart';
import 'state/system_theme_provider.dart';

class HomepulseApp extends ConsumerWidget {
  const HomepulseApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.watch(systemThemeProvider);

    final lightTheme = ref.watch(lightThemeProvider);
    final darkTheme = ref.watch(darkThemeProvider);
    final themeMode = ref.watch(themeModeProvider);
    final router = ref.watch(goRouterProvider);

    return MaterialApp.router(
      title: 'Homepulse',
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: themeMode,
      routerConfig: router,
    );
  }
}

Future<void> saveThemeMode(WidgetRef ref, ThemeMode mode) async {
  ref.read(themeModeProvider.notifier).state = mode;
  final prefs = await SharedPreferences.getInstance();
  String value;
  switch (mode) {
    case ThemeMode.light:
      value = 'light';
      break;
    case ThemeMode.dark:
      value = 'dark';
      break;
    default:
      value = 'system';
  }
  await prefs.setString('theme_mode', value);
}
