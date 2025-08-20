import type { Knex } from 'knex';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing env var: ${name}`);
    return value;
}

interface KnexConfig {
    development: Knex.Config;
    staging: Knex.Config;
    production: Knex.Config;
}

const knexConfig: KnexConfig = {
    development: {
        client: 'postgresql',
        connection: {
            host: getEnv('DB_HOST'),
            user: getEnv('DB_USER'),
            password: getEnv('DB_PASSWORD'),
            database: getEnv('DB_DATABASE'),
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: './src/db/migrations',
            extension: 'ts',
        },
    },

    staging: {
        client: 'postgresql',
        connection: {
            host: getEnv('DB_HOST'),
            user: getEnv('DB_USER'),
            password: getEnv('DB_PASSWORD'),
            database: getEnv('DB_DATABASE'),
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },

    production: {
        client: 'postgresql',
        connection: {
            host: getEnv('DB_HOST'),
            user: getEnv('DB_USER'),
            password: getEnv('DB_PASSWORD'),
            database: getEnv('DB_DATABASE'),
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};

export default knexConfig;
