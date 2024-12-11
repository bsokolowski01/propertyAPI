import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ClientServiceClient as _propertyAPI_ClientServiceClient, ClientServiceDefinition as _propertyAPI_ClientServiceDefinition } from './propertyAPI/ClientService';
import type { PropertyServiceClient as _propertyAPI_PropertyServiceClient, PropertyServiceDefinition as _propertyAPI_PropertyServiceDefinition } from './propertyAPI/PropertyService';
import type { ReservationServiceClient as _propertyAPI_ReservationServiceClient, ReservationServiceDefinition as _propertyAPI_ReservationServiceDefinition } from './propertyAPI/ReservationService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition
    }
  }
  propertyAPI: {
    Client: MessageTypeDefinition
    ClientId: MessageTypeDefinition
    ClientService: SubtypeConstructor<typeof grpc.Client, _propertyAPI_ClientServiceClient> & { service: _propertyAPI_ClientServiceDefinition }
    Clients: MessageTypeDefinition
    DeleteClientResponse: MessageTypeDefinition
    DeletePropertyResponse: MessageTypeDefinition
    DeleteReservationResponse: MessageTypeDefinition
    Filter: MessageTypeDefinition
    Pagination: MessageTypeDefinition
    Properties: MessageTypeDefinition
    Property: MessageTypeDefinition
    PropertyId: MessageTypeDefinition
    PropertyService: SubtypeConstructor<typeof grpc.Client, _propertyAPI_PropertyServiceClient> & { service: _propertyAPI_PropertyServiceDefinition }
    Query: MessageTypeDefinition
    Reservation: MessageTypeDefinition
    ReservationDate: MessageTypeDefinition
    ReservationId: MessageTypeDefinition
    ReservationService: SubtypeConstructor<typeof grpc.Client, _propertyAPI_ReservationServiceClient> & { service: _propertyAPI_ReservationServiceDefinition }
    Reservations: MessageTypeDefinition
    Sort: MessageTypeDefinition
  }
}

