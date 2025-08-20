import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tariffs', (table) => {
        table.increments('id').primary();
        table.date('date').notNullable();
        table.string('warehouseName').notNullable();
        table.string('geoName');

        // доставка
        table.float('boxDeliveryBase').notNullable();
        table.integer('boxDeliveryCoefExpr').notNullable();
        table.float('boxDeliveryLiter').notNullable();

        // маркетплейс
        table.float('boxDeliveryMarketplaceBase').notNullable();
        table.integer('boxDeliveryMarketplaceCoefExpr').notNullable();
        table.float('boxDeliveryMarketplaceLiter').notNullable();

        // хранение
        table.float('boxStorageBase').notNullable();
        table.integer('boxStorageCoefExpr').notNullable();
        table.float('boxStorageLiter').notNullable();

        table.timestamps(true, true);

        table.unique(['date', 'warehouseName']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('tariffs');
}
