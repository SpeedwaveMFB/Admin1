import api from './config';

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

    assignTerminal: async (requestId: number, serialNumber: string, terminalLabel?: string) => {
        const response = await api.post(\`/terminals/assign/\${requestId}\`, {
      serialNumber,
      terminalLabel,
    });
    return response.data;
  },
};
