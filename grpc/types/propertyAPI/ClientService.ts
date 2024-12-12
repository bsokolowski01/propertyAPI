// Original file: grpc/proto/property.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Client as _propertyAPI_Client, Client__Output as _propertyAPI_Client__Output } from '../propertyAPI/Client';
import type { ClientId as _propertyAPI_ClientId, ClientId__Output as _propertyAPI_ClientId__Output } from '../propertyAPI/ClientId';
import type { Clients as _propertyAPI_Clients, Clients__Output as _propertyAPI_Clients__Output } from '../propertyAPI/Clients';
import type { DeleteClient as _propertyAPI_DeleteClient, DeleteClient__Output as _propertyAPI_DeleteClient__Output } from '../propertyAPI/DeleteClient';
import type { Query as _propertyAPI_Query, Query__Output as _propertyAPI_Query__Output } from '../propertyAPI/Query';

export interface ClientServiceClient extends grpc.Client {
  CreateClient(argument: _propertyAPI_Client, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  CreateClient(argument: _propertyAPI_Client, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  CreateClient(argument: _propertyAPI_Client, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  CreateClient(argument: _propertyAPI_Client, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  createClient(argument: _propertyAPI_Client, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  createClient(argument: _propertyAPI_Client, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  createClient(argument: _propertyAPI_Client, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  createClient(argument: _propertyAPI_Client, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  
  DeleteClient(argument: _propertyAPI_ClientId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteClient__Output>): grpc.ClientUnaryCall;
  DeleteClient(argument: _propertyAPI_ClientId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_DeleteClient__Output>): grpc.ClientUnaryCall;
  DeleteClient(argument: _propertyAPI_ClientId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteClient__Output>): grpc.ClientUnaryCall;
  DeleteClient(argument: _propertyAPI_ClientId, callback: grpc.requestCallback<_propertyAPI_DeleteClient__Output>): grpc.ClientUnaryCall;
  deleteClient(argument: _propertyAPI_ClientId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteClient__Output>): grpc.ClientUnaryCall;
  deleteClient(argument: _propertyAPI_ClientId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_DeleteClient__Output>): grpc.ClientUnaryCall;
  deleteClient(argument: _propertyAPI_ClientId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteClient__Output>): grpc.ClientUnaryCall;
  deleteClient(argument: _propertyAPI_ClientId, callback: grpc.requestCallback<_propertyAPI_DeleteClient__Output>): grpc.ClientUnaryCall;
  
  ReadClient(argument: _propertyAPI_ClientId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  ReadClient(argument: _propertyAPI_ClientId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  ReadClient(argument: _propertyAPI_ClientId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  ReadClient(argument: _propertyAPI_ClientId, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  readClient(argument: _propertyAPI_ClientId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  readClient(argument: _propertyAPI_ClientId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  readClient(argument: _propertyAPI_ClientId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  readClient(argument: _propertyAPI_ClientId, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  
  ReadClients(argument: _propertyAPI_Query, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Clients__Output>): grpc.ClientUnaryCall;
  ReadClients(argument: _propertyAPI_Query, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Clients__Output>): grpc.ClientUnaryCall;
  ReadClients(argument: _propertyAPI_Query, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Clients__Output>): grpc.ClientUnaryCall;
  ReadClients(argument: _propertyAPI_Query, callback: grpc.requestCallback<_propertyAPI_Clients__Output>): grpc.ClientUnaryCall;
  readClients(argument: _propertyAPI_Query, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Clients__Output>): grpc.ClientUnaryCall;
  readClients(argument: _propertyAPI_Query, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Clients__Output>): grpc.ClientUnaryCall;
  readClients(argument: _propertyAPI_Query, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Clients__Output>): grpc.ClientUnaryCall;
  readClients(argument: _propertyAPI_Query, callback: grpc.requestCallback<_propertyAPI_Clients__Output>): grpc.ClientUnaryCall;
  
  UpdateClient(argument: _propertyAPI_Client, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  UpdateClient(argument: _propertyAPI_Client, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  UpdateClient(argument: _propertyAPI_Client, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  UpdateClient(argument: _propertyAPI_Client, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  updateClient(argument: _propertyAPI_Client, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  updateClient(argument: _propertyAPI_Client, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  updateClient(argument: _propertyAPI_Client, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  updateClient(argument: _propertyAPI_Client, callback: grpc.requestCallback<_propertyAPI_Client__Output>): grpc.ClientUnaryCall;
  
}

export interface ClientServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateClient: grpc.handleUnaryCall<_propertyAPI_Client__Output, _propertyAPI_Client>;
  
  DeleteClient: grpc.handleUnaryCall<_propertyAPI_ClientId__Output, _propertyAPI_DeleteClient>;
  
  ReadClient: grpc.handleUnaryCall<_propertyAPI_ClientId__Output, _propertyAPI_Client>;
  
  ReadClients: grpc.handleUnaryCall<_propertyAPI_Query__Output, _propertyAPI_Clients>;
  
  UpdateClient: grpc.handleUnaryCall<_propertyAPI_Client__Output, _propertyAPI_Client>;
  
}

export interface ClientServiceDefinition extends grpc.ServiceDefinition {
  CreateClient: MethodDefinition<_propertyAPI_Client, _propertyAPI_Client, _propertyAPI_Client__Output, _propertyAPI_Client__Output>
  DeleteClient: MethodDefinition<_propertyAPI_ClientId, _propertyAPI_DeleteClient, _propertyAPI_ClientId__Output, _propertyAPI_DeleteClient__Output>
  ReadClient: MethodDefinition<_propertyAPI_ClientId, _propertyAPI_Client, _propertyAPI_ClientId__Output, _propertyAPI_Client__Output>
  ReadClients: MethodDefinition<_propertyAPI_Query, _propertyAPI_Clients, _propertyAPI_Query__Output, _propertyAPI_Clients__Output>
  UpdateClient: MethodDefinition<_propertyAPI_Client, _propertyAPI_Client, _propertyAPI_Client__Output, _propertyAPI_Client__Output>
}
