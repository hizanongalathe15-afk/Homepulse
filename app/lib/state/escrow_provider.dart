import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/escrow.dart';
import '../services/escrow_service.dart';

final escrowServiceProvider = Provider<EscrowService>((ref) => EscrowService());

final escrowProvider = StateNotifierProvider<EscrowNotifier, AsyncValue<List<Escrow>>>((ref) {
  return EscrowNotifier(ref.read(escrowServiceProvider));
});

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
      await _escrowService.releaseEscrow(escrowId);
      final updated = state.value?.map((e) => e.id == escrowId ? e.copyWith(status: 'released', releasedAt: DateTime.now()) : e).toList() ?? [];
      state = AsyncValue.data(updated);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
