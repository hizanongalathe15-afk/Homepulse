import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  const ApiException({
    required this.message,
    this.statusCode,
    this.data,
  });

  factory ApiException.fromDioError(dynamic error) {
    if (error is DioException) {
      final statusCode = error.response?.statusCode;
      final data = error.response?.data;
      String message = 'An unexpected error occurred';
      if (data is Map && data.containsKey('message')) {
        message = data['message'];
      } else if (error.message != null) {
        message = error.message!;
      }
      return ApiException(message: message, statusCode: statusCode, data: data);
    }
    return ApiException(message: error.toString());
  }

  @override
  String toString() => 'ApiException: $message${statusCode != null ? " (status: $statusCode)" : ""}';
}
