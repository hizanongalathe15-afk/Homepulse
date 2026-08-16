import QRCode from 'qrcode';
import { logger } from '../config/logger.config';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCode;
  } catch (error) {
    logger.error('Failed to generate QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateQRCodeBuffer = async (data: string): Promise<Buffer> => {
  try {
    const buffer = await QRCode.toBuffer(data, {
      width: 300,
      margin: 2,
    });
    return buffer;
  } catch (error) {
    logger.error('Failed to generate QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
};

export const validateQRCodeData = (data: string): boolean => {
  try {
    const parsed = JSON.parse(data);
    return !!parsed.propertyId && !!parsed.code;
  } catch {
    return false;
  }
};
