import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../state/landlord_provider.dart';
import '../../../../state/auth_provider.dart';
import '../../../../models/property.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';
import '../../../../widgets/verified_badge.dart';
import '../../../../widgets/rating_stars.dart';
import '../../../../core/utils/formatters.dart';

class PropertyManager extends ConsumerWidget {
  const PropertyManager({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final landlordId = authState.value?.id ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Properties'),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const AddPropertyScreen()));
            },
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: FutureBuilder<List<Property>>(
        future: ref.read(propertyServiceProvider).getLandlordProperties(landlordId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final properties = snapshot.data ?? [];
          if (properties.isEmpty) {
            return const Center(child: Text('No properties found'));
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: properties.length,
            itemBuilder: (context, index) {
              final property = properties[index];
              return AppCard(
                margin: const EdgeInsets.only(bottom: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 160,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        image: DecorationImage(
                          image: NetworkImage(property.imageUrls.first),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  property.title,
                                  style: const TextStyle(fontWeight: FontWeight.w600),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              if (property.isVerified) const SizedBox(width: 4, child: VerifiedBadge(size: 14)),
                            ],
                          ),
                        ),
                        Text(formatCurrency(property.price), style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.green)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(property.location, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        RatingStars(rating: property.rating, size: 12),
                        const SizedBox(width: 8),
                        Text('(${property.reviewCount})', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (_) => AddPropertyScreen(property: property)));
                          },
                          child: const Text('Edit'),
                        ),
                        TextButton(
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: const Text('Delete Property'),
                                content: const Text('Are you sure?'),
                                actions: [
                                  TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                                  TextButton(
                                    onPressed: () {
                                      ref.read(propertyServiceProvider).deleteProperty(property.id);
                                      AppToast.show(context, 'Property deleted');
                                      Navigator.pop(context);
                                    },
                                    child: const Text('Delete', style: TextStyle(color: Colors.red)),
                                  ),
                                ],
                              ),
                            );
                          },
                          child: const Text('Delete', style: TextStyle(color: Colors.red)),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
