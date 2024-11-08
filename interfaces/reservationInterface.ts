export interface Reservation {
    id: number;
    propertyId: number;
    clientId: number;
    date: {
        start: string;
        end: string;
    }
}