export interface Reservation {
    id: number;
    propertyId: number;
    clientId: number;
    date: {
        start: Date;
        end: Date;
    }
}