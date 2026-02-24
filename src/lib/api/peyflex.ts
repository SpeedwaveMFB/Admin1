import apiClient from './client';
import { ApiResponse } from '@/types/api';
import {
    AirtimeNetwork,
    PurchaseAirtimePayload,
    DataNetwork,
    DataPlan,
    PurchaseDataPayload,
    CableProvider,
    CablePlan,
    VerifyCableResponse,
    SubscribeCablePayload,
    ElectricityProvider,
    VerifyElectricityResponse,
    RechargeElectricityPayload,
} from '@/types/peyflex';

export const peyflexApi = {
    // Airtime
    getAirtimeNetworks: async () => {
        const response = await apiClient.get<AirtimeNetwork[]>('/peyflex/airtime/networks');
        // Note: User showed array response directly, but client.ts usually wraps in ApiResponse or returns data.
        // Based on client.ts: `response.data` is returned. If the API returns the array directly as root, TS needs to know.
        // However, usually our apiClient wraps/unwraps or expects a standard format.
        // Let's assume the API returns standard ApiResponse structure OR we accept `any` to be safe if it varies.
        // The user example shows just `[...]`.
        return response.data;
    },

    purchaseAirtime: async (payload: { network: string; amount: number; phone: string; pin: string }) => {
        const response = await apiClient.post<ApiResponse>('/peyflex/airtime/purchase', payload);
        return response.data;
    },

    // Data
    getDataNetworks: async () => {
        const response = await apiClient.get<DataNetwork[]>('/peyflex/data/networks');
        return response.data;
    },

    getDataPlans: async (networkId: string) => {
        const response = await apiClient.get<DataPlan[]>('/peyflex/data/plans', {
            params: { network: networkId },
        });
        return response.data;
    },

    purchaseData: async (payload: { network: string; plan: string; phone: string; pin: string }) => {
        const response = await apiClient.post<ApiResponse>('/peyflex/data/purchase', payload);
        return response.data;
    },

    // Cable TV
    getCableProviders: async () => {
        const response = await apiClient.get<CableProvider[]>('/peyflex/cable/providers');
        return response.data;
    },

    getCablePlans: async () => {
        const response = await apiClient.get<CablePlan[]>('/peyflex/cable/plans');
        return response.data;
    },

    verifyCable: async (provider: string, iuc: string) => {
        const response = await apiClient.post<VerifyCableResponse>('/peyflex/cable/verify', {
            provider,
            iuc,
        });
        return response.data;
    },

    subscribeCable: async (payload: { provider: string; plan: string; iuc: string; pin: string }) => {
        const response = await apiClient.post<ApiResponse>('/peyflex/cable/subscribe', payload);
        return response.data;
    },

    // Electricity
    getElectricityPlans: async () => {
        // Returns providers
        const response = await apiClient.get<ElectricityProvider[]>('/peyflex/electricity/plans');
        return response.data;
    },

    verifyElectricity: async (meter: string, providerId: string, type: 'prepaid' | 'postpaid') => {
        const response = await apiClient.get<VerifyElectricityResponse>('/peyflex/electricity/verify', {
            params: {
                meter,
                plan: providerId, // 'plan' param maps to provider ID
                type,
            },
        });
        return response.data;
    },

    rechargeElectricity: async (payload: { provider: string; meter: string; amount: number; type: string; pin: string }) => {
        const response = await apiClient.post<ApiResponse>('/peyflex/electricity/recharge', payload);
        return response.data;
    },
};
