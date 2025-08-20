import axios from 'axios';

const wbApiToken = process.env.WB_API_TOKEN;
if (!wbApiToken) {
    throw new Error('WB_API_TOKEN is not defined in .env file');
}

export const wbApiClient = axios.create({
    baseURL: 'https://common-api.wildberries.ru/api/v1',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${wbApiToken}`,
    },
    timeout: 10000,
});
