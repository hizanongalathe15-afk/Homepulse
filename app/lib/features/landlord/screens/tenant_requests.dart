import 'package:flutter/material.dart';

class TenantRequestsScreen extends StatelessWidget {
  const TenantRequestsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tenant Requests')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 4,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(child: Icon(Icons.person)),
              title: Text('Tenant Request ${index + 1}'),
              subtitle: Text('Property ${index + 1} - Nairobi'),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.check_circle, color: Colors.green),
                    tooltip: 'Approve',
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.cancel, color: Colors.red),
                    tooltip: 'Decline',
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
