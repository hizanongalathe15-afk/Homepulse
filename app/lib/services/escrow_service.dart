import '../models/escrow.dart';

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
