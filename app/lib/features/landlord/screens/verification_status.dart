import 'package:flutter/material.dart';

class VerificationStatusScreen extends StatelessWidget {
  const VerificationStatusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Verification Status')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildStep(context, 1, 'Identity Verification', true, 'Verified', Colors.green),
          _buildStep(context, 2, 'Property Documents', true, 'Verified', Colors.green),
          _buildStep(context, 3, 'Payment Setup', true, 'Verified', Colors.green),
          _buildStep(context, 4, 'Final Review', false, 'Pending', Colors.orange),
        ],
      ),
    );
  }

  Widget _buildStep(BuildContext context, int step, String title, bool isCompleted, String status, Color statusColor) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: isCompleted ? Colors.green : Colors.orange,
          child: Icon(isCompleted ? Icons.check : Icons.hourglass_empty, color: Colors.white),
        ),
        title: Text(title),
        subtitle: Text(status, style: TextStyle(color: statusColor, fontWeight: FontWeight.w500)),
        trailing: isCompleted ? const Icon(Icons.lock_open, color: Colors.green) : const Icon(Icons.lock, color: Colors.grey),
      ),
    );
  }
}
