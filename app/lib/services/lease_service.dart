import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/config/constants.dart';
import '../models/lease.dart';

class LeaseService {
  late final ApiClient _api = ApiClient(baseUrl: Constants.apiUrl);

  Future<List<Lease>> getMyLeases({String? status, int page = 1, int limit = 20}) async {
    final response = await _api.get('/leases/my', queryParameters: {
      if (status != null && status.isNotEmpty) 'status': status,
      'page': page,
      'limit': limit,
    });
    final List<dynamic> data = response.data['data'] as List<dynamic>? ?? [];
    return data.map((json) => Lease.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<List<Lease>> getLandlordLeases({String? status, int page = 1, int limit = 20}) async {
    final response = await _api.get('/leases/landlord', queryParameters: {
      if (status != null && status.isNotEmpty) 'status': status,
      'page': page,
      'limit': limit,
    });
    final List<dynamic> data = response.data['data'] as List<dynamic>? ?? [];
    return data.map((json) => Lease.fromJson(json as Map<String, dynamic>)).toList();
  }

  Future<Lease> getLease(String id) async {
    final response = await _api.get('/leases/$id');
    return Lease.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<Lease> createLease(Map<String, dynamic> leaseData) async {
    final response = await _api.post('/leases', data: leaseData);
    return Lease.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<Lease> updateLease(String id, Map<String, dynamic> leaseData) async {
    final response = await _api.put('/leases/$id', data: leaseData);
    return Lease.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<void> terminateLease(String id) async {
    await _api.post('/leases/$id/terminate');
  }
}

final leaseServiceProvider = Provider<LeaseService>((ref) => LeaseService());

final tenantLeasesProvider = FutureProvider.family<List<Lease>, String>((ref, tenantId) async {
  return ref.read(leaseServiceProvider).getMyLeases();
});
