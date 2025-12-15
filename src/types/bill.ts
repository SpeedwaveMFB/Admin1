export interface BillPayment {
  id: string;
  userId: string;
  userName?: string;
  type: 'airtime' | 'data' | 'electricity' | 'cable_tv';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  provider: string;
  phoneNumber?: string;
  meterNumber?: string;
  smartcardNumber?: string;
  customerName?: string;
  planName?: string;
  reference: string;
  createdAt: string;
}

export interface BillStats {
  totalAirtime: number;
  totalData: number;
  totalElectricity: number;
  totalCable: number;
  successRate: number;
}


