import type { Knex } from 'knex';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

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

const baseConfig: Partial<Knex.Config> = {
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
};

const knexConfig: KnexConfig = {
    development: {
        ...baseConfig,
        migrations: {
            directory: path.resolve(__dirname, 'src/db/migrations'),
            extension: 'ts',
        },
    },

    staging: {
        ...baseConfig,
        migrations: {
            tableName: 'knex_migrations',
        },
    },

    production: {
        ...baseConfig,
        migrations: {
            directory: path.resolve(__dirname, 'src/db/migrations'),
            extension: 'js',
            loadExtensions: ['.js'],
        },
    },
};

export default knexConfig;
