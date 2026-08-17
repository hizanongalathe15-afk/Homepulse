import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/lease_service.dart';
import '../models/lease.dart';

final tenantLeasesProvider = FutureProvider.family<List<Lease>, String>((ref, userId) async {
  final service = ref.read(leaseServiceProvider);
  return service.getMyLeases();
});

final landlordLeasesProvider = FutureProvider.family<List<Lease>, String>((ref, landlordId) async {
  final service = ref.read(leaseServiceProvider);
  return service.getLandlordLeases();
});
