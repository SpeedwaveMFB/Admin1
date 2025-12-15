export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  accountStatus: 'active' | 'suspended' | 'closed';
  isVerified: boolean;
  speedwaveId?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserDetail extends User {
  virtualAccount?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };

  // KYC fields
  kycStatus?: 'pending' | 'approved' | 'rejected';
  kycDocumentUrl?: string;
  kycNotes?: string;
  kycVerifiedBy?: string | null;
  kycVerifiedAt?: string | null;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  status?: string;
  verified?: boolean;
  search?: string;
}

export interface KycFilters {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: 'pending' | 'approved' | 'rejected';
}


