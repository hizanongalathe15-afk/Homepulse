import 'dart:async';
import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/models/identity_verification.dart';

class IdVerificationNotifier extends AsyncNotifier<List<IdentityVerification>> {
  late final ApiClient _api = ApiClient(baseUrl: 'https://api.homepulse.app');

  @override
  Future<List<IdentityVerification>> build() async {
    final response = await _api.get('/identity-verifications');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => IdentityVerification.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<IdentityVerification> submitVerification({
    required String idNumber,
    required String fullName,
    required String documentType,
    required File frontImage,
    File? backImage,
  }) async {
    try {
      final formData = FormData();
      formData.fields.addAll([
        MapEntry('id_number', idNumber),
        MapEntry('full_name', fullName),
        MapEntry('document_type', documentType),
      ]);
      formData.files.add(MapEntry(
        'document_front',
        MultipartFile.fromFileSync(frontImage.path, filename: 'front_${DateTime.now().millisecondsSinceEpoch}.jpg'),
      ));
      if (backImage != null) {
        formData.files.add(MapEntry(
          'document_back',
          MultipartFile.fromFileSync(backImage.path, filename: 'back_${DateTime.now().millisecondsSinceEpoch}.jpg'),
        ));
      }
      final response = await _api.post('/identity-verifications/submit', data: formData);
      final verification = IdentityVerification.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data([verification, ...current]);
      return verification;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<IdentityVerification> uploadDocument(String type, String documentUrl) async {
    try {
      final response = await _api.post('/identity-verifications', data: {
        'type': type,
        'document_url': documentUrl,
      });
      final verification = IdentityVerification.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data([verification, ...current]);
      return verification;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<IdentityVerification> getStatus(String verificationId) async {
    try {
      final response = await _api.get('/identity-verifications/$verificationId');
      return IdentityVerification.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<List<IdentityVerification>> getHistory(String userId) async {
    try {
      final response = await _api.get('/users/$userId/identity-verifications');
      final List<dynamic> list = response.data as List<dynamic>;
      return list.map((e) => IdentityVerification.fromJson(e as Map<String, dynamic>)).toList();
    } on ApiException catch (e) {
      rethrow;
    }
  }
}

final idVerificationProvider = AsyncNotifierProvider<IdVerificationNotifier, List<IdentityVerification>>(() => IdVerificationNotifier());
