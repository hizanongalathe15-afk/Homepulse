import 'package:flutter/material.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_skeleton.dart';

class VideoSkeleton extends StatelessWidget {
  final int itemCount;

  const VideoSkeleton({
    super.key,
    this.itemCount = 3,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: itemCount,
      itemBuilder: (context, index) {
        return Padding(
          padding: EdgeInsets.only(bottom: index < itemCount - 1 ? 16 : 0),
          child: AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppSkeleton(
                  width: double.infinity,
                  height: 200,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: AppSkeleton(
                              width: double.infinity,
                              height: 20,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                          const SizedBox(width: 8),
                          AppSkeleton(
                            width: 16,
                            height: 16,
                            borderRadius: BorderRadius.circular(8),
                            isCircle: true,
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      AppSkeleton(
                        width: 120,
                        height: 16,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          AppSkeleton(
                            width: 80,
                            height: 24,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          const Spacer(),
                          AppSkeleton(
                            width: 60,
                            height: 16,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          AppSkeleton(
                            width: 100,
                            height: 16,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          const SizedBox(width: 8),
                          AppSkeleton(
                            width: 60,
                            height: 16,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
