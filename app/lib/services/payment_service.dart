import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/network/api_client.dart';
import 'package:homepulse/core/network/api_exception.dart';
import 'package:homepulse/models/payment.dart';
import 'package:homepulse/models/escrow.dart';

class PaymentNotifier extends AsyncNotifier<List<Payment>> {
  late final ApiClient _api = ApiClient(baseUrl: 'https://api.homepulse.app');

  @override
  Future<List<Payment>> build() async {
    final response = await _api.get('/payments');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => Payment.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Payment> initiateMpesaStkPush({
    required String phoneNumber,
    required double amount,
    required String propertyId,
  }) async {
    try {
      final response = await _api.post('/payments/mpesa/stk-push', data: {
        'phone_number': phoneNumber,
        'amount': amount,
        'property_id': propertyId,
      });
      return Payment.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<Payment> initiateStripePayment({
    required String propertyId,
    required double amount,
    required String currency,
  }) async {
    try {
      final response = await _api.post('/payments/stripe/initiate', data: {
        'property_id': propertyId,
        'amount': amount,
        'currency': currency,
      });
      return Payment.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<Payment> getPaymentStatus(String paymentId) async {
    try {
      final response = await _api.get('/payments/$paymentId/status');
      return Payment.fromJson(response.data as Map<String, dynamic>);
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<void> refund(String paymentId) async {
    try {
      await _api.post('/payments/$paymentId/refund');
    } on ApiException catch (e) {
      rethrow;
    }
  }
}

class EscrowNotifier extends AsyncNotifier<List<EscrowTransaction>> {
  late final ApiClient _api = ApiClient(baseUrl: 'https://api.homepulse.app');

  @override
  Future<List<EscrowTransaction>> build() async {
    final response = await _api.get('/escrow');
    final List<dynamic> list = response.data as List<dynamic>;
    return list.map((e) => EscrowTransaction.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<EscrowTransaction> deposit(String paymentId, double amount) async {
    try {
      final response = await _api.post('/escrow/deposit', data: {
        'payment_id': paymentId,
        'amount': amount,
      });
      final escrow = EscrowTransaction.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data([escrow, ...current]);
      return escrow;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<EscrowTransaction> release(String escrowId) async {
    try {
      final response = await _api.post('/escrow/$escrowId/release');
      final updated = EscrowTransaction.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data(current.map((e) => e.id == escrowId ? updated : e).toList());
      return updated;
    } on ApiException catch (e) {
      rethrow;
    }
  }

  Future<EscrowTransaction> dispute(String escrowId, String reason) async {
    try {
      final response = await _api.post('/escrow/$escrowId/dispute', data: {
        'reason': reason,
      });
      final updated = EscrowTransaction.fromJson(response.data as Map<String, dynamic>);
      final current = state.valueOrNull ?? [];
      state = AsyncValue.data(current.map((e) => e.id == escrowId ? updated : e).toList());
      return updated;
    } on ApiException catch (e) {
      rethrow;
    }
  }
}

final paymentProvider = AsyncNotifierProvider<PaymentNotifier, List<Payment>>(() => PaymentNotifier());
final escrowProvider = AsyncNotifierProvider<EscrowNotifier, List<EscrowTransaction>>(() => EscrowNotifier());
