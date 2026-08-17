import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/widgets.dart';

final localeProvider = StateProvider<Locale>((ref) {
  return const Locale('en');
});

final localeNotifierProvider = NotifierProvider<LocaleNotifier, Locale>(() {
  return LocaleNotifier();
});

class LocaleNotifier extends Notifier<Locale> {
  @override
  Locale build() {
    return const Locale('en');
  }

  void setLocale(Locale locale) {
    state = locale;
  }

  void toggleLanguage() {
    state = state.languageCode == 'en' ? const Locale('sw') : const Locale('en');
  }
}
