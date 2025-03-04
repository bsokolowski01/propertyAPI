// Original file: grpc/proto/property.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DeleteProperty as _propertyAPI_DeleteProperty, DeleteProperty__Output as _propertyAPI_DeleteProperty__Output } from './DeleteProperty';
import type { Properties as _propertyAPI_Properties, Properties__Output as _propertyAPI_Properties__Output } from './Properties';
import type { Property as _propertyAPI_Property, Property__Output as _propertyAPI_Property__Output } from './Property';
import type { PropertyId as _propertyAPI_PropertyId, PropertyId__Output as _propertyAPI_PropertyId__Output } from './PropertyId';
import type { Query as _propertyAPI_Query, Query__Output as _propertyAPI_Query__Output } from './Query';

export interface PropertyServiceClient extends grpc.Client {
  CreateProperty(argument: _propertyAPI_Property, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  CreateProperty(argument: _propertyAPI_Property, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  CreateProperty(argument: _propertyAPI_Property, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  CreateProperty(argument: _propertyAPI_Property, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  createProperty(argument: _propertyAPI_Property, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  createProperty(argument: _propertyAPI_Property, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  createProperty(argument: _propertyAPI_Property, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  createProperty(argument: _propertyAPI_Property, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  
  DeleteProperty(argument: _propertyAPI_PropertyId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteProperty__Output>): grpc.ClientUnaryCall;
  DeleteProperty(argument: _propertyAPI_PropertyId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_DeleteProperty__Output>): grpc.ClientUnaryCall;
  DeleteProperty(argument: _propertyAPI_PropertyId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteProperty__Output>): grpc.ClientUnaryCall;
  DeleteProperty(argument: _propertyAPI_PropertyId, callback: grpc.requestCallback<_propertyAPI_DeleteProperty__Output>): grpc.ClientUnaryCall;
  deleteProperty(argument: _propertyAPI_PropertyId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteProperty__Output>): grpc.ClientUnaryCall;
  deleteProperty(argument: _propertyAPI_PropertyId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_DeleteProperty__Output>): grpc.ClientUnaryCall;
  deleteProperty(argument: _propertyAPI_PropertyId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_DeleteProperty__Output>): grpc.ClientUnaryCall;
  deleteProperty(argument: _propertyAPI_PropertyId, callback: grpc.requestCallback<_propertyAPI_DeleteProperty__Output>): grpc.ClientUnaryCall;
  
  ReadProperties(argument: _propertyAPI_Query, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Properties__Output>): grpc.ClientUnaryCall;
  ReadProperties(argument: _propertyAPI_Query, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Properties__Output>): grpc.ClientUnaryCall;
  ReadProperties(argument: _propertyAPI_Query, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Properties__Output>): grpc.ClientUnaryCall;
  ReadProperties(argument: _propertyAPI_Query, callback: grpc.requestCallback<_propertyAPI_Properties__Output>): grpc.ClientUnaryCall;
  readProperties(argument: _propertyAPI_Query, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Properties__Output>): grpc.ClientUnaryCall;
  readProperties(argument: _propertyAPI_Query, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Properties__Output>): grpc.ClientUnaryCall;
  readProperties(argument: _propertyAPI_Query, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Properties__Output>): grpc.ClientUnaryCall;
  readProperties(argument: _propertyAPI_Query, callback: grpc.requestCallback<_propertyAPI_Properties__Output>): grpc.ClientUnaryCall;
  
  ReadProperty(argument: _propertyAPI_PropertyId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  ReadProperty(argument: _propertyAPI_PropertyId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  ReadProperty(argument: _propertyAPI_PropertyId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  ReadProperty(argument: _propertyAPI_PropertyId, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  readProperty(argument: _propertyAPI_PropertyId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  readProperty(argument: _propertyAPI_PropertyId, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  readProperty(argument: _propertyAPI_PropertyId, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  readProperty(argument: _propertyAPI_PropertyId, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  
  UpdateProperty(argument: _propertyAPI_Property, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  UpdateProperty(argument: _propertyAPI_Property, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  UpdateProperty(argument: _propertyAPI_Property, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  UpdateProperty(argument: _propertyAPI_Property, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  updateProperty(argument: _propertyAPI_Property, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  updateProperty(argument: _propertyAPI_Property, metadata: grpc.Metadata, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  updateProperty(argument: _propertyAPI_Property, options: grpc.CallOptions, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  updateProperty(argument: _propertyAPI_Property, callback: grpc.requestCallback<_propertyAPI_Property__Output>): grpc.ClientUnaryCall;
  
}

export interface PropertyServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateProperty: grpc.handleUnaryCall<_propertyAPI_Property__Output, _propertyAPI_Property>;
  
  DeleteProperty: grpc.handleUnaryCall<_propertyAPI_PropertyId__Output, _propertyAPI_DeleteProperty>;
  
  ReadProperties: grpc.handleUnaryCall<_propertyAPI_Query__Output, _propertyAPI_Properties>;
  
  ReadProperty: grpc.handleUnaryCall<_propertyAPI_PropertyId__Output, _propertyAPI_Property>;
  
  UpdateProperty: grpc.handleUnaryCall<_propertyAPI_Property__Output, _propertyAPI_Property>;
  
}

export interface PropertyServiceDefinition extends grpc.ServiceDefinition {
  CreateProperty: MethodDefinition<_propertyAPI_Property, _propertyAPI_Property, _propertyAPI_Property__Output, _propertyAPI_Property__Output>
  DeleteProperty: MethodDefinition<_propertyAPI_PropertyId, _propertyAPI_DeleteProperty, _propertyAPI_PropertyId__Output, _propertyAPI_DeleteProperty__Output>
  ReadProperties: MethodDefinition<_propertyAPI_Query, _propertyAPI_Properties, _propertyAPI_Query__Output, _propertyAPI_Properties__Output>
  ReadProperty: MethodDefinition<_propertyAPI_PropertyId, _propertyAPI_Property, _propertyAPI_PropertyId__Output, _propertyAPI_Property__Output>
  UpdateProperty: MethodDefinition<_propertyAPI_Property, _propertyAPI_Property, _propertyAPI_Property__Output, _propertyAPI_Property__Output>
}
