import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/theme/app_theme.dart';

class ProfileCardWidget extends StatelessWidget {
  final String userId;
  final String userName;
  final String? userBio;
  final String? profileImageUrl;
  final String customMessage;
  final Color backgroundColor;
  final Color textColor;

  const ProfileCardWidget({
    super.key,
    required this.userId,
    required this.userName,
    this.userBio,
    this.profileImageUrl,
    this.customMessage = 'Scan to connect on HomePulse',
    this.backgroundColor = const Color(0xFF1A5276),
    this.textColor = Colors.white,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [backgroundColor, backgroundColor.withOpacity(0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: AppTheme.borderRadiusXl,
        boxShadow: [
          BoxShadow(
            color: backgroundColor.withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            top: -30,
            right: -30,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.1),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 3),
                    image: profileImageUrl != null
                        ? DecorationImage(image: NetworkImage(profileImageUrl!), fit: BoxFit.cover)
                        : null,
                    color: Colors.white.withOpacity(0.2),
                  ),
                  child: profileImageUrl == null
                      ? Icon(Icons.person, size: 40, color: Colors.white)
                      : null,
                ),
                const SizedBox(height: 16),
                Text(
                  userName,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                if (userBio != null && userBio!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    userBio!,
                    style: TextStyle(color: textColor.withOpacity(0.8), fontSize: 14),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'HomePulse',
                    style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: QrImageView(
                    data: 'https://homepulse.app/profile/$userId',
                    version: QrVersions.auto,
                    size: 160,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  customMessage,
                  style: TextStyle(color: textColor.withOpacity(0.8), fontSize: 12),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton.icon(
                      onPressed: () {
                        Share.share('Check out $userName on HomePulse: https://homepulse.app/profile/$userId');
                      },
                      icon: Icon(Icons.share, size: 18),
                      label: Text('Share Profile'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: backgroundColor,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
