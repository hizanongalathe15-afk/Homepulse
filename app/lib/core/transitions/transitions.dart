import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

CustomTransitionPage<T> fadeScaleTransition<T>({
  required Widget child,
  required GoRouterState state,
  Duration transitionDuration = const Duration(milliseconds: 400),
  Curve curve = Curves.easeOutCubic,
}) {
  return CustomTransitionPage<T>(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final curved = CurvedAnimation(parent: animation, curve: curve);
      return FadeTransition(
        opacity: curved,
        child: ScaleTransition(
          scale: Tween<double>(begin: 0.95, end: 1.0).animate(curved),
          child: child,
        ),
      );
    },
    transitionDuration: transitionDuration,
    reverseTransitionDuration: transitionDuration ~/ 2,
  );
}

CustomTransitionPage<T> slideTransition<T>({
  required Widget child,
  required GoRouterState state,
  Offset begin = const Offset(1.0, 0.0),
  Duration transitionDuration = const Duration(milliseconds: 350),
  Curve curve = Curves.easeOutCubic,
}) {
  return CustomTransitionPage<T>(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final curved = CurvedAnimation(parent: animation, curve: curve);
      final offsetAnimation = Tween<Offset>(begin: begin, end: Offset.zero)
          .animate(curved);
      return FadeTransition(
        opacity: curved,
        child: SlideTransition(position: offsetAnimation, child: child),
      );
    },
    transitionDuration: transitionDuration,
    reverseTransitionDuration: transitionDuration ~/ 2,
  );
}

CustomTransitionPage<T> stackedTransition<T>({
  required Widget child,
  required GoRouterState state,
  Duration transitionDuration = const Duration(milliseconds: 400),
  Curve curve = Curves.easeOutCubic,
}) {
  return CustomTransitionPage<T>(
    key: state.pageKey,
    child: child,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final curved = CurvedAnimation(parent: animation, curve: curve);
      return FadeTransition(
        opacity: curved,
        child: child,
      );
    },
    transitionDuration: transitionDuration,
    reverseTransitionDuration: transitionDuration ~/ 2,
  );
}
