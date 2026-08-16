import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/roommate_profile.dart';
import '../../../../services/roommate_service.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/app_toast.dart';

class MatchChatButton extends ConsumerWidget {
  final String userId;
  final RoommateProfile profile;

  const MatchChatButton({
    super.key,
    required this.userId,
    required this.profile,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Row(
      children: [
        Expanded(
          child: AppButton(
            text: 'Start Chat',
            onPressed: () async {
              try {
                await ref.read(roommateProvider.notifier).startChat(profile.id, 'Hi! I saw your profile and wanted to connect.');
                if (context.mounted) {
                  context.push('/chat?roommateId=${profile.id}');
                }
              } on Exception catch (e) {
                AppToast.show(context, 'Could not start chat');
              }
            },
          ),
        ),
      ],
    );
  }
}
