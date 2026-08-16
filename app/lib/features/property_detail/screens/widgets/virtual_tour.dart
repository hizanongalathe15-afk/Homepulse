import 'package:flutter/material.dart';
import 'package:homepulse/core/theme/app_colors.dart';
import 'package:homepulse/widgets/app_card.dart';
import 'package:homepulse/widgets/app_button.dart';
import 'package:homepulse/widgets/loading_spinner.dart';

class VirtualTourWidget extends StatelessWidget {
  final String propertyId;
  final List<Map<String, dynamic>>? tours;
  final bool isLoading;
  final VoidCallback? onRequestTour;
  final ValueChanged<Map<String, dynamic>>? onTourTap;

  const VirtualTourWidget({
    super.key,
    required this.propertyId,
    this.tours,
    this.isLoading = false,
    this.onRequestTour,
    this.onTourTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Virtual Tour', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        if (isLoading)
          const AppCard(
            padding: EdgeInsets.all(40),
            child: Center(child: LoadingSpinner()),
          )
        else if (tours == null || tours!.isEmpty)
          AppCard(
            padding: const EdgeInsets.all(40),
            child: Center(
              child: Column(
                children: [
                  Icon(Icons.video_call_outlined, size: 48, color: AppColors.textSecondary),
                  const SizedBox(height: 8),
                  Text('No virtual tour available', style: TextStyle(color: AppColors.textSecondary)),
                  if (onRequestTour != null) ...[
                    const SizedBox(height: 12),
                    AppButton(
                      text: 'Request Tour',
                      isOutlined: true,
                      onPressed: onRequestTour,
                    ),
                  ],
                ],
              ),
            ),
          )
        else
          SizedBox(
            height: 220,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: tours!.length,
              itemBuilder: (context, index) {
                final item = tours![index];
                return GestureDetector(
                  onTap: () => onTourTap?.call(item),
                  child: Container(
                    width: 300,
                    margin: EdgeInsets.only(right: index < tours!.length - 1 ? 12 : 0),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: DecorationImage(
                        image: NetworkImage(item['thumbnail'] ?? 'https://via.placeholder.com/300x200'),
                        fit: BoxFit.cover,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [Colors.black.withOpacity(0.6), Colors.transparent],
                        ),
                      ),
                      child: Center(
                        child: Icon(Icons.play_circle_outline, size: 48, color: Colors.white.withOpacity(0.9)),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
      ],
    );
  }
}
