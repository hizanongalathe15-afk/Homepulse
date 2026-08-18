import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/validators.dart';
import '../../../../models/identity_verification.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';

class VerificationStatusScreen extends ConsumerWidget {
  const VerificationStatusScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    final userId = authState.value?.id ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Identity Verification'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _VerificationBanner(),
            const SizedBox(height: 24),
            _VerificationForm(userId: userId),
            const SizedBox(height: 24),
            Text(
              'Verification History',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            _VerificationHistoryList(userId: userId),
          ],
        ),
      ),
    );
  }
}

class _VerificationBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primary.withOpacity(0.1), AppColors.primaryLight.withOpacity(0.05)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primary.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.verified_user_rounded, color: AppColors.primary, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Verify Your Identity',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Complete verification to unlock all features',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _VerificationForm extends StatefulWidget {
  final String userId;

  const _VerificationForm({required this.userId});

  @override
  State<_VerificationForm> createState() => _VerificationFormState();
}

class _VerificationFormState extends State<_VerificationForm> {
  final _formKey = GlobalKey<FormState>();
  final _idNumberController = TextEditingController();
  final _fullNameController = TextEditingController();
  String _selectedDocumentType = 'national_id';
  bool _isSubmitting = false;

  final List<String> _documentTypes = [
    'national_id',
    'passport',
    'drivers_license',
  ];

  Future<void> _submitVerification() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      await Future.delayed(const Duration(milliseconds: 1000));

      if (mounted) {
        AppToast.success(context, 'Verification submitted successfully');
        _idNumberController.clear();
        _fullNameController.clear();
      }
    } catch (e) {
      if (mounted) {
        AppToast.error(context, 'Failed to submit verification');
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  void dispose() {
    _idNumberController.dispose();
    _fullNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Submit Documents',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            AppInput(
              controller: _fullNameController,
              labelText: 'Full Name',
              hintText: 'As it appears on ID',
              validator: (value) => validateRequired(value, fieldName: 'Full Name'),
            ),
            const SizedBox(height: 16),
            AppInput(
              controller: _idNumberController,
              labelText: 'ID Number',
              hintText: 'Enter your ID number',
              validator: (value) => validateRequired(value, fieldName: 'ID Number'),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedDocumentType,
              decoration: const InputDecoration(
                labelText: 'Document Type',
                border: OutlineInputBorder(),
              ),
              items: _documentTypes.map((type) {
                return DropdownMenuItem(
                  value: type,
                  child: Text(type.replaceAll('_', ' ').toUpperCase()),
                );
              }).toList(),
              onChanged: (value) {
                if (value != null) setState(() => _selectedDocumentType = value);
              },
            ),
            const SizedBox(height: 24),
            AppButton(
              text: _isSubmitting ? 'Submitting...' : 'Submit Verification',
              onPressed: _isSubmitting ? null : _submitVerification,
              isLoading: _isSubmitting,
            ),
          ],
        ),
      ),
    );
  }
}

class _VerificationHistoryList extends StatelessWidget {
  final String userId;

  const _VerificationHistoryList({required this.userId});

  List<IdentityVerification> _getMockHistory() {
    return [
      IdentityVerification(
        id: 'ver_1',
        userId: userId,
        type: 'national_id',
        documentUrl: 'https://example.com/id_front.jpg',
        status: 'approved',
        createdAt: DateTime.now().subtract(const Duration(days: 30)),
        verifiedAt: DateTime.now().subtract(const Duration(days: 29)),
      ),
      IdentityVerification(
        id: 'ver_2',
        userId: userId,
        type: 'passport',
        documentUrl: 'https://example.com/passport.jpg',
        status: 'pending',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final history = _getMockHistory();

    if (history.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            'No verification history',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ),
      );
    }

    return Column(
      children: history.map((verification) => _VerificationTile(verification: verification)).toList(),
    );
  }
}

class _VerificationTile extends StatelessWidget {
  final IdentityVerification verification;

  const _VerificationTile({required this.verification});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final statusColor = _getStatusColor(verification.status);

    return AppCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                _getStatusIcon(verification.status),
                color: statusColor,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    verification.type.replaceAll('_', ' ').toUpperCase(),
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Submitted ${_formatDate(verification.createdAt)}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                verification.status.toUpperCase(),
                style: theme.textTheme.labelSmall?.copyWith(
                  color: statusColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'verified':
        return AppColors.success;
      case 'pending':
      case 'processing':
        return AppColors.warning;
      case 'rejected':
      case 'failed':
        return AppColors.error;
      default:
        return AppColors.textSecondary;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'verified':
        return LucideIcons.circle_check;
      case 'pending':
      case 'processing':
        return Icons.pending_rounded;
      case 'rejected':
      case 'failed':
        return Icons.cancel_rounded;
      default:
        return Icons.help_outline_rounded;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
