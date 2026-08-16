import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../models/maintenance_request.dart';
import '../../../../widgets/app_card.dart';
import '../../../../widgets/app_button.dart';

class TenantRequestsScreen extends ConsumerWidget {
  const TenantRequestsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tenant Requests'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSectionHeader(context, 'Maintenance Requests', Icons.build_rounded),
          const SizedBox(height: 12),
          _MaintenanceRequestList(),
          const SizedBox(height: 24),
          _buildSectionHeader(context, 'Lease Requests', Icons.description_rounded),
          const SizedBox(height: 12),
          _LeaseRequestList(),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title, IconData icon) {
    final theme = Theme.of(context);

    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.primary),
        const SizedBox(width: 8),
        Text(
          title,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

class _MaintenanceRequestList extends StatelessWidget {
  final List<MaintenanceRequest> _requests = [
    MaintenanceRequest(
      id: 'req_1',
      propertyId: 'prop_1',
      userId: 'tenant_1',
      title: 'Leaking faucet in bathroom',
      description: 'The faucet in the master bathroom has been leaking for 2 days.',
      priority: 'high',
      status: 'pending',
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
    MaintenanceRequest(
      id: 'req_2',
      propertyId: 'prop_2',
      userId: 'tenant_2',
      title: 'Electricity outage',
      description: 'Power went out in the kitchen area.',
      priority: 'medium',
      status: 'in_progress',
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    ),
    MaintenanceRequest(
      id: 'req_3',
      propertyId: 'prop_1',
      userId: 'tenant_3',
      title: 'Broken window lock',
      description: 'The window lock on the bedroom window is broken.',
      priority: 'low',
      status: 'resolved',
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
      resolvedAt: DateTime.now().subtract(const Duration(days: 8)),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    if (_requests.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            'No maintenance requests',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ),
      );
    }

    return Column(
      children: _requests.map((request) => _MaintenanceRequestTile(
        request: request,
        onStatusChange: (status) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Request marked as $status')),
          );
        },
      )).toList(),
    );
  }
}

class _MaintenanceRequestTile extends StatelessWidget {
  final MaintenanceRequest request;
  final Function(String)? onStatusChange;

  const _MaintenanceRequestTile({
    required this.request,
    this.onStatusChange,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    request.title,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                _PriorityBadge(priority: request.priority),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              request.description,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  formatDate(request.createdAt),
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                _StatusChip(status: request.status),
              ],
            ),
            if (request.status == 'pending') ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Accept',
                      onPressed: () => onStatusChange?.call('in_progress'),
                      isOutlined: true,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppButton(
                      text: 'Decline',
                      onPressed: () => onStatusChange?.call('declined'),
                      backgroundColor: AppColors.error,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _PriorityBadge extends StatelessWidget {
  final String priority;

  const _PriorityBadge({required this.priority});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = _getPriorityColor(priority);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        priority.toUpperCase(),
        style: theme.textTheme.labelSmall?.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return AppColors.error;
      case 'medium':
        return AppColors.warning;
      case 'low':
        return AppColors.success;
      default:
        return AppColors.textSecondary;
    }
  }
}

class _StatusChip extends StatelessWidget {
  final String status;

  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = _getStatusColor(status);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status.replaceAll('_', ' ').toUpperCase(),
        style: theme.textTheme.labelSmall?.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return AppColors.warning;
      case 'in_progress':
        return AppColors.info;
      case 'resolved':
      case 'accepted':
        return AppColors.success;
      case 'declined':
      case 'rejected':
        return AppColors.error;
      default:
        return AppColors.textSecondary;
    }
  }
}

class _LeaseRequestList extends StatelessWidget {
  final List<Map<String, dynamic>> _requests = [
    {
      'id': 'lease_1',
      'tenantName': 'John Doe',
      'propertyTitle': 'Modern 2 Bedroom Apartment',
      'status': 'pending',
      'requestedAt': DateTime.now().subtract(const Duration(days: 1)),
    },
    {
      'id': 'lease_2',
      'tenantName': 'Jane Smith',
      'propertyTitle': 'Luxury Studio',
      'status': 'approved',
      'requestedAt': DateTime.now().subtract(const Duration(days: 3)),
    },
  ];

  @override
  Widget build(BuildContext context) {
    if (_requests.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            'No lease requests',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ),
      );
    }

    return Column(
      children: _requests.map((request) => _LeaseRequestTile(
        id: request['id'] as String,
        tenantName: request['tenantName'] as String,
        propertyTitle: request['propertyTitle'] as String,
        status: request['status'] as String,
        requestedAt: request['requestedAt'] as DateTime,
      )).toList(),
    );
  }
}

class _LeaseRequestTile extends StatelessWidget {
  final String id;
  final String tenantName;
  final String propertyTitle;
  final String status;
  final DateTime requestedAt;

  const _LeaseRequestTile({
    required this.id,
    required this.tenantName,
    required this.propertyTitle,
    required this.status,
    required this.requestedAt,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AppCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: Text(
                    tenantName.isNotEmpty ? tenantName[0].toUpperCase() : '?',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        tenantName,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        propertyTitle,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                _StatusChip(status: status),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Requested ${formatDate(requestedAt)}',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            if (status == 'pending') ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Approve',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Lease approved')),
                        );
                      },
                      isOutlined: true,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppButton(
                      text: 'Reject',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Lease rejected')),
                        );
                      },
                      backgroundColor: AppColors.error,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
