import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';

class SocialShare extends StatelessWidget {
  final String? text;
  final String? url;
  final String? subject;
  final List<String>? filePaths;
  final String? semanticLabel;
  final VoidCallback? onShareComplete;

  SocialShare({
    super.key,
    this.text,
    this.url,
    this.subject,
    this.filePaths,
    this.semanticLabel,
    this.onShareComplete,
  }) : assert(text != null || url != null || (filePaths != null && filePaths.isNotEmpty));

  static Future<void> share({
    String? text,
    String? url,
    String? subject,
    List<String>? filePaths,
  }) async {
    final shareText = [text, url].whereType<String>().join('\n');
    final result = await Share.share(
      shareText.isNotEmpty ? shareText : '',
      subject: subject,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Semantics(
      label: semanticLabel ?? 'Share',
      button: true,
      child: InkWell(
        onTap: () async {
          await share(text: text, url: url, subject: subject, filePaths: filePaths);
          onShareComplete?.call();
        },
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: colorScheme.primaryContainer,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.share_rounded, color: colorScheme.onPrimaryContainer, size: 20),
              const SizedBox(width: 8),
              Text(
                'Share',
                style: TextStyle(color: colorScheme.onPrimaryContainer, fontSize: 14, fontWeight: FontWeight.w500),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
