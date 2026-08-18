import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/app_input.dart';
import 'package:homepulse/widgets/app_toast.dart';

class QnaSectionWidget extends StatefulWidget {
  final List<Map<String, dynamic>> items;
  final VoidCallback? onAskQuestion;
  final ValueChanged<String>? onPostQuestion;

  const QnaSectionWidget({
    super.key,
    required this.items,
    this.onAskQuestion,
    this.onPostQuestion,
  });

  @override
  State<QnaSectionWidget> createState() => _QnaSectionWidgetState();
}

class _QnaSectionWidgetState extends State<QnaSectionWidget> {
  final _questionController = TextEditingController();
  bool _showForm = false;

  @override
  void dispose() {
    _questionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Questions & Answers', style: Theme.of(context).textTheme.titleMedium),
            TextButton.icon(
              onPressed: () => setState(() => _showForm = !_showForm),
              icon: Icon(_showForm ? LucideIcons.x : LucideIcons.plus, size: 16),
              label: Text(_showForm ? 'Cancel' : 'Ask'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (_showForm) ...[
          AppCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppInput(
                  label: 'Your Question',
                  hintText: 'Ask about this property...',
                  controller: _questionController,
                  isMultiline: true,
                ),
                const SizedBox(height: 12),
                AppButton(
                  text: 'Post Question',
                  onPressed: _postQuestion,
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
        ],
        if (widget.items.isEmpty)
          AppCard(
            padding: const EdgeInsets.all(24),
            child: Center(
              child: Text('No questions yet. Be the first to ask!',
                  style: TextStyle(color: AppColors.textSecondary)),
            ),
          )
        else
          Column(
            children: widget.items.map((item) {
              return AppCard(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(LucideIcons.user, size: 16, color: AppColors.primary),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            item['question'] ?? '',
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    if (item['answer'] != null)
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(LucideIcons.user, size: 14, color: AppColors.textSecondary),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(item['answer'],
                                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              );
            }).toList(),
          ),
      ],
    );
  }

  Future<void> _postQuestion() async {
    final question = _questionController.text.trim();
    if (question.isEmpty) {
      AppToast.error(context, 'Please enter a question');
      return;
    }
    _questionController.clear();
    setState(() => _showForm = false);
    widget.onPostQuestion?.call(question);
    if (mounted) {
      AppToast.success(context, 'Question posted');
    }
  }
}
