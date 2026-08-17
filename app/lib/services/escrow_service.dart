import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/models/escrow.dart';

class EscrowService {
  Future<List<Escrow>> getEscrows(String landlordId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.generate(3, (i) => Escrow(
      id: 'escrow_$i',
      propertyId: 'prop_$i',
      tenantId: 'tenant_$i',
      landlordId: landlordId,
      amount: 45000 + i * 10000,
      status: i == 0 ? 'released' : 'pending',
      createdAt: DateTime.now().subtract(Duration(days: i * 7)),
      releasedAt: i == 0 ? DateTime.now().subtract(const Duration(days: 2)) : null,
    ));
  }

  Future<void> releaseEscrow(String escrowId) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  Future<void> createEscrow(Escrow escrow) async {
    await Future.delayed(const Duration(milliseconds: 400));
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
      await _escrowService.releaseEscrow(escrowId);
      final updated = state.value?.map((e) => e.id == escrowId ? e.copyWith(status: 'released', releasedAt: DateTime.now()) : e).toList() ?? [];
      state = AsyncValue.data(updated);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final escrowProvider = StateNotifierProvider<EscrowNotifier, AsyncValue<List<Escrow>>>((ref) {
  return EscrowNotifier(ref.read(escrowServiceProvider));
});
