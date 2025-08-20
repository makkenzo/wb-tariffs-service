import { google } from 'googleapis';
import { ActualTariff } from '../types';

const SHEET_NAME = 'stocks_coefs';

export class GoogleSheetsService {
    private readonly sheets;
    private readonly sheetIds: string[];

    constructor() {
        const credentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
        const sheetIdsString = process.env.GOOGLE_SHEET_IDS;

        if (!credentialsBase64 || !sheetIdsString) {
            throw new Error('GOOGLE_CREDENTIALS_BASE64 and GOOGLE_SHEET_IDS are not defined in .env file');
        }

        const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
        const credentialsObject = JSON.parse(credentialsJson);

        const auth = new google.auth.GoogleAuth({
            credentials: credentialsObject,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth });
        this.sheetIds = sheetIdsString.split(',').filter(Boolean);
    }

    private async ensureSheetExists(spreadsheetId: string): Promise<void> {
        try {
            const spreadsheetInfo = await this.sheets.spreadsheets.get({
                spreadsheetId,
            });

            const sheetExists = spreadsheetInfo.data.sheets?.some((sheet) => sheet.properties?.title === SHEET_NAME);

            if (!sheetExists) {
                console.log(`[Sheet ID: ${spreadsheetId}] Sheet not found. Creating '${SHEET_NAME}'...`);
                await this.sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: {
                        requests: [
                            {
                                addSheet: {
                                    properties: {
                                        title: SHEET_NAME,
                                    },
                                },
                            },
                        ],
                    },
                });
            } else {
                console.log(`Sheet '${SHEET_NAME}' already exists in Sheet ID ${spreadsheetId}.`);
            }
        } catch (error) {
            throw new Error(`Failed to ensure sheet exists: ${error}`);
        }
    }

    async updateSheets(tariffs: ActualTariff[]): Promise<void> {
        if (this.sheetIds.length === 0) {
            console.log('No Google Sheets IDs provided. Skipping update.');
            return;
        }
        if (tariffs.length === 0) {
            console.log('No tariffs to update. Skipping update.');
            return;
        }

        const headers = Object.keys(tariffs[0]!);
        const values = [
            headers,
            ...tariffs.map((tariff) => headers.map((header) => tariff[header as keyof ActualTariff])),
        ];

        for (const sheetId of this.sheetIds) {
            try {
                await this.ensureSheetExists(sheetId);

                const range = `${SHEET_NAME}!A1`;

                await this.sheets.spreadsheets.values.clear({
                    spreadsheetId: sheetId,
                    range: SHEET_NAME,
                });

                await this.sheets.spreadsheets.values.update({
                    spreadsheetId: sheetId,
                    range: range,
                    valueInputOption: 'USER_ENTERED',
                    requestBody: { values },
                });
            } catch (error) {
                console.error(`Error updating sheet with ID ${sheetId}:`, error);
            }
        }
    }
}
