import 'dotenv/config';
import { knex } from './db/connection';
import { scheduleTasks } from './cron/tasks';
import { runTariffUpdateJob } from './jobs/updateTariffs.job';

async function main() {
    try {
        await knex.migrate.latest();
        console.log('Database migrations completed successfully!');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }

    scheduleTasks();

    console.log('Scheduled tasks initialized. Starting tariff update job...');
    await runTariffUpdateJob();

    console.log('Application is running and scheduled tasks are active.');
}

main();
