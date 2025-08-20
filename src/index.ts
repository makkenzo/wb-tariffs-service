import 'dotenv/config';
import { knex } from './db/connection';

async function main() {
    console.log('Application starting...');

    try {
        await knex.raw('SELECT 1');
        console.log('Database connection successful!');

        await knex.migrate.latest();
        console.log('Database migrations completed successfully!');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }

    console.log('Application is running and ready for tasks.');
}

main();
