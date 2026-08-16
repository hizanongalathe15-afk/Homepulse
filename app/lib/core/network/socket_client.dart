import 'dart:convert';
import 'dart:async';
import 'package:web_socket_channel/web_socket_channel.dart';

class SocketClient {
  final String url;
  WebSocketChannel? _channel;
  StreamController<dynamic>? _controller;
  final Map<String, Function(dynamic)> _listeners = {};
  bool _isConnected = false;

  SocketClient(this.url);

  bool get isConnected => _isConnected;

  Future<void> connect({String? token}) async {
    try {
      final uri = Uri.parse(url);
      _channel = WebSocketChannel.connect(uri);
      _controller = StreamController<dynamic>.broadcast();
      _controller!.addStream(_channel!.stream.map((data) {
        final decoded = jsonDecode(data);
        final event = decoded['event'] as String?;
        if (event != null && _listeners.containsKey(event)) {
          _listeners[event]!(decoded['payload']);
        }
        return decoded;
      }));
      _isConnected = true;
      if (token != null) {
        _send({'type': 'auth', 'token': token});
      }
    } catch (e) {
      _isConnected = false;
      rethrow;
    }
  }

  void on(String event, Function(dynamic) callback) {
    _listeners[event] = callback;
  }

  void off(String event) {
    _listeners.remove(event);
  }

  void _send(dynamic payload) {
    if (_channel != null && _isConnected) {
      _channel!.sink.add(jsonEncode(payload));
    }
  }

  void sendMessage(String event, dynamic payload) {
    _send({'type': event, 'payload': payload});
  }

  Future<void> disconnect() async {
    await _controller?.close();
    await _channel?.sink.close();
    _isConnected = false;
    _listeners.clear();
  }
}
