import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/user.dart';
import '../../../../state/auth_provider.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_toast.dart';
import '../../../../widgets/user_avatar.dart';

class PeopleYouMayKnow extends ConsumerStatefulWidget {
  const PeopleYouMayKnow({super.key});

  @override
  ConsumerState<PeopleYouMayKnow> createState() => _PeopleYouMayKnowState();
}

class _PeopleYouMayKnowState extends ConsumerState<PeopleYouMayKnow> {
  static List<Map<String, dynamic>> _suggestions = [
    {'id': 'u1', 'name': 'Grace Wambui', 'role': 'landlord', 'mutualFriends': 5, 'avatarUrl': ''},
    {'id': 'u2', 'name': 'David Ochieng', 'role': 'tenant', 'mutualFriends': 3, 'avatarUrl': ''},
    {'id': 'u3', 'name': 'Mary Atieno', 'role': 'tenant', 'mutualFriends': 8, 'avatarUrl': ''},
    {'id': 'u4', 'name': 'Peter Kamau', 'role': 'landlord', 'mutualFriends': 2, 'avatarUrl': ''},
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('People You May Know', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
              TextButton(
                onPressed: () {
                  AppToast.info(context, 'See all suggestions');
                },
                child: const Text('See All'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ..._suggestions.map((suggestion) {
            final user = User(
              id: suggestion['id'] as String,
              name: suggestion['name'] as String,
              email: '',
              phone: '',
              avatarUrl: suggestion['avatarUrl'] as String? ?? '',
              role: suggestion['role'] as String? ?? 'tenant',
              createdAt: DateTime.now(),
            );
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  UserAvatar(
                    imageUrl: user.avatarUrl,
                    fullName: user.name,
                    size: 40,
                    backgroundColor: AppColors.primary,
                    textColor: Colors.white,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user.name, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600)),
                        Text(
                          '${suggestion['mutualFriends']} mutual connections',
                          style: theme.textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _suggestions.remove(suggestion);
                      });
                      AppToast.success(context, 'Friend request sent');
                    },
                    child: const Text('Add'),
                  ),
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}
