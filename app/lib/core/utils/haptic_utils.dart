import 'package:flutter/services.dart';
import 'package:vibration/vibration.dart';

class HapticUtils {
  static Future<void> lightImpact() async {
    await HapticFeedback.lightImpact();
    if (await Vibration.hasVibrator() ?? false) {
      Vibration.vibrate(duration: 10);
    }
  }

  static Future<void> mediumImpact() async {
    await HapticFeedback.mediumImpact();
    if (await Vibration.hasVibrator() ?? false) {
      Vibration.vibrate(duration: 20);
    }
  }

  static Future<void> heavyImpact() async {
    await HapticFeedback.heavyImpact();
    if (await Vibration.hasVibrator() ?? false) {
      Vibration.vibrate(duration: 30);
    }
  }

  static Future<void> selectionClick() async {
    await HapticFeedback.selectionClick();
  }

  static Future<void> success() async {
    await mediumImpact();
    await Future.delayed(const Duration(milliseconds: 100));
    await lightImpact();
  }

  static Future<void> error() async {
    await heavyImpact();
    await Future.delayed(const Duration(milliseconds: 100));
    await heavyImpact();
  }
}
