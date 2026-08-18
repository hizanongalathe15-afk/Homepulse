import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../widgets/app_toast.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final List<String> _tabs = ['All', 'Saved', 'Viewed', 'Shared', 'Messaged', 'Liked'];

  final List<_HistoryEntry> _entries = [
    _HistoryEntry(
      icon: LucideIcons.eye,
      label: 'Viewed 3 bedroom apartment in Westlands',
      time: DateTime.now().subtract(const Duration(hours: 2)),
      category: 'Viewed',
    ),
    _HistoryEntry(
      icon: LucideIcons.heart,
      label: 'Saved apartment near CBD',
      time: DateTime.now().subtract(const Duration(hours: 5)),
      category: 'Saved',
    ),
    _HistoryEntry(
      icon: LucideIcons.share_2,
      label: 'Shared property listing',
      time: DateTime.now().subtract(const Duration(days: 1)),
      category: 'Shared',
    ),
    _HistoryEntry(
      icon: LucideIcons.message_circle,
      label: 'Messaged property manager',
      time: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
      category: 'Messaged',
    ),
    _HistoryEntry(
      icon: LucideIcons.heart,
      label: 'Liked a review',
      time: DateTime.now().subtract(const Duration(days: 2)),
      category: 'Liked',
    ),
    _HistoryEntry(
      icon: LucideIcons.eye,
      label: 'Viewed modern studio in Kilimani',
      time: DateTime.now().subtract(const Duration(days: 3)),
      category: 'Viewed',
    ),
    _HistoryEntry(
      icon: LucideIcons.heart,
      label: 'Saved commercial space',
      time: DateTime.now().subtract(const Duration(days: 5)),
      category: 'Saved',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Activity History'),
        actions: [
          IconButton(
            onPressed: _showExportDialog,
            icon: Icon(LucideIcons.download),
            tooltip: 'Export',
          ),
          IconButton(
            onPressed: _showClearDialog,
            icon: Icon(LucideIcons.trash_2),
            tooltip: 'Clear History',
          ),
        ],
      ),
      body: Column(
        children: [
          TabBar(
            controller: _tabController,
            tabs: _tabs.map((t) => Tab(text: t)).toList(),
            isScrollable: true,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textSecondary,
            indicatorColor: AppColors.primary,
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: _tabs.map((tab) {
                final filtered = tab == 'All'
                    ? _entries
                    : _entries.where((e) => e.category == tab).toList();
                if (filtered.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.clock, size: 64, color: AppColors.textTertiary),
                        const SizedBox(height: 16),
                        Text('No activity yet', style: theme.textTheme.titleMedium),
                      ],
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final entry = filtered[index];
                    return _HistoryTile(entry: entry);
                  },
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  void _showClearDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear History'),
        content: const Text('Are you sure you want to clear all activity history?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              setState(() => _entries.clear());
              Navigator.pop(ctx);
              AppToast.show(context, 'History cleared');
            },
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  void _showExportDialog() {
    AppToast.show(context, 'History exported');
  }
}

class _HistoryEntry {
  final IconData icon;
  final String label;
  final DateTime time;
  final String category;

  _HistoryEntry({
    required this.icon,
    required this.label,
    required this.time,
    required this.category,
  });
}

class _HistoryTile extends StatelessWidget {
  final _HistoryEntry entry;

  const _HistoryTile({required this.entry});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: AppTheme.borderRadiusLg,
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(entry.icon, color: AppColors.primary, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(entry.label, style: theme.textTheme.bodyMedium),
                const SizedBox(height: 4),
                Text(
                  _formatTime(entry.time),
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${time.day}/${time.month}/${time.year}';
  }
}
