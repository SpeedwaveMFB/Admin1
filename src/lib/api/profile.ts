import apiClient from './client';
import { ApiResponse } from '@/types/api';
import { SpeedTagLookupResponse } from '@/types/user';

export const profileApi = {
    setSpeedTag: async (speedTag: string) => {
        const response = await apiClient.put<ApiResponse>('/profile/speed-tag', {
            speedTag,
        });
        return response.data;
    },

    lookupSpeedTag: async (speedTag: string) => {
        // The endpoint is /api/v1/profile/lookup/:speedTag
        const response = await apiClient.get<ApiResponse<SpeedTagLookupResponse>>(`/profile/lookup/${speedTag}`);
        return response.data;
    },
};
