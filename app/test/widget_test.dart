import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:homepulse/core/theme/app_theme.dart';
import 'package:homepulse/models/system_theme.dart';

void main() {
  testWidgets('App theme builds correctly', (WidgetTester tester) async {
    final config = SystemThemeConfig(colors: {});
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.generateLightTheme(config),
        home: const Scaffold(body: Center(child: Text('Homepulse'))),
      ),
    );

    expect(find.text('Homepulse'), findsOneWidget);
    expect(find.byType(Scaffold), findsOneWidget);
  });
}
