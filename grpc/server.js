import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { clientService } from './services/clientService.js';
import { propertyService } from './services/propertyService.js';
import { reservationService } from './services/reservationService.js';

const packageDefinition = protoLoader.loadSync('grpc/proto/property.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition).propertyAPI;

const server = new grpc.Server();

// Client
server.addService(proto.ClientService.service, clientService);

// Property
server.addService(proto.PropertyService.service, propertyService);

// Reservation
server.addService(proto.ReservationService.service, reservationService);

server.bindAsync("127.0.0.1:9191", grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server (gRPC) started on port ${port}`);
});

