import api from './client';

export interface TerminalRequest {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  business_name: string;
  business_address: string;
  contact_phone: string;
  status: 'pending' | 'assigned' | 'rejected';
  terminal_serial_number: string | null;
  terminal_label: string | null;
  created_at: string;
}

export const terminalsApi = {
  getRequests: async (): Promise<TerminalRequest[]> => {
    const response = await api.get('/terminals/requests');
    return response.data.data;
  },

  rejectRequest: async (requestId: number) => {
    const response = await api.post(`/terminals/reject/${requestId}`);
    return response.data;
  },

  getAssignedTerminals: async (): Promise<TerminalRequest[]> => {
    const response = await api.get('/terminals/assigned');
    return response.data.data;
  },

  unmapTerminal: async (requestId: number, terminalSerialNumber: string, terminalLabel: string) => {
    const response = await api.post(`/terminals/unmap/${requestId}`, {
      terminal_serial_number: terminalSerialNumber,
      terminal_label: terminalLabel,
    });
    return response.data;
  },

  assignTerminal: async (requestId: number, serialNumber: string, terminalLabel?: string) => {
    const response = await api.post(`/terminals/assign/${requestId}`, {
      serialNumber,
      terminalLabel,
    });
    return response.data;
  },
};
