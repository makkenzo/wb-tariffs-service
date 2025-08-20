export interface WBWarehouseTariff {
    warehouseName: string;
    geoName: string;
    boxDeliveryBase: string;
    boxDeliveryCoefExpr: string;
    boxDeliveryLiter: string;
    boxDeliveryMarketplaceBase: string;
    boxDeliveryMarketplaceCoefExpr: string;
    boxDeliveryMarketplaceLiter: string;
    boxStorageBase: string;
    boxStorageCoefExpr: string;
    boxStorageLiter: string;
}

export interface WBBoxTariffResponseData {
    dtNextBox: string;
    dtTillMax: string;
    warehouseList: WBWarehouseTariff[];
}

export interface WBBoxTariffAPIResponse {
    response: {
        data: WBBoxTariffResponseData;
    };
}
