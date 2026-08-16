import 'package:homepulse/core/config/constants.dart';

class MapboxConfig {
  MapboxConfig._();

  static String get accessToken => Constants.mapboxToken;
  static String get style => 'mapbox://styles/mapbox/streets-v12';
  static String get defaultCameraTarget => Constants.defaultLocation;
  static double get defaultZoom => Constants.defaultZoomLevel;
  static int get minimumZoomLevel => 2;
  static int get maximumZoomLevel => 20;
  static bool get showUserLocation => true;
  static bool get enableRotation => true;
  static bool get enableTilt => true;
  static bool get enableZoomGestures => true;
  static bool get enableScrollGestures => true;
  static bool get enableDoubleTapZoom => true;
  static bool get enablePitchGestures => true;
  static bool get enableRotateGestures => true;
  static bool get compassEnabled => true;
  static bool get logoEnabled => false;
  static bool get attributionEnabled => true;
}
