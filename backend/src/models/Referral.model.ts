export class ReferralModel {
  id: string;
  referrerId: string;
  refereeId?: string;
  code: string;
  status: string;
  rewardType: string;
  rewardAmount?: number;
  redeemedAt?: Date;
  createdAt: Date;
}

export class CreateReferralData {
  referrerId: string;
  code: string;
  rewardType?: string;
  rewardAmount?: number;
}

export class ReferralFilters {
  referrerId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalRewards: number;
}
