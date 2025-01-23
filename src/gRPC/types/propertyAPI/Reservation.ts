// Original file: grpc/proto/property.proto

import type { ReservationDate as _propertyAPI_ReservationDate, ReservationDate__Output as _propertyAPI_ReservationDate__Output } from './ReservationDate';

export interface Reservation {
  'id'?: (number);
  'propertyId'?: (number);
  'clientId'?: (number);
  'date'?: (_propertyAPI_ReservationDate);
}

export interface Reservation__Output {
  'id': (number);
  'propertyId': (number);
  'clientId': (number);
  'date': (_propertyAPI_ReservationDate__Output);
}
