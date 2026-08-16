import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../models/chat_message.dart';
import '../../../../widgets/app_input.dart';
import 'typing_indicator.dart';

class ChatWindow extends ConsumerStatefulWidget {
  final List<ChatMessage> messages;
  final ScrollController controller;
  final Future<void> Function() onSend;
  final TextEditingController messageController;

  const ChatWindow({
    super.key,
    required this.messages,
    required this.controller,
    required this.onSend,
    required this.messageController,
  });

  @override
  ConsumerState<ChatWindow> createState() => _ChatWindowState();
}

class _ChatWindowState extends ConsumerState<ChatWindow> {
  bool _isTyping = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            controller: widget.controller,
            padding: const EdgeInsets.all(16),
            itemCount: widget.messages.length + 1,
            itemBuilder: (context, index) {
              if (index >= widget.messages.length) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: TypingIndicator(),
                );
              }
              final message = widget.messages[index];
              final isMe = message.senderId == 'me';
              return Align(
                alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: isMe ? AppColors.primary : AppColors.background,
                    borderRadius: BorderRadius.circular(16).copyWith(
                      bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(16),
                      bottomLeft: isMe ? const Radius.circular(16) : const Radius.circular(4),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        message.text,
                        style: TextStyle(
                          color: isMe ? Colors.white : AppColors.textPrimary,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${message.createdAt.hour.toString().padLeft(2, '0')}:${message.createdAt.minute.toString().padLeft(2, '0')}',
                        style: TextStyle(
                          color: isMe ? Colors.white70 : AppColors.textSecondary,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border(top: BorderSide(color: AppColors.divider)),
          ),
          child: SafeArea(
            child: Row(
              children: [
                Expanded(
                  child: AppInput(
                    controller: widget.messageController,
                    hintText: 'Type a message...',
                    onChanged: (value) {
                      setState(() => _isTyping = value.trim().isNotEmpty);
                    },
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: widget.onSend,
                  icon: Icon(
                    Icons.send,
                    color: _isTyping ? AppColors.primary : AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
