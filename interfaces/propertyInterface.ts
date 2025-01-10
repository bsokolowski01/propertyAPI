export interface Property {
    id: number;
    address: string;
    description: string;
    rooms: number;
    surfaceArea: string;
    status: PropertyStatus;
    type: PropertyType;
    price?: string;
    pricePerMeter?: string;
    rent?: string;
}

export enum PropertyStatus {
    FOR_SALE = 'for sale',
    SOLD = 'sold',
    RENTED = 'rented',
    FOR_RENT = 'for rent'
}

export enum PropertyType {
    HOUSE = 'house',
    APARTMENT = 'apartment',
    LAND = 'land'
}