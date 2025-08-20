import cron from 'node-cron';
import { runTariffUpdateJob } from '../jobs/updateTariffs.job';

export function scheduleTasks() {
    cron.schedule('0 * * * *', async () => {
        console.log(`Running scheduled task at ${new Date().toISOString()}`);
        await runTariffUpdateJob();
    });
}
