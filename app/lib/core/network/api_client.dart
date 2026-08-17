import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:homepulse/core/config/constants.dart';
import 'api_exception.dart';

class ApiClient {
  final Dio dio;
  final String baseUrl;

  ApiClient({
    required this.baseUrl,
    Dio? dioInstance,
  }) : dio = dioInstance ?? Dio(BaseOptions(
         baseUrl: baseUrl,
         connectTimeout: const Duration(seconds: 30),
         receiveTimeout: const Duration(seconds: 30),
         headers: {'Content-Type': 'application/json'},
       )) {
    _setupInterceptors();
  }

  void _setupInterceptors() {
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _getStoredToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          await _clearToken();
        }
        final apiException = ApiException.fromDioError(error);
        return handler.reject(DioException(
          requestOptions: error.requestOptions,
          error: apiException,
          response: error.response,
          type: error.type,
        ));
      },
    ));
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) async {
    try {
      return await dio.get(path, queryParameters: queryParameters);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Response> post(String path, {dynamic data}) async {
    try {
      return await dio.post(path, data: data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Response> put(String path, {dynamic data}) async {
    try {
      return await dio.put(path, data: data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Response> patch(String path, {dynamic data}) async {
    try {
      return await dio.patch(path, data: data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<Response> delete(String path) async {
    try {
      return await dio.delete(path);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  Future<String?> _getStoredToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(Constants.sessionTokenKey);
  }

  Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(Constants.sessionTokenKey);
  }
}
