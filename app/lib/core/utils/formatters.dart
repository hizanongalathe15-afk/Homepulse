import 'package:intl/intl.dart';

String formatCurrency(double amount) {
  final fmt = NumberFormat.currency(symbol: 'KES ', decimalDigits: 0);
  return fmt.format(amount);
}

String formatDate(DateTime date) {
  final fmt = DateFormat('MMM dd, yyyy');
  return fmt.format(date);
}

String formatTimeAgo(DateTime dateTime) {
  final now = DateTime.now();
  final diff = now.difference(dateTime);

  if (diff.inSeconds < 60) return 'Just now';
  if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
  if (diff.inHours < 24) return '${diff.inHours}h ago';
  if (diff.inDays < 7) return '${diff.inDays}d ago';
  return formatDate(dateTime);
}
