import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  String _resetMethod = 'email';
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _handleReset() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      if (_resetMethod == 'email') {
        await ref.read(authProvider.notifier).resetPassword(
          email: _emailController.text.trim(),
          newPassword: 'temp_password_123',
        );
        if (mounted) {
          AppToast.success(context, 'Password reset link sent to your email');
        }
      } else {
        await ref.read(authProvider.notifier).verifyOtp(
          phoneNumber: _phoneController.text.trim(),
          code: '123456',
        );
        if (mounted) {
          context.push('/verify-otp?phone=${Uri.encodeComponent(_phoneController.text.trim())}');
        }
      }
    } catch (e) {
      if (mounted) {
        AppToast.error(context, e.toString().replaceAll('Exception: ', ''));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reset Password'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Forgot Password?',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  _resetMethod == 'email'
                      ? 'Enter your email to receive a reset link'
                      : 'Enter your phone number to receive an OTP',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(
                      value: 'email',
                      label: Text('Email'),
                      icon: Icon(Icons.email_outlined),
                    ),
                    ButtonSegment(
                      value: 'phone',
                      label: Text('Phone'),
                      icon: Icon(Icons.phone_outlined),
                    ),
                  ],
                  selected: {_resetMethod},
                  onSelectionChanged: (Set<String> selection) {
                    setState(() => _resetMethod = selection.first);
                  },
                ),
                const SizedBox(height: 24),
                if (_resetMethod == 'email') ...[
                  AppInput(
                    controller: _emailController,
                    hintText: 'Email address',
                    keyboardType: TextInputType.emailAddress,
                    textInputAction: TextInputAction.done,
                    prefixIcon: const Icon(Icons.email_outlined),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your email';
                      }
                      if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),
                ] else ...[
                  AppInput(
                    controller: _phoneController,
                    hintText: 'Phone number',
                    keyboardType: TextInputType.phone,
                    textInputAction: TextInputAction.done,
                    prefixIcon: const Icon(Icons.phone_outlined),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your phone number';
                      }
                      return null;
                    },
                  ),
                ],
                const SizedBox(height: 24),
                AppButton(
                  text: _resetMethod == 'email' ? 'Send Reset Link' : 'Send OTP',
                  onPressed: _isLoading ? null : _handleReset,
                  isLoading: _isLoading,
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => context.pop(),
                  child: const Text('Back to Sign In'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}