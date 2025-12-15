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


