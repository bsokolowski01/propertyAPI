// Original file: grpc/proto/property.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DeleteReservation as _propertyAPI_DeleteReservation, DeleteReservation__Output as _propertyAPI_DeleteReservation__Output } from '../propertyAPI/DeleteReservation';
import type { Query as _propertyAPI_Query, Query__Output as _propertyAPI_Query__Output } from '../propertyAPI/Query';
import type { Reservation as _propertyAPI_Reservation, Reservation__Output as _propertyAPI_Reservation__Output } from '../propertyAPI/Reservation';
import type { ReservationId as _propertyAPI_ReservationId, ReservationId__Output as _propertyAPI_ReservationId__Output } from '../propertyAPI/ReservationId';
import type { Reservations as _propertyAPI_Reservations, Reservations__Output as _propertyAPI_Reservations__Output } from '../propertyAPI/Reservations';

export interface ReservationServiceClient extends grpc.Client {
  CreateReservation(argument: _propertyAPI_Reservation, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  CreateReservation(argument: _propertyAPI_Reservation, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  CreateReservation(argument: _propertyAPI_Reservation, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  CreateReservation(argument: _propertyAPI_Reservation, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  createReservation(argument: _propertyAPI_Reservation, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  createReservation(argument: _propertyAPI_Reservation, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  createReservation(argument: _propertyAPI_Reservation, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  createReservation(argument: _propertyAPI_Reservation, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  
  DeleteReservation(argument: _propertyAPI_ReservationId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteReservation__Output>): grpc.ClientUnaryCall;
  DeleteReservation(argument: _propertyAPI_ReservationId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_DeleteReservation__Output>): grpc.ClientUnaryCall;
  DeleteReservation(argument: _propertyAPI_ReservationId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteReservation__Output>): grpc.ClientUnaryCall;
  DeleteReservation(argument: _propertyAPI_ReservationId, callback: grpc.requestCallback<_propertyAPI_DeleteReservation__Output>): grpc.ClientUnaryCall;
  deleteReservation(argument: _propertyAPI_ReservationId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteReservation__Output>): grpc.ClientUnaryCall;
  deleteReservation(argument: _propertyAPI_ReservationId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_DeleteReservation__Output>): grpc.ClientUnaryCall;
  deleteReservation(argument: _propertyAPI_ReservationId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteReservation__Output>): grpc.ClientUnaryCall;
  deleteReservation(argument: _propertyAPI_ReservationId, callback: grpc.requestCallback<_propertyAPI_DeleteReservation__Output>): grpc.ClientUnaryCall;
  
  ReadReservation(argument: _propertyAPI_ReservationId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  ReadReservation(argument: _propertyAPI_ReservationId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  ReadReservation(argument: _propertyAPI_ReservationId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  ReadReservation(argument: _propertyAPI_ReservationId, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  readReservation(argument: _propertyAPI_ReservationId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  readReservation(argument: _propertyAPI_ReservationId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  readReservation(argument: _propertyAPI_ReservationId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  readReservation(argument: _propertyAPI_ReservationId, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  
  ReadReservations(argument: _propertyAPI_Query, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservations__Output>): grpc.ClientUnaryCall;
  ReadReservations(argument: _propertyAPI_Query, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Reservations__Output>): grpc.ClientUnaryCall;
  ReadReservations(argument: _propertyAPI_Query, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservations__Output>): grpc.ClientUnaryCall;
  ReadReservations(argument: _propertyAPI_Query, callback: grpc.requestCallback<_propertyAPI_Reservations__Output>): grpc.ClientUnaryCall;
  readReservations(argument: _propertyAPI_Query, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservations__Output>): grpc.ClientUnaryCall;
  readReservations(argument: _propertyAPI_Query, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Reservations__Output>): grpc.ClientUnaryCall;
  readReservations(argument: _propertyAPI_Query, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservations__Output>): grpc.ClientUnaryCall;
  readReservations(argument: _propertyAPI_Query, callback: grpc.requestCallback<_propertyAPI_Reservations__Output>): grpc.ClientUnaryCall;
  
  UpdateReservation(argument: _propertyAPI_Reservation, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  UpdateReservation(argument: _propertyAPI_Reservation, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  UpdateReservation(argument: _propertyAPI_Reservation, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  UpdateReservation(argument: _propertyAPI_Reservation, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  updateReservation(argument: _propertyAPI_Reservation, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  updateReservation(argument: _propertyAPI_Reservation, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  updateReservation(argument: _propertyAPI_Reservation, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  updateReservation(argument: _propertyAPI_Reservation, callback: grpc.requestCallback<_propertyAPI_Reservation__Output>): grpc.ClientUnaryCall;
  
}

export interface ReservationServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateReservation: grpc.handleUnaryCall<_propertyAPI_Reservation__Output, _propertyAPI_Reservation>;
  
  DeleteReservation: grpc.handleUnaryCall<_propertyAPI_ReservationId__Output, _propertyAPI_DeleteReservation>;
  
  ReadReservation: grpc.handleUnaryCall<_propertyAPI_ReservationId__Output, _propertyAPI_Reservation>;
  
  ReadReservations: grpc.handleUnaryCall<_propertyAPI_Query__Output, _propertyAPI_Reservations>;
  
  UpdateReservation: grpc.handleUnaryCall<_propertyAPI_Reservation__Output, _propertyAPI_Reservation>;
  
}

export interface ReservationServiceDefinition extends grpc.ServiceDefinition {
  CreateReservation: MethodDefinition<_propertyAPI_Reservation, _propertyAPI_Reservation, _propertyAPI_Reservation__Output, _propertyAPI_Reservation__Output>
  DeleteReservation: MethodDefinition<_propertyAPI_ReservationId, _propertyAPI_DeleteReservation, _propertyAPI_ReservationId__Output, _propertyAPI_DeleteReservation__Output>
  ReadReservation: MethodDefinition<_propertyAPI_ReservationId, _propertyAPI_Reservation, _propertyAPI_ReservationId__Output, _propertyAPI_Reservation__Output>
  ReadReservations: MethodDefinition<_propertyAPI_Query, _propertyAPI_Reservations, _propertyAPI_Query__Output, _propertyAPI_Reservations__Output>
  UpdateReservation: MethodDefinition<_propertyAPI_Reservation, _propertyAPI_Reservation, _propertyAPI_Reservation__Output, _propertyAPI_Reservation__Output>
}
