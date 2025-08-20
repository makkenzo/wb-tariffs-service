import { WBWarehouseTariff } from '../types';
import { knex } from './connection';

function parseWBNumber(value: string): number {
    if (typeof value !== 'string') return 0;
    return parseFloat(value.replace(',', '.')) || 0;
}

type TariffForDB = Omit<
    WBWarehouseTariff,
    | 'boxDeliveryBase'
    | 'boxDeliveryCoefExpr'
    | 'boxDeliveryLiter'
    | 'boxDeliveryMarketplaceBase'
    | 'boxDeliveryMarketplaceCoefExpr'
    | 'boxDeliveryMarketplaceLiter'
    | 'boxStorageBase'
    | 'boxStorageCoefExpr'
    | 'boxStorageLiter'
> & {
    date: string;
    boxDeliveryBase: number;
    boxDeliveryCoefExpr: number;
    boxDeliveryLiter: number;
    boxDeliveryMarketplaceBase: number;
    boxDeliveryMarketplaceCoefExpr: number;
    boxDeliveryMarketplaceLiter: number;
    boxStorageBase: number;
    boxStorageCoefExpr: number;
    boxStorageLiter: number;
};

export class TariffRepository {
    async upsertTariffs(date: string, tariffsFromApi: WBWarehouseTariff[]): Promise<void> {
        const tariffsForDB: TariffForDB[] = tariffsFromApi.map((apiTariff) => ({
            date: date,
            warehouseName: apiTariff.warehouseName,
            geoName: apiTariff.geoName,
            boxDeliveryBase: parseWBNumber(apiTariff.boxDeliveryBase),
            boxDeliveryCoefExpr: parseInt(apiTariff.boxDeliveryCoefExpr, 10) || 0,
            boxDeliveryLiter: parseWBNumber(apiTariff.boxDeliveryLiter),
            boxDeliveryMarketplaceBase: parseWBNumber(apiTariff.boxDeliveryMarketplaceBase),
            boxDeliveryMarketplaceCoefExpr: parseInt(apiTariff.boxDeliveryMarketplaceCoefExpr, 10) || 0,
            boxDeliveryMarketplaceLiter: parseWBNumber(apiTariff.boxDeliveryMarketplaceLiter),
            boxStorageBase: parseWBNumber(apiTariff.boxStorageBase),
            boxStorageCoefExpr: parseInt(apiTariff.boxStorageCoefExpr, 10) || 0,
            boxStorageLiter: parseWBNumber(apiTariff.boxStorageLiter),
        }));

        if (tariffsForDB.length === 0) {
            console.log('No tariffs to upsert. Skipping DB operation.');
            return;
        }

        await knex('tariffs').insert(tariffsForDB).onConflict(['date', 'warehouseName']).merge();
    }
}
