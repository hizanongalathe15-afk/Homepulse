import * as Sentry from '@sentry/node';
import { logger } from './logger.config';

export const sentryConfig = {
  dsn: process.env['SENTRY_DSN'],
  environment: process.env['SENTRY_ENVIRONMENT'] || 'development',
  tracesSampleRate: Number(process.env['SENTRY_TRACES_SAMPLE_RATE']) || 0.1,
  profilesSampleRate: Number(process.env['SENTRY_PROFILES_SAMPLE_RATE']) || 0.1,
};

export const initializeSentry = () => {
  if (sentryConfig.dsn) {
    Sentry.init({
      dsn: sentryConfig.dsn,
      environment: sentryConfig.environment,
      tracesSampleRate: sentryConfig.tracesSampleRate,
      profilesSampleRate: sentryConfig.profilesSampleRate,
    });
    logger.info('Sentry initialized');
  } else {
    logger.warn('Sentry DSN not configured');
  }
};
