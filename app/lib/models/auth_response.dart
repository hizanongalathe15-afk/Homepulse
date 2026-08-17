import 'user.dart';

class AuthResponse {
  final User user;
  final String accessToken;

  AuthResponse({
    required this.user,
    required this.accessToken,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      user: User.fromJson(json['user'] as Map<String, dynamic>),
      accessToken: json['access_token'] as String,
    );
  }
}
