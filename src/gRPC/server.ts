import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './types/property';
import { clientService } from './services/clientService';
import { propertyService } from './services/propertyService';
import { reservationService } from './services/reservationService';

const packageDefinition = protoLoader.loadSync('src/grpc/proto/property.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const server = new grpc.Server();

// Client
server.addService(proto.propertyAPI.ClientService.service, clientService);

// Property
server.addService(proto.propertyAPI.PropertyService.service, propertyService);

// Reservation
server.addService(proto.propertyAPI.ReservationService.service, reservationService);

server.bindAsync("127.0.0.1:9191", grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server (gRPC) started on port ${port}`);
  }
});
