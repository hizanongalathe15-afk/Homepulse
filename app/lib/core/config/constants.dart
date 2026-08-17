import 'dart:io';
import 'package:flutter/foundation.dart';

class Constants {
  Constants._();

  static const String appName = 'Homepulse';
  static const String appVersion = '1.0.0';

  static String _resolveApiUrl() {
    if (kIsWeb) {
      return const String.fromEnvironment('API_URL', defaultValue: 'http://localhost:3000/api/v1');
    }
    if (Platform.isAndroid) {
      return const String.fromEnvironment('API_URL', defaultValue: 'http://10.0.2.2:3000/api/v1');
    }
    if (Platform.isIOS) {
      return const String.fromEnvironment('API_URL', defaultValue: 'http://127.0.0.1:3000/api/v1');
    }
    return const String.fromEnvironment('API_URL', defaultValue: 'http://localhost:3000/api/v1');
  }

  static final String apiUrl = _resolveApiUrl();
  static const String socketUrl = String.fromEnvironment('SOCKET_URL', defaultValue: 'http://localhost:3000');
  static const String apiKey = '';
  static const String mapboxToken = 'pk.placeholder';
  static const String mpesaShortcode = '174379';
  static const String mpesaPasskey = '';
  static const String mpesaConsumerKey = '';
  static const String mpesaConsumerSecret = '';
  static const String mpesaCallbackUrl = 'http://localhost:3000/api/v1/mpesa/callback';
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;
  static const int sendTimeout = 30000;
  static const String localStorageKey = 'homepulse_storage';
  static const String sessionTokenKey = 'session_token';
  static const String userKey = 'user';
  static const int itemsPerPage = 20;
  static const double defaultZoomLevel = 14.0;
  static const String defaultLocation = '-1.2921,36.8219';
  static const String defaultCity = 'Nairobi';
  static const String defaultCountry = 'Kenya';
  static const String currencyCode = 'KES';
  static const String currencySymbol = 'KSh';
  static const int otpExpiryMinutes = 5;
  static const int maxImageUploadSize = 5 * 1024 * 1024;
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp'];

  static bool get isProduction => kReleaseMode;
  static bool get isDebug => kDebugMode;
}
