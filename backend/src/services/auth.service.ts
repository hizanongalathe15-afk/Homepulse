import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { ValidationUtils } from '../utils/validators';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { sendOTP, verifyOTP } from '../utils/otp';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { NotificationService } from '../services/notification.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export class AuthService {
  private prisma: PrismaClient;
  private emailService: EmailService;
  private smsService: SmsService;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, emailService: EmailService, smsService: SmsService, notificationService: NotificationService) {
    this.prisma = prisma;
    this.emailService = emailService;
    this.smsService = smsService;
    this.notificationService = notificationService;
  }

  async register(data: RegisterRequest) {
    try {
      if (!ValidationUtils.isEmail(data.email)) {
        throw new AppError('Invalid email format', 400);
      }

      if (!ValidationUtils.isStrongPassword(data.password)) {
        throw new AppError('Password must be at least 8 characters with uppercase, lowercase, and number', 400);
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      const hashedPassword = await hashPassword(data.password);

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || '',
          role: ((data.role as any) || 'TENANT') as any,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true,
          createdAt: true,
        },
      });

      const otpResult = sendOTP(data.email);

      await this.emailService.sendEmail({
        to: data.email,
        subject: 'Verify your email - HomePulse',
        html: `<p>Your OTP is: <strong>${otpResult.code}</strong></p><p>This code expires in 10 minutes.</p>`,
        text: `Your OTP is: ${otpResult.code}`,
      });

      await this.notificationService.sendNotification({
        userId: user.id,
        type: 'WELCOME',
        title: 'Welcome to HomePulse!',
        message: 'Please verify your email to get started.',
      });

      logger.info(`User registered: ${user.email}`);

      return {
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: { user, otpExpiresAt: otpResult.expiresAt },
      };
    } catch (error) {
      logger.error('Registration failed:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Registration failed', 500);
    }
  }

  async login(data: LoginRequest) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true, email: true, password: true, firstName: true, lastName: true, role: true, isVerified: true, isActive: true, status: true },
      });

      if (!user || !user.password) {
        throw new AppError('Invalid email or password', 401);
      }

      if (user.status === 'INACTIVE') {
        throw new AppError('Your account has been deactivated', 401);
      }

      const isPasswordValid = await comparePassword(data.password, user.password);

      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastSeen: new Date() },
      });

      logger.info(`User logged in: ${user.email}`);

      return {
        success: true,
        data: {
          token: accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified,
          },
        },
      };
    } catch (error) {
      logger.error('Login failed:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Login failed', 500);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded: TokenPayload = verifyRefreshToken(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 401);
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = generateAccessToken(tokenPayload);

      return {
        success: true,
        data: {
          token: newAccessToken,
          refreshToken,
        },
      };
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async forgotPassword(data: ForgotPasswordRequest) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return {
          success: true,
          message: 'If an account with that email exists, we have sent a password reset link.',
        };
      }

      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      await this.prisma.user.update({
        where: { email: data.email },
        data: { resetToken },
      });

      const resetLink = `${process.env['APP_URL']}/reset-password?token=${resetToken}`;

      await this.emailService.sendTemplateEmail(data.email, {
        subject: 'Password Reset Request',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        text: `Reset your password: ${resetLink}`,
      }, {});

      logger.info(`Password reset requested for: ${data.email}`);

      return {
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.',
      };
    } catch (error) {
      logger.error('Forgot password failed:', error);
      throw new AppError('Password reset request failed', 500);
    }
  }

  async resetPassword(data: ResetPasswordRequest) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { resetToken: data.token },
      });

      if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      const hashedPassword = await hashPassword(data.password);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
        },
      });

      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Password Reset Successful',
        html: '<p>Your password has been reset successfully.</p>',
        text: 'Your password has been reset successfully.',
      });

      logger.info(`Password reset for: ${user.email}`);

      return {
        success: true,
        message: 'Password reset successful',
      };
    } catch (error) {
      logger.error('Reset password failed:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Password reset failed', 500);
    }
  }

  async verifyEmail(email: string, otp: string) {
    try {
      const isValid = verifyOTP(email, otp);

      if (!isValid) {
        throw new AppError('Invalid or expired OTP', 400);
      }

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await this.prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });

      await this.notificationService.sendNotification({
        userId: user.id,
        type: 'EMAIL_VERIFIED',
        title: 'Email Verified',
        message: 'Your email has been verified successfully.',
      });

      logger.info(`Email verified: ${email}`);

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      logger.error('Email verification failed:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Email verification failed', 500);
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, password: true },
      });

      if (!user || !user.password) {
        throw new AppError('User not found', 404);
      }

      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      if (!ValidationUtils.isStrongPassword(newPassword)) {
        throw new AppError('New password must be at least 8 characters with uppercase, lowercase, and number', 400);
      }

      const hashedPassword = await hashPassword(newPassword);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      await this.notificationService.sendNotification({
        userId,
        type: 'PASSWORD_CHANGED',
        title: 'Password Changed',
        message: 'Your password has been changed successfully.',
      });

      logger.info(`Password changed for user: ${userId}`);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      logger.error('Change password failed:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Password change failed', 500);
    }
  }

  async getMe(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true,
          isActive: true,
          city: true,
          profileImage: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      logger.error('Get me failed:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get user', 500);
    }
  }

  async updateProfile(userId: string, data: any) {
    try {
      const allowedFields = ['firstName', 'lastName', 'phone', 'city', 'profileImage', 'bio'];

      const updateData: any = {};
      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          updateData[field] = data[field];
        }
      }

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          city: true,
          profileImage: true,
          bio: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      logger.error('Update profile failed:', error);
      throw new AppError('Profile update failed', 500);
    }
  }
}
