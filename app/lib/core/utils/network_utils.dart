import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

class NetworkUtils {
  static bool _isLowBandwidthMode = false;
  static double _currentSpeed = 0.0;

  static bool get isLowBandwidthMode => _isLowBandwidthMode;

  static Future<void> checkNetworkSpeed() async {
    try {
      final connectivityResult = await Connectivity().checkConnectivity();
      if (connectivityResult.contains(ConnectivityResult.mobile)) {
        _isLowBandwidthMode = true;
        _currentSpeed = 1.0;
      } else if (connectivityResult.contains(ConnectivityResult.wifi)) {
        _isLowBandwidthMode = false;
        _currentSpeed = 10.0;
      } else if (connectivityResult.contains(ConnectivityResult.none)) {
        _isLowBandwidthMode = true;
        _currentSpeed = 0.0;
      } else {
        _isLowBandwidthMode = true;
        _currentSpeed = 0.5;
      }
    } catch (e) {
      _isLowBandwidthMode = true;
      _currentSpeed = 0.0;
    }
  }

  static Future<bool> isLowBandwidth() async {
    await checkNetworkSpeed();
    return _isLowBandwidthMode;
  }

  static double get currentSpeed => _currentSpeed;

  static Widget conditionalRender({
    required BuildContext context,
    required Widget highBandwidthWidget,
    required Widget lowBandwidthWidget,
  }) {
    return FutureBuilder<bool>(
      future: isLowBandwidth(),
      builder: (context, snapshot) {
        if (snapshot.data == true) {
          return lowBandwidthWidget;
        }
        return highBandwidthWidget;
      },
    );
  }
}
