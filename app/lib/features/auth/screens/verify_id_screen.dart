import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../services/id_verification_service.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_input.dart';
import '../../../../widgets/app_toast.dart';

import '../../../../services/permission_service.dart';

class VerifyIdScreen extends ConsumerStatefulWidget {
  const VerifyIdScreen({super.key});

  @override
  ConsumerState<VerifyIdScreen> createState() => _VerifyIdScreenState();
}

class _VerifyIdScreenState extends ConsumerState<VerifyIdScreen> {
  final _formKey = GlobalKey<FormState>();
  final _idNumberController = TextEditingController();
  final _fullNameController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  File? _idDocumentFront;
  File? _idDocumentBack;
  bool _isLoading = false;
  String _selectedDocType = 'national_id';

  final List<String> _docTypes = ['national_id', 'passport', 'drivers_license'];

  @override
  void dispose() {
    _idNumberController.dispose();
    _fullNameController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(bool isFront) async {
    final hasPermission = await PermissionService.request(PermissionType.camera);
    if (!hasPermission) {
      if (mounted) {
        AppToast.error(context, 'Camera permission is required to capture ID');
      }
      return;
    }
    final XFile? image = await _picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 80,
    );
    if (image != null) {
      setState(() {
        if (isFront) {
          _idDocumentFront = File(image.path);
        } else {
          _idDocumentBack = File(image.path);
        }
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_idDocumentFront == null) {
      AppToast.error(context, 'Please upload your ID document front side');
      return;
    }
    setState(() => _isLoading = true);
    try {
      await ref.read(idVerificationProvider.notifier).submitVerification(
        idNumber: _idNumberController.text.trim(),
        fullName: _fullNameController.text.trim(),
        documentType: _selectedDocType,
        frontImage: _idDocumentFront!,
        backImage: _idDocumentBack,
      );
      if (mounted) {
        AppToast.success(context, 'ID submitted for verification');
        context.pop();
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
        title: const Text('Verify ID'),
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
                  'Identity Verification',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Upload your ID document to verify your identity',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                DropdownButtonFormField<String>(
                  value: _selectedDocType,
                  decoration: InputDecoration(
                    hintText: 'Document type',
                    prefixIcon: const Icon(Icons.badge_outlined),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  items: _docTypes.map((type) {
                    return DropdownMenuItem(
                      value: type,
                      child: Text(type.replaceAll('_', ' ').toUpperCase()),
                    );
                  }).toList(),
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedDocType = value);
                    }
                  },
                ),
                const SizedBox(height: 16),
                AppInput(
                  controller: _idNumberController,
                  hintText: 'ID number',
                  textInputAction: TextInputAction.next,
                  prefixIcon: const Icon(Icons.numbers),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your ID number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                AppInput(
                  controller: _fullNameController,
                  hintText: 'Full name as on ID',
                  textInputAction: TextInputAction.done,
                  prefixIcon: const Icon(Icons.person_outline),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your full name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                Text(
                  'Upload ID Document',
                  style: theme.textTheme.titleMedium,
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildUploadCard(
                        title: 'Front Side',
                        image: _idDocumentFront,
                        onTap: () => _pickImage(true),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildUploadCard(
                        title: 'Back Side',
                        image: _idDocumentBack,
                        onTap: () => _pickImage(false),
                        optional: true,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                AppButton(
                  text: 'Submit for Verification',
                  onPressed: _isLoading ? null : _handleSubmit,
                  isLoading: _isLoading,
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.info.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.info_outline, color: AppColors.info, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Your document will be securely stored and verified within 24-48 hours.',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUploadCard({
    required String title,
    required File? image,
    required VoidCallback onTap,
    bool optional = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AppCard(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            if (image != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.file(
                  image,
                  height: 100,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              )
            else
              Container(
                height: 100,
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.divider, style: BorderStyle.solid),
                ),
                child: Icon(
                  Icons.camera_alt_outlined,
                  size: 32,
                  color: AppColors.textSecondary,
                ),
              ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
            if (optional)
              Text(
                'Optional',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
          ],
        ),
      ),
    );
  }
}