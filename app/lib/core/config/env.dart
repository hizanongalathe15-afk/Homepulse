import 'package:homepulse/core/config/constants.dart';

class Env {
  Env._();

  static String get apiUrl => Constants.apiUrl;
  static String get apiKey => Constants.apiKey;
  static String get mapboxToken => Constants.mapboxToken;
  static String get mpesaShortcode => Constants.mpesaShortcode;
  static String get mpesaPasskey => Constants.mpesaPasskey;
  static String get mpesaConsumerKey => Constants.mpesaConsumerKey;
  static String get mpesaConsumerSecret => Constants.mpesaConsumerSecret;
  static String get mpesaCallbackUrl => Constants.mpesaCallbackUrl;
  static String get localStorageKey => Constants.localStorageKey;
  static String get sessionTokenKey => Constants.sessionTokenKey;
  static String get userKey => Constants.userKey;
}
