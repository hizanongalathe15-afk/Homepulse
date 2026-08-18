import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';
import 'package:homepulse/services/permission_service.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../widgets/app_toast.dart';

class VoiceCallScreen extends ConsumerStatefulWidget {
  const VoiceCallScreen({super.key});

  @override
  ConsumerState<VoiceCallScreen> createState() => _VoiceCallScreenState();
}

class _VoiceCallScreenState extends ConsumerState<VoiceCallScreen> {
  bool _isMuted = false;
  bool _isSpeakerOn = false;
  Timer? _callTimer;
  int _callDuration = 0;

  @override
  void initState() {
    super.initState();
    _requestMicrophonePermission();
    _startCallTimer();
  }

  Future<void> _requestMicrophonePermission() async {
    final granted = await PermissionService.request(PermissionType.microphone);
    if (!granted && mounted) {
      AppToast.error(context, 'Microphone permission is required for voice calls');
    }
  }

  @override
  void dispose() {
    _callTimer?.cancel();
    super.dispose();
  }

  void _startCallTimer() {
    _callTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() => _callDuration++);
    });
  }

  String _formatDuration(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [AppColors.primaryDark, AppColors.primary],
        ),
      ),
      child: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircleAvatar(
              radius: 60,
              backgroundColor: Colors.white24,
              child: CircleAvatar(
                radius: 56,
                backgroundColor: AppColors.surface,
                child: Icon(Icons.person, size: 80, color: AppColors.textSecondary),
              ),
            ),
            const SizedBox(height: 32),
            Text('Landlord', style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white)),
            const SizedBox(height: 8),
            Text(_formatDuration(_callDuration), style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Colors.white70)),
            const SizedBox(height: 48),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _CallControlButton(
                  icon: Icons.mic_off,
                  isActive: _isMuted,
                  onTap: () => setState(() => _isMuted = !_isMuted),
                ),
                const SizedBox(width: 32),
                _CallControlButton(
                  icon: Icons.volume_up,
                  isActive: _isSpeakerOn,
                  onTap: () => setState(() => _isSpeakerOn = !_isSpeakerOn),
                ),
                const SizedBox(width: 32),
                _CallControlButton(
                  icon: Icons.call_end,
                  isActive: false,
                  isEndCall: true,
                  onTap: () => Navigator.pop(context),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _CallControlButton extends StatelessWidget {
  final IconData icon;
  final bool isActive;
  final bool isEndCall;
  final VoidCallback onTap;

  const _CallControlButton({
    required this.icon,
    required this.isActive,
    this.isEndCall = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 64,
        height: 64,
        decoration: BoxDecoration(
          color: isEndCall ? AppColors.error : (isActive ? Colors.white : Colors.white24),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: isEndCall ? Colors.white : (isActive ? AppColors.primary : Colors.white), size: 28),
      ),
    );
  }
}
