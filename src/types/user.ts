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
}

export interface UserFilters {
  page?: number;
  limit?: number;
  status?: string;
  verified?: boolean;
  search?: string;
}

