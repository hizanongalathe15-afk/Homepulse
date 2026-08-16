import otplib from 'otplib';
import { logger } from '../config/logger.config';

export interface OTPData {
  code: string;
  expiresAt: Date;
  attempts: number;
}

const otpStore = new Map<string, OTPData>();

export const generateOTP = (): string => {
  const length = Number(process.env['OTP_LENGTH']) || 6;
  return otplib.authenticator.generateSecret(length);
};

export const sendOTP = (email: string): { code: string; expiresAt: Date } => {
  const code = generateOTP();
  const expiryMinutes = Number(process.env['OTP_EXPIRY_MINUTES']) || 10;
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  otpStore.set(email, { code, expiresAt, attempts: 0 });

  logger.info(`OTP generated for ${email}`);
  return { code, expiresAt };
};

export const verifyOTP = (email: string, code: string): boolean => {
  const otpData = otpStore.get(email);

  if (!otpData) {
    return false;
  }

  if (new Date() > otpData.expiresAt) {
    otpStore.delete(email);
    return false;
  }

  const maxAttempts = Number(process.env['OTP_MAX_ATTEMPTS']) || 5;
  if (otpData.attempts >= maxAttempts) {
    otpStore.delete(email);
    return false;
  }

  if (otpData.code !== code) {
    otpData.attempts++;
    return false;
  }

  otpStore.delete(email);
  return true;
};

export const clearOTP = (email: string): void => {
  otpStore.delete(email);
};
