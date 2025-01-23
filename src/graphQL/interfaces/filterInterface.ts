export interface StringFilter {
    eq?: string;
    contains?: string;
    ne?: string;
    notContains?: string;
}

export interface IntFilter {
    eq?: number;
    gt?: number;
    lt?: number;
    gte?: number;
    lte?: number;
}

export interface DateFilter {
    eq?: Date;
    gt?: Date;
    lt?: Date;
    gte?: Date;
    lte?: Date;
}

interface DateRangeFilter {
    start?: DateFilter;
    end?: DateFilter;
}

interface ClientFilter {
    name?: StringFilter;
    email?: StringFilter;
    phone?: StringFilter;
    address?: StringFilter;
}

interface PropertyFilter {
    address?: StringFilter;
    description?: StringFilter;
    rooms?: IntFilter;
    surfaceArea?: IntFilter;
    status?: StringFilter;
    type?: StringFilter;
    rent?: IntFilter;
    price?: IntFilter;
    pricePerMeter?: IntFilter;
}

interface ReservationFilter {
    propertyId?: IntFilter;
    clientId?: IntFilter;
    date?: DateRangeFilter;
}

export interface SortInput {
    field: string;
    order: 'asc' | 'desc';
}

interface QueryParams {
    sort: SortInput;
    page: number;
    pageSize: number;
}

export interface ClientQueryParams extends QueryParams {
    filter: ClientFilter;
}
 
export interface PropertyQueryParams extends QueryParams{
    filter: PropertyFilter;
}

export interface ReservationQueryParams extends QueryParams{
    filter: ReservationFilter;
}
