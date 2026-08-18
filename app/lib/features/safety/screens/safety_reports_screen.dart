import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/state/auth_provider.dart';
import 'package:homepulse/services/safety_service.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_input.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_toast.dart';

class SafetyReportsScreen extends ConsumerStatefulWidget {
  const SafetyReportsScreen({super.key});

  @override
  ConsumerState<SafetyReportsScreen> createState() => _SafetyReportsScreenState();
}

class _SafetyReportsScreenState extends ConsumerState<SafetyReportsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _typeController = TextEditingController();
  final _descriptionController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _typeController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submitReport() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      await ref.read(safetyProvider.notifier).submitIncidentReport(
        neighborhoodId: 'current',
        type: _typeController.text.trim(),
        description: _descriptionController.text.trim(),
      );
      if (mounted) {
        AppToast.success(context, 'Safety report submitted');
        _typeController.clear();
        _descriptionController.clear();
      }
    } catch (e) {
      if (mounted) {
        AppToast.error(context, 'Failed to submit report');
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
        title: const Text('Safety Reports'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Report a Safety Incident', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 16),
                  AppInput(
                    controller: _typeController,
                    hintText: 'Incident type (e.g., theft, harassment)',
                    validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                  ),
                  const SizedBox(height: 12),
                  AppInput(
                    controller: _descriptionController,
                    hintText: 'Describe what happened',
                    maxLines: 4,
                    validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: AppButton(
                      text: 'Submit Report',
                      onPressed: _isLoading ? null : _submitReport,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text('Recent Reports', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 5,
              itemBuilder: (context, index) {
                return AppCard(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: const Icon(Icons.warning_amber_rounded, color: AppColors.warning),
                    title: Text('Incident report #${index + 1}'),
                    subtitle: Text('Reported ${DateTime.now().subtract(Duration(days: index)).toString().split(' ')[0]}'),
                    trailing: const Icon(Icons.chevron_right_rounded),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
