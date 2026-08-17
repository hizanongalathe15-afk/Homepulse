import 'package:homepulse/core/config/constants.dart';

class MpesaConfig {
  MpesaConfig._();

  static String get shortcode => Constants.mpesaShortcode;
  static String get passkey => Constants.mpesaPasskey;
  static String get consumerKey => Constants.mpesaConsumerKey;
  static String get consumerSecret => Constants.mpesaConsumerSecret;
  static String get callbackUrl => Constants.mpesaCallbackUrl;
  static String get authUrl => 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  static String get stkPushUrl => 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  static String get c2bUrl => 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
  static String get b2cUrl => 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';
  static String get transactionStatusUrl => 'https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query';
  static String get accountBalanceUrl => 'https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query';
  static int get stkPushTimeoutSeconds => 30;
  static String get transactionType => 'CustomerPayBillOnline';
  static String get partyA => '254700000000';
  static String get partyB => Constants.mpesaShortcode;
  static String get resultUrl => '${Constants.apiUrl}/mpesa/result';
  static String get queueUrl => '${Constants.apiUrl}/mpesa/queue';
  static bool get useSandbox => Constants.isDebug;
}
