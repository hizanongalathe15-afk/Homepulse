class AnalyticsSnapshot {
  final String id;
  final int views;
  final int inquiries;
  final int saves;
  final int shares;
  final int tours;
  final DateTime date;

  AnalyticsSnapshot({
    required this.id,
    this.views = 0,
    this.inquiries = 0,
    this.saves = 0,
    this.shares = 0,
    this.tours = 0,
    required this.date,
  });
}
