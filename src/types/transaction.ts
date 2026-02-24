export interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'bank_transfer' | 'airtime' | 'data' | 'electricity' | 'cable_tv';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  description?: string;
  provider?: string;
  providerReference?: string;
  recipientId?: string;
  recipientAccountNumber?: string;
  recipientAccountName?: string;
  recipientBankCode?: string;
  recipientBankName?: string;
  transferFee?: number;
  serviceProvider?: string;
  serviceType?: string;
  phoneNumber?: string;
  meterNumber?: string;
  smartcardNumber?: string;
  customerName?: string;
  planName?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: any;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface TransactionStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
}

export interface BillUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  speedwaveId: string;
}

export interface BillTransaction extends Transaction {
  user?: BillUser;
}

export interface BillFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  telco?: string;
  phoneNumber?: string;
  provider?: string;
  meterNumber?: string;
  smartcardNumber?: string;
  search?: string;
  type?: 'airtime' | 'data' | 'electricity' | 'cable_tv';
}

export interface BillStatsSummary {
  totalTransactions: number;
  totalSuccessful: number;
  totalFailed: number;
  totalPending: number;
  totalRevenue: number;
  completedRevenue: number;
}

export interface BillStatsByType {
  type: 'airtime' | 'data' | 'electricity' | 'cable_tv';
  totalCount: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  totalAmount: number;
  completedAmount: number;
}

export interface BillStatsByProvider {
  type: string;
  provider: string;
  totalCount: number;
  successCount: number;
  failedCount: number;
  totalAmount: number;
  completedAmount: number;
}

export interface BillStats {
  summary: BillStatsSummary;
  byType: BillStatsByType[];
  byProvider: BillStatsByProvider[];
}



