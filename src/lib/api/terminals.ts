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
  paylony_terminal_id: string | null;
  device_name: string | null;
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

  assignTerminal: async (
    requestId: number,
    serialNumber: string,
    paylonyTerminalId: string,
    options?: { terminalLabel?: string; deviceName?: string }
  ) => {
    const payload: Record<string, unknown> = {
      serialNumber,
      paylonyTerminalId,
      terminalLabel: options?.terminalLabel,
    };
    const deviceName = options?.deviceName?.trim();
    if (deviceName) payload.deviceName = deviceName;

    const response = await api.post(`/terminals/assign/${requestId}`, payload);
    return response.data;
  },
};
