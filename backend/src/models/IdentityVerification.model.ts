export class IdentityVerificationModel {
  id: string;
  userId: string;
  idType: string;
  idNumber: string;
  idImage?: string;
  status: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateIdentityVerificationData {
  userId: string;
  idType: string;
  idNumber: string;
  idImage?: string;
}

export class UpdateIdentityVerificationData {
  status?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
}
