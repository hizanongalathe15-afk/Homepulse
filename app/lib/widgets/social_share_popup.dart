import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

class SocialSharePopup extends StatelessWidget {
  final String title;
  final String description;
  final String url;
  final String? imageUrl;
  final IconData icon;

  const SocialSharePopup({
    super.key,
    required this.title,
    required this.description,
    required this.url,
    this.imageUrl,
    this.icon = Icons.share_rounded,
  });

  void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _ShareBottomSheet(
        title: title,
        description: description,
        url: url,
        imageUrl: imageUrl,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(icon),
      onPressed: () => show(context),
    );
  }
}

class _ShareBottomSheet extends StatelessWidget {
  final String title;
  final String description;
  final String url;
  final String? imageUrl;

  const _ShareBottomSheet({
    required this.title,
    required this.description,
    required this.url,
    this.imageUrl,
  });

  Future<void> _shareToWhatsApp(BuildContext context) async {
    final text = '$title\n$description\n$url';
    final encoded = Uri.encodeComponent(text);
    final whatsappUrl = 'https://wa.me/?text=$encoded';
    final uri = Uri.parse(whatsappUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      await Share.share(text);
    }
    Navigator.pop(context);
  }

  Future<void> _shareToTwitter(BuildContext context) async {
    final text = '$title\n$description';
    final encoded = Uri.encodeComponent('$text $url');
    final twitterUrl = 'https://twitter.com/intent/tweet?text=$encoded';
    final uri = Uri.parse(twitterUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      await Share.share('$text\n$url');
    }
    Navigator.pop(context);
  }

  Future<void> _shareToFacebook(BuildContext context) async {
    final facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=$url';
    final uri = Uri.parse(facebookUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      await Share.share('$title\n$url');
    }
    Navigator.pop(context);
  }

  Future<void> _copyLink(BuildContext context) async {
    await Clipboard.setData(ClipboardData(text: url));
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Link copied to clipboard')),
    );
  }

  Future<void> _shareSystem(BuildContext context) async {
    await Share.share('$title\n$description\n$url');
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: theme.colorScheme.onSurface.withOpacity(0.1),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Text(
              'Share',
              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _ShareOption(
                icon: Icons.chat,
                label: 'WhatsApp',
                color: const Color(0xFF25D366),
                onTap: () => _shareToWhatsApp(context),
              ),
              _ShareOption(
                icon: Icons.trending_up,
                label: 'Twitter',
                color: const Color(0xFF1DA1F2),
                onTap: () => _shareToTwitter(context),
              ),
              _ShareOption(
                icon: Icons.favorite,
                label: 'Facebook',
                color: const Color(0xFF1877F2),
                onTap: () => _shareToFacebook(context),
              ),
              _ShareOption(
                icon: Icons.more_horiz,
                label: 'More',
                color: theme.colorScheme.onSurface.withOpacity(0.5),
                onTap: () => _shareSystem(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            width: double.infinity,
            height: 48,
            decoration: BoxDecoration(
              border: Border.all(color: theme.colorScheme.outline.withOpacity(0.3)),
              borderRadius: BorderRadius.circular(12),
            ),
            child: TextButton.icon(
              onPressed: () => _copyLink(context),
              icon: const Icon(Icons.copy_rounded),
              label: const Text('Copy Link'),
            ),
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}

class _ShareOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ShareOption({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
            border: Border.all(color: color.withOpacity(0.3)),
          ),
          child: IconButton(
            onPressed: onTap,
            icon: Icon(icon, color: color, size: 28),
            padding: EdgeInsets.zero,
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }
}
