import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/config/constants.dart';
import '../models/escrow.dart';

class EscrowService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<List<Escrow>> getEscrows(String landlordId) async {
    final response = await _api.get('/escrow', queryParameters: {
      'landlord_id': landlordId,
    });
    final List<dynamic> data = response.data as List<dynamic>;
    return data.map((json) => Escrow.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<Escrow> releaseEscrow(String escrowId) async {
    final response = await _api.post('/escrow/$escrowId/release');
    return Escrow.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Escrow> createEscrow(Map<String, dynamic> escrowData) async {
    final response = await _api.post('/escrow', data: escrowData);
    return Escrow.fromJson(response.data as Map<String, dynamic>);
  }
}

final escrowServiceProvider = Provider<EscrowService>((ref) => EscrowService());

class EscrowNotifier extends StateNotifier<AsyncValue<List<Escrow>>> {
  final EscrowService _escrowService;

  EscrowNotifier(this._escrowService) : super(const AsyncValue.loading());

  Future<void> loadEscrows(String landlordId) async {
    try {
      final escrows = await _escrowService.getEscrows(landlordId);
      state = AsyncValue.data(escrows);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> releaseEscrow(String escrowId) async {
    try {
      final released = await _escrowService.releaseEscrow(escrowId);
      final updated = state.value?.map((e) => e.id == escrowId ? released : e).toList() ?? [];
      state = AsyncValue.data(updated);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final escrowProvider = StateNotifierProvider<EscrowNotifier, AsyncValue<List<Escrow>>>((ref) {
  return EscrowNotifier(ref.read(escrowServiceProvider));
});
