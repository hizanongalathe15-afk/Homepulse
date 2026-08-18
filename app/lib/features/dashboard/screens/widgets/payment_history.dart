import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../services/payment_service.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/loading_spinner.dart';
import '../../../../core/utils/formatters.dart';

class PaymentHistory extends ConsumerWidget {
  final String userId;
  const PaymentHistory({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final paymentsAsync = ref.watch(paymentProvider);

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Payment History', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'View all payments');
                },
                child: const Text('View All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          paymentsAsync.when(
            loading: () => const Center(child: LoadingSpinner(size: 24)),
            error: (error, _) => const Text('Failed to load payments'),
            data: (payments) {
              if (payments.isEmpty) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text('No payments yet', style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                  ),
                );
              }
              return ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: payments.length,
                separatorBuilder: (context, index) => const Divider(),
                itemBuilder: (context, index) {
                  final payment = payments[index];
                  final isSuccess = payment.status.toLowerCase() == 'completed' || payment.status.toLowerCase() == 'success';
                  return ListTile(
                    dense: true,
                    leading: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: isSuccess ? AppColors.success.withOpacity(0.1) : AppColors.warning.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(isSuccess ? Icons.check_circle : Icons.pending, color: isSuccess ? AppColors.success : AppColors.warning),
                    ),
                    title: Text(payment.type[0].toUpperCase() + payment.type.substring(1)),
                    subtitle: Text(formatDate(payment.createdAt)),
                    trailing: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          formatCurrency(payment.amount),
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: isSuccess ? AppColors.success.withOpacity(0.1) : AppColors.warning.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            payment.status,
                            style: TextStyle(fontSize: 11, color: isSuccess ? AppColors.success : AppColors.warning),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
