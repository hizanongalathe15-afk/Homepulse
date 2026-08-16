export class QRCodeModel {
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

export class CreateQRCodeData {
  propertyId: string;
  userId: string;
  maxScans?: number;
}

export class ScanResult {
  success: boolean;
  property?: any;
  message?: string;
}
