import 'dotenv/config';
import { knex } from './db/connection';
import { WBApiService } from './services/wb.service';
import { TariffRepository } from './db/repository';

async function main() {
    try {
        await knex.raw('SELECT 1');
        console.log('Database connection successful!');

        await knex.migrate.latest();
        console.log('Database migrations completed successfully!');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }

    try {
        const wbService = new WBApiService();
        const tariffRepo = new TariffRepository();

        const today = new Date().toISOString().split('T')[0];

        if (!today) {
            throw new Error("Failed to get today's date");
        }

        const tariffData = await wbService.fetchBoxTariffs(today);

        if (tariffData && tariffData.warehouseList.length > 0) {
            await tariffRepo.upsertTariffs(today, tariffData.warehouseList);
        } else {
            console.log('No tariff data available for today.');
        }
    } catch (error) {
        console.log('An error occurred:', error);
    }

    console.log('Application is running and ready for tasks.');
}

main();
