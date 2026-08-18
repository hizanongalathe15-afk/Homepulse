import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/haptic_utils.dart';

class ActionBottomSheet extends StatelessWidget {
  final String title;
  final List<ActionItem> actions;

  const ActionBottomSheet({
    super.key,
    required this.title,
    required this.actions,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        top: 24,
        left: 24,
        right: 24,
      ),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.textTertiary,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 20),
          Text(title, style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 16),
          ...actions.map((action) => ListTile(
            leading: Icon(action.icon, color: AppColors.primary),
            title: Text(action.title),
            subtitle: action.subtitle != null ? Text(action.subtitle!) : null,
            onTap: () {
              HapticUtils.selectionClick();
              Navigator.pop(context);
              action.onTap();
            },
          )),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class ActionItem {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback onTap;

  ActionItem({required this.icon, required this.title, this.subtitle, required this.onTap});
}
