import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/identity_verification.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/loading_spinner.dart';

class VideoPreCallVerify extends ConsumerStatefulWidget {
  final VoidCallback onVerified;

  const VideoPreCallVerify({
    super.key,
    required this.onVerified,
  });

  @override
  ConsumerState<VideoPreCallVerify> createState() => _VideoPreCallVerifyState();
}

class _VideoPreCallVerifyState extends ConsumerState<VideoPreCallVerify> {
  bool _isVerifying = false;
  bool _isVerified = false;
  String? _verificationError;

  Future<void> _verifyIdentity() async {
    setState(() {
      _isVerifying = true;
      _verificationError = null;
    });

    try {
      await Future.delayed(const Duration(seconds: 2));
      setState(() {
        _isVerified = true;
        _isVerifying = false;
      });
      widget.onVerified();
    } on Exception catch (e) {
      setState(() {
        _verificationError = 'Verification failed. Please try again.';
        _isVerifying = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Identity Verification', style: theme.textTheme.titleLarge, textAlign: TextAlign.center),
          const SizedBox(height: 8),
          Text(
            'Verify your identity before joining the video call',
            style: theme.textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          if (!_isVerified)
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(60),
                border: Border.all(color: AppColors.divider, width: 2),
              ),
              child: _isVerifying
                  ? const LoadingSpinner(size: 40)
                  : Icon(Icons.face_outlined, size: 60, color: AppColors.textSecondary.withOpacity(0.5)),
            ),
          if (_isVerified)
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: AppColors.success.withOpacity(0.1),
                borderRadius: BorderRadius.circular(60),
                border: Border.all(color: AppColors.success, width: 2),
              ),
              child: const Icon(Icons.check, size: 60, color: AppColors.success),
            ),
          const SizedBox(height: 24),
          if (_verificationError != null)
            Text(
              _verificationError!,
              style: const TextStyle(color: AppColors.error),
              textAlign: TextAlign.center,
            ),
          const SizedBox(height: 16),
          AppButton(
            text: _isVerified ? 'Verified' : (_isVerifying ? 'Verifying...' : 'Verify Identity'),
            onPressed: _isVerifying || _isVerified ? null : _verifyIdentity,
            isLoading: _isVerifying,
          ),
        ],
      ),
    );
  }
}
