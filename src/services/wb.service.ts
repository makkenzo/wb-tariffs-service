import axios from 'axios';
import { WBBoxTariffAPIResponse, WBBoxTariffResponseData } from '../types';
import { wbApiClient } from './apiClient';

export class WBApiService {
    async fetchBoxTariffs(date: string): Promise<WBBoxTariffResponseData | null> {
        try {
            const response = await wbApiClient.get<WBBoxTariffAPIResponse>('/tariffs/box', {
                params: {
                    date,
                },
            });

            const tariffData = response.data.response.data;
            return tariffData;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching tariffs from WB API:', error.response?.data || error.message);
            } else {
                console.error('An unknown error occurred while fetching WB tariffs:', error);
            }
            return null;
        }
    }
}
