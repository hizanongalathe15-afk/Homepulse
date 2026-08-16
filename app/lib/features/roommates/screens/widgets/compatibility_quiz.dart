import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../widgets/app_button.dart';

class CompatibilityQuiz extends ConsumerStatefulWidget {
  const CompatibilityQuiz({super.key});

  @override
  ConsumerState<CompatibilityQuiz> createState() => _CompatibilityQuizState();
}

class _CompatibilityQuizState extends ConsumerState<CompatibilityQuiz> {
  int _currentQuestion = 0;
  final Map<int, String> _answers = {};
  bool _isComplete = false;

  final List<Map<String, dynamic>> _questions = [
    {
      'question': 'What is your preferred cleaning schedule?',
      'options': ['Daily', 'Weekly', 'Bi-weekly', 'Whenever needed'],
    },
    {
      'question': 'How do you feel about guests?',
      'options': ['Love having guests', 'Occasional guests', 'Rare guests', 'No guests'],
    },
    {
      'question': 'What is your sleep schedule?',
      'options': ['Early bird', 'Night owl', 'Flexible', 'Depends on work'],
    },
    {
      'question': 'How do you handle noise?',
      'options': ['Very quiet', 'Moderate noise', 'Background noise is fine', 'Loud is okay'],
    },
  ];

  void _answer(String answer) {
    setState(() {
      _answers[_currentQuestion] = answer;
      if (_currentQuestion < _questions.length - 1) {
        _currentQuestion++;
      } else {
        _isComplete = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isComplete) {
      return Column(
        children: [
          const Icon(Icons.check_circle, size: 48, color: AppColors.success),
          const SizedBox(height: 16),
          Text('Quiz Complete', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Text('${_answers.length} answers recorded', style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
        ],
      );
    }

    final question = _questions[_currentQuestion];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        LinearProgressIndicator(
          value: (_currentQuestion + 1) / _questions.length,
          backgroundColor: AppColors.divider,
          valueColor: const AlwaysStoppedAnimation(AppColors.primary),
        ),
        const SizedBox(height: 16),
        Text(
          '${_currentQuestion + 1}. ${question['question']}',
          style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 16),
        ...(question['options'] as List<String>).map((option) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: OutlinedButton(
              onPressed: () => _answer(option),
              style: OutlinedButton.styleFrom(
                alignment: Alignment.centerLeft,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
              child: Text(option),
            ),
          );
        }).toList(),
      ],
    );
  }
}
