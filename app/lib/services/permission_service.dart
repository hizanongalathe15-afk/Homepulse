import 'package:permission_handler/permission_handler.dart';

enum PermissionType {
  camera,
  location,
  sms,
  photos,
  microphone,
  notifications,
  biometric,
  storage,
}

class PermissionService {
  static Future<bool> request(PermissionType type) async {
    Permission permission;
    switch (type) {
      case PermissionType.camera:
        permission = Permission.camera;
        break;
      case PermissionType.location:
        permission = Permission.locationWhenInUse;
        break;
      case PermissionType.sms:
        permission = Permission.sms;
        break;
      case PermissionType.photos:
        permission = Permission.photos;
        break;
      case PermissionType.microphone:
        permission = Permission.microphone;
        break;
      case PermissionType.notifications:
        permission = Permission.notification;
        break;
      case PermissionType.biometric:
        permission = Permission.biometrics;
        break;
      case PermissionType.storage:
        permission = Permission.storage;
        break;
    }

    final status = await permission.request();
    return status.isGranted;
  }

  static Future<bool> check(PermissionType type) async {
    Permission permission;
    switch (type) {
      case PermissionType.camera:
        permission = Permission.camera;
        break;
      case PermissionType.location:
        permission = Permission.locationWhenInUse;
        break;
      case PermissionType.sms:
        permission = Permission.sms;
        break;
      case PermissionType.photos:
        permission = Permission.photos;
        break;
      case PermissionType.microphone:
        permission = Permission.microphone;
        break;
      case PermissionType.notifications:
        permission = Permission.notification;
        break;
      case PermissionType.biometric:
        permission = Permission.biometrics;
        break;
      case PermissionType.storage:
        permission = Permission.storage;
        break;
    }

    return await permission.isGranted;
  }

  static Future<void> openSettings() async {
    await openAppSettings();
  }
}
