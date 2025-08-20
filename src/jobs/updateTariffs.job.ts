import { WBApiService } from '../services/wb.service';
import { TariffRepository } from '../db/repository';
import { GoogleSheetsService } from '../services/google.service';

export async function runTariffUpdateJob() {
    console.log('Starting tariff update job...');

    try {
        const wbService = new WBApiService();
        const tariffRepo = new TariffRepository();
        const googleService = new GoogleSheetsService();

        const today = new Date().toISOString().split('T')[0];

        if (!today) {
            throw new Error("Failed to get today's date");
        }

        const tariffData = await wbService.fetchBoxTariffs(today);

        if (tariffData && tariffData.warehouseList.length > 0) {
            await tariffRepo.upsertTariffs(today, tariffData.warehouseList);

            const actualTariffs = await tariffRepo.getActualTariffsForSheet();

            await googleService.updateSheets(actualTariffs);

            console.log('Tariff update job completed successfully!');
        } else {
            console.log('Tariff update job found no data to process.');
        }
    } catch (error) {
        console.log('An error occurred during tariff update job:', error);
    }
}
