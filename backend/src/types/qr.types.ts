import { PropertyType } from '@prisma/client';

export interface QRCodeType {
  id: string;
  propertyId: string;
  userId: string;
  code: string;
  expiresAt: Date;
  scans: number;
  maxScans: number;
  status: string;
  createdAt: Date;
}

export interface CreateQRCodeData {
  propertyId: string;
  userId: string;
  maxScans?: number;
}

export interface ScanResult {
  success: boolean;
  property?: PropertyType;
  message?: string;
}
