import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/models/user.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/user_avatar.dart';
import 'package:homepulse/widgets/rating_stars.dart';
import 'package:homepulse/widgets/verified_badge.dart';

class LandlordProfile extends ConsumerWidget {
  final String landlordId;

  const LandlordProfile({
    super.key,
    required this.landlordId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final landlordAsync = ref.watch(landlordProfileProvider(landlordId));

    return landlordAsync.when(
      loading: () => const AppCard(
        padding: EdgeInsets.all(40),
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (error, _) => AppCard(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            UserAvatar(imageUrl: '', radius: 24),
            const SizedBox(width: 12),
            Expanded(child: Text('Landlord', style: TextStyle(color: AppColors.textSecondary))),
          ],
        ),
      ),
      data: (landlord) {
        return AppCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              UserAvatar(imageUrl: landlord.avatarUrl, radius: 28),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            landlord.name,
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (landlord.isVerified) ...[
                          const SizedBox(width: 6),
                          const VerifiedBadge(size: 16),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        RatingStars(rating: 4.5, size: 14),
                        const SizedBox(width: 6),
                        Text('4.5 (12 reviews)', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('Responds within 2 hours', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              AppButton(
                text: 'Contact',
                width: 100,
                onPressed: () {},
              ),
            ],
          ),
        );
      },
    );
  }
}

final landlordProfileProvider = FutureProvider.family<User, String>((ref, landlordId) async {
  await Future.delayed(const Duration(milliseconds: 200));
  return User(
    id: landlordId,
    name: 'Jane Mwangi',
    email: 'jane@example.com',
    phone: '+254 700 000 000',
    avatarUrl: 'https://via.placeholder.com/100',
    role: 'landlord',
    isVerified: true,
    createdAt: DateTime.now().subtract(const Duration(days: 365)),
  );
});
