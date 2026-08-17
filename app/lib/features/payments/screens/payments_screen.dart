import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/payment.dart';
import 'package:homepulse/models/escrow.dart';
import 'package:homepulse/services/payment_service.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/loading_spinner.dart';
import 'package:homepulse/core/utils/formatters.dart';
import 'mpesa_payment.dart';
import 'stripe_payment.dart';
import 'escrow_deposit_flow.dart';
import 'payment_history.dart';
import 'invoice_generator.dart';
import 'qr_code_payment.dart';

class PaymentsScreen extends ConsumerStatefulWidget {
  const PaymentsScreen({super.key});

  @override
  ConsumerState<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends ConsumerState<PaymentsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    ref.read(paymentProvider.notifier).build();
    ref.read(escrowProvider.notifier).build();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final paymentsAsync = ref.watch(paymentProvider);
    final escrowAsync = ref.watch(escrowProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Payments'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Dashboard'),
            Tab(text: 'History'),
            Tab(text: 'Tools'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDashboard(paymentsAsync, escrowAsync),
          PaymentHistory(payments: paymentsAsync.valueOrNull ?? []),
          _buildTools(),
        ],
      ),
    );
  }

  Widget _buildDashboard(AsyncValue<List<Payment>> paymentsAsync, AsyncValue<List<EscrowTransaction>> escrowAsync) {
    final payments = paymentsAsync.valueOrNull ?? [];
    final escrows = escrowAsync.valueOrNull ?? [];
    final totalSpent = payments.fold<double>(0, (sum, p) => sum + p.amount);
    final pendingEscrow = escrows.where((e) => e.status == 'pending').fold<double>(0, (sum, e) => sum + e.amount);

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(paymentProvider);
        ref.invalidate(escrowProvider);
      },
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              Expanded(
                child: AppCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Total Spent', style: Theme.of(context).textTheme.bodySmall),
                      const SizedBox(height: 8),
                      Text(formatCurrency(totalSpent), style: Theme.of(context).textTheme.headlineSmall),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('In Escrow', style: Theme.of(context).textTheme.bodySmall),
                      const SizedBox(height: 8),
                      Text(formatCurrency(pendingEscrow), style: Theme.of(context).textTheme.headlineSmall),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text('Quick Actions', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.6,
            children: [
              _QuickActionCard(
                icon: Icons.phone_android,
                label: 'M-Pesa',
                color: AppColors.success,
                onTap: () => _showPaymentSheet(const MpesaPayment()),
              ),
              _QuickActionCard(
                icon: Icons.credit_card,
                label: 'Stripe',
                color: AppColors.primary,
                onTap: () => _showPaymentSheet(const StripePayment()),
              ),
              _QuickActionCard(
                icon: Icons.account_balance,
                label: 'Escrow',
                color: AppColors.secondary,
                onTap: () => _showPaymentSheet(const EscrowDepositFlow()),
              ),
              _QuickActionCard(
                icon: Icons.qr_code_scanner,
                label: 'QR Pay',
                color: AppColors.tertiary,
                onTap: () => _showPaymentSheet(const QrCodePayment()),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Recent Transactions', style: Theme.of(context).textTheme.titleLarge),
              TextButton(onPressed: () {}, child: const Text('View All')),
            ],
          ),
          const SizedBox(height: 12),
          paymentsAsync.when(
            loading: () => const Center(child: LoadingSpinner()),
            error: (error, _) => Center(
              child: Column(
                children: [
                  const Icon(Icons.error_outline, color: AppColors.error),
                  const SizedBox(height: 8),
                  ElevatedButton(onPressed: () => ref.invalidate(paymentProvider), child: const Text('Retry')),
                ],
              ),
            ),
            data: (payments) {
              if (payments.isEmpty) {
                return const Center(child: Text('No transactions yet'));
              }
              return Column(
                children: payments.take(5).map((payment) {
                  return AppCard(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: _getMethodColor(payment.type),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(_getMethodIcon(payment.type), color: Colors.white),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(payment.type.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w600)),
                              Text(formatDate(payment.createdAt), style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(formatCurrency(payment.amount), style: const TextStyle(fontWeight: FontWeight.w600)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: _getStatusColor(payment.status),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(payment.status, style: const TextStyle(fontSize: 10, color: Colors.white)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildTools() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        AppCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Payment Tools', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 16),
              ListTile(
                leading: const Icon(Icons.qr_code, color: AppColors.primary),
                title: const Text('Receive Payment via QR'),
                subtitle: const Text('Generate QR code for rent collection'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () => _showPaymentSheet(const QrCodePayment()),
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.receipt_long, color: AppColors.secondary),
                title: const Text('Generate Invoice'),
                subtitle: const Text('Create and download invoice PDF'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () => _showPaymentSheet(const InvoiceGenerator()),
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.account_balance_wallet, color: AppColors.tertiary),
                title: const Text('Escrow Deposit'),
                subtitle: const Text('Deposit funds to secure a property'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () => _showPaymentSheet(const EscrowDepositFlow()),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showPaymentSheet(Widget content) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (ctx, scrollController) => Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: content,
        ),
      ),
    );
  }

  Color _getMethodColor(String method) {
    switch (method.toLowerCase()) {
      case 'mpesa':
        return AppColors.success;
      case 'stripe':
        return AppColors.primary;
      case 'escrow':
        return AppColors.secondary;
      default:
        return AppColors.textSecondary;
    }
  }

  IconData _getMethodIcon(String method) {
    switch (method.toLowerCase()) {
      case 'mpesa':
        return Icons.phone_android;
      case 'stripe':
        return Icons.credit_card;
      case 'escrow':
        return Icons.account_balance;
      default:
        return Icons.payment;
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return AppColors.success;
      case 'pending':
        return AppColors.warning;
      case 'failed':
      case 'cancelled':
        return AppColors.error;
      default:
        return AppColors.textSecondary;
    }
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
