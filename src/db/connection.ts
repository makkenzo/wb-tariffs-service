import Knex from 'knex';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';

const config = knexConfig[environment as keyof typeof knexConfig];

if (!config) {
    throw new Error(`Knex configuration for environment "${environment}" not found.`);
}

export const knex = Knex(config);
